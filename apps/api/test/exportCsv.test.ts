import { describe, expect, it } from "vitest";
import { escapeCsvField, toCsvRow } from "../src/lib/exportCsv.js";

describe("escapeCsvField", () => {
  it("passes plain values through untouched", () => {
    expect(escapeCsvField("Acme Fire Safety")).toBe("Acme Fire Safety");
  });

  it("quotes and escapes values containing commas", () => {
    expect(escapeCsvField("Accra, Ghana")).toBe('"Accra, Ghana"');
  });

  it("quotes and doubles embedded quotes", () => {
    expect(escapeCsvField('The "Main" Office')).toBe('"The ""Main"" Office"');
  });

  it("quotes values containing newlines", () => {
    expect(escapeCsvField("Line1\nLine2")).toBe('"Line1\nLine2"');
  });
});

describe("toCsvRow", () => {
  it("joins fields with commas and terminates with CRLF", () => {
    expect(toCsvRow(["a", "b", "c"])).toBe("a,b,c\r\n");
  });

  it("escapes fields that need it within a row", () => {
    expect(toCsvRow(["Acme, Inc.", "Accra"])).toBe('"Acme, Inc.",Accra\r\n');
  });
});
