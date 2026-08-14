import { describe, expect, it } from "vitest";
import { parseWebhookPayload } from "../src/lib/hubtelPayments.js";

describe("parseWebhookPayload", () => {
  it("returns null for a body that doesn't look like a Hubtel payload", () => {
    expect(parseWebhookPayload(null)).toBeNull();
    expect(parseWebhookPayload({})).toBeNull();
    expect(parseWebhookPayload({ foo: "bar" })).toBeNull();
  });

  it("parses a flat PascalCase payload as a successful payment", () => {
    const result = parseWebhookPayload({
      Status: "Success",
      ClientReference: "INV-0001",
      TransactionId: "txn-123",
    });
    expect(result).toEqual({ clientReference: "INV-0001", paid: true, transactionId: "txn-123" });
  });

  it("parses a nested Data envelope in camelCase as a successful payment", () => {
    const result = parseWebhookPayload({
      status: "success",
      data: { clientReference: "INV-0002", checkoutId: "chk-456" },
    });
    expect(result).toEqual({ clientReference: "INV-0002", paid: true, transactionId: "chk-456" });
  });

  it("marks a non-success status as not paid", () => {
    const result = parseWebhookPayload({ Status: "Failed", ClientReference: "INV-0003" });
    expect(result).toEqual({ clientReference: "INV-0003", paid: false, transactionId: undefined });
  });

  it("returns null when clientReference is missing", () => {
    expect(parseWebhookPayload({ Status: "Success" })).toBeNull();
  });
});
