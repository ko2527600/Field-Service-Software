import { describe, expect, it } from "vitest";
import { getUnitStatus, DUE_SOON_WINDOW_DAYS } from "@firearmour/shared";

describe("getUnitStatus", () => {
  const now = new Date("2026-08-12T12:00:00Z");

  it("returns EXPIRED for a renewal date in the past", () => {
    const yesterday = new Date("2026-08-11T00:00:00Z");
    expect(getUnitStatus(yesterday, now)).toBe("EXPIRED");
  });

  it("returns EXPIRED for a renewal date of yesterday even with a time component", () => {
    const yesterday = new Date("2026-08-11T23:59:59Z");
    expect(getUnitStatus(yesterday, now)).toBe("EXPIRED");
  });

  it("returns DUE_SOON for today", () => {
    expect(getUnitStatus(new Date("2026-08-12T00:00:00Z"), now)).toBe("DUE_SOON");
  });

  it("returns DUE_SOON for exactly the boundary (30 days out)", () => {
    const boundary = new Date(now);
    boundary.setDate(boundary.getDate() + DUE_SOON_WINDOW_DAYS);
    expect(getUnitStatus(boundary, now)).toBe("DUE_SOON");
  });

  it("returns ACTIVE for 31 days out (just past the boundary)", () => {
    const justPast = new Date(now);
    justPast.setDate(justPast.getDate() + DUE_SOON_WINDOW_DAYS + 1);
    expect(getUnitStatus(justPast, now)).toBe("ACTIVE");
  });

  it("returns ACTIVE for a renewal date far in the future", () => {
    expect(getUnitStatus(new Date("2027-08-12T00:00:00Z"), now)).toBe("ACTIVE");
  });
});
