import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ServiceLogInput } from "@firearmour/shared";
import { ApiError } from "../api/client.js";

const { createServiceLog } = vi.hoisted(() => ({ createServiceLog: vi.fn() }));
vi.mock("../api/serviceLogs.js", () => ({ createServiceLog }));

const { enqueueServiceLog, getQueue, getQueueCount, processQueue } = await import("./syncQueue.js");
const { getOfflineDb } = await import("./db.js");

const samplePayload: ServiceLogInput = {
  serviceDate: new Date("2026-08-14"),
  technician: "Ama",
  notes: "",
  nextDueDate: new Date("2027-08-14"),
  clientRequestId: "test-request-id",
};

async function clearQueue() {
  const db = await getOfflineDb();
  const keys = await db.getAllKeys("syncQueue");
  for (const key of keys) await db.delete("syncQueue", key);
}

describe("syncQueue", () => {
  afterEach(async () => {
    await clearQueue();
    createServiceLog.mockReset();
  });

  it("enqueues an entry that shows up in the queue count", async () => {
    await enqueueServiceLog("unit-1", samplePayload);
    expect(await getQueueCount()).toBe(1);
  });

  it("removes an entry from the queue once it syncs successfully", async () => {
    createServiceLog.mockResolvedValue({ id: "log-1" });
    await enqueueServiceLog("unit-1", samplePayload);

    await processQueue();

    expect(createServiceLog).toHaveBeenCalledWith("unit-1", samplePayload);
    expect(await getQueueCount()).toBe(0);
  });

  it("keeps a server-rejected entry in the queue and still processes the rest", async () => {
    createServiceLog
      .mockRejectedValueOnce(new ApiError(404, "Unit not found"))
      .mockResolvedValueOnce({ id: "log-2" });
    await enqueueServiceLog("unit-bad", samplePayload);
    await enqueueServiceLog("unit-good", samplePayload);

    await processQueue();

    const remaining = await getQueue();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.unitId).toBe("unit-bad");
    expect(remaining[0]?.attempts).toBe(1);
    expect(remaining[0]?.lastError).toBe("Unit not found");
  });

  it("stops processing on a network-level failure, leaving later entries untouched", async () => {
    createServiceLog.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await enqueueServiceLog("unit-1", samplePayload);
    await enqueueServiceLog("unit-2", samplePayload);

    await processQueue();

    expect(createServiceLog).toHaveBeenCalledTimes(1);
    expect(await getQueueCount()).toBe(2);
  });
});
