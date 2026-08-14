import { describe, expect, it, vi } from "vitest";

const { capcom6Send, hubtelSend } = vi.hoisted(() => ({
  capcom6Send: vi.fn().mockResolvedValue({ ok: true }),
  hubtelSend: vi.fn().mockResolvedValue({ ok: true }),
}));
vi.mock("../src/lib/smsGateway.js", () => ({ sendSms: capcom6Send }));
vi.mock("../src/lib/hubtelSms.js", () => ({ sendSms: hubtelSend }));

const { sendSmsVia } = await import("../src/services/reminders.service.js");

describe("sendSmsVia", () => {
  it("routes to the capcom6 gateway by default", async () => {
    await sendSmsVia("CAPCOM6", "+233244123456", "hello");
    expect(capcom6Send).toHaveBeenCalledWith("+233244123456", "hello");
    expect(hubtelSend).not.toHaveBeenCalled();
  });

  it("routes to Hubtel when the business selects it", async () => {
    capcom6Send.mockClear();
    hubtelSend.mockClear();
    await sendSmsVia("HUBTEL", "+233244123456", "hello");
    expect(hubtelSend).toHaveBeenCalledWith("+233244123456", "hello");
    expect(capcom6Send).not.toHaveBeenCalled();
  });
});
