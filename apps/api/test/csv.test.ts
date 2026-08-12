import { describe, expect, it } from "vitest";
import { toCsv } from "../src/lib/csv.js";

describe("toCsv", () => {
  it("renders a header row and escapes commas/quotes/newlines", () => {
    const csv = toCsv(
      [
        { name: "Acme, Inc.", note: 'Says "hello"' },
        { name: "Line1\nLine2", note: "" },
      ],
      ["name", "note"],
    );
    const lines = csv.split("\n");
    expect(lines[0]).toBe("name,note");
    expect(lines[1]).toBe('"Acme, Inc.","Says ""hello"""');
    expect(csv).toContain('"Line1\nLine2"');
  });

  it("renders empty string for null/undefined values", () => {
    const csv = toCsv([{ a: null, b: undefined }], ["a", "b"]);
    expect(csv).toBe("a,b\n,");
  });
});
