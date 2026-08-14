import type { ServiceLogInput } from "@firearmour/shared";
import { createServiceLog } from "../api/serviceLogs.js";
import { ApiError } from "../api/client.js";
import { getOfflineDb, type QueuedServiceLog } from "./db.js";

type Listener = () => void;
const listeners = new Set<Listener>();

/** Lets UI (e.g. the pending-sync badge) re-render whenever the queue changes. */
export function subscribeQueueChange(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

export async function enqueueServiceLog(unitId: string, payload: ServiceLogInput) {
  const db = await getOfflineDb();
  await db.add("syncQueue", { unitId, payload, createdAt: new Date().toISOString(), attempts: 0 });
  notify();
}

export async function getQueue(): Promise<QueuedServiceLog[]> {
  const db = await getOfflineDb();
  return db.getAll("syncQueue");
}

export async function getQueueCount(): Promise<number> {
  const db = await getOfflineDb();
  return db.count("syncQueue");
}

let processing = false;

/**
 * Pushes every queued service log to the server. Stops early on a
 * network-level failure (we're probably offline again), but keeps working
 * through the rest of the queue if a single entry is rejected by the server
 * (e.g. its unit was since archived) so one bad entry can't block the rest.
 */
export async function processQueue() {
  if (processing) return;
  processing = true;
  try {
    const db = await getOfflineDb();
    const entries = await db.getAll("syncQueue");
    for (const entry of entries) {
      try {
        await createServiceLog(entry.unitId, entry.payload);
        if (entry.id != null) await db.delete("syncQueue", entry.id);
        notify();
      } catch (err) {
        if (err instanceof ApiError) {
          if (entry.id != null) {
            await db.put("syncQueue", { ...entry, attempts: entry.attempts + 1, lastError: err.message });
          }
          notify();
          continue;
        }
        // Network-level failure -- we're likely offline again; stop and retry the whole queue next time.
        break;
      }
    }
  } finally {
    processing = false;
  }
}
