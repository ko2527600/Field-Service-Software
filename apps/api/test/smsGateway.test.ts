import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { normalizePhoneNumber } from "../src/lib/smsGateway.js";

describe("normalizePhoneNumber", () => {
  const originalCountryCode = process.env.SMS_DEFAULT_COUNTRY_CODE;

  beforeEach(() => {
    delete process.env.SMS_DEFAULT_COUNTRY_CODE;
  });

  afterEach(() => {
    if (originalCountryCode === undefined) delete process.env.SMS_DEFAULT_COUNTRY_CODE;
    else process.env.SMS_DEFAULT_COUNTRY_CODE = originalCountryCode;
  });

  it("passes already-E.164 numbers through untouched", () => {
    expect(normalizePhoneNumber("+233244123456")).toBe("+233244123456");
  });

  it("strips a leading zero and prepends the default country code (Ghana)", () => {
    expect(normalizePhoneNumber("0244123456")).toBe("+233244123456");
  });

  it("strips formatting characters (spaces, dashes, parens)", () => {
    expect(normalizePhoneNumber("(024) 412-3456")).toBe("+233244123456");
  });

  it("uses SMS_DEFAULT_COUNTRY_CODE when set", () => {
    process.env.SMS_DEFAULT_COUNTRY_CODE = "+1";
    expect(normalizePhoneNumber("5550101")).toBe("+15550101");
  });

  it("returns null for an empty/whitespace-only number", () => {
    expect(normalizePhoneNumber("   ")).toBeNull();
  });
});
