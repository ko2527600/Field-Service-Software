import { describe, expect, it, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge.js";

afterEach(cleanup);

describe("StatusBadge", () => {
  it("renders the correct label for each status", () => {
    const { rerender } = render(<StatusBadge status="ACTIVE" />);
    expect(screen.getByText("Active")).toBeTruthy();

    rerender(<StatusBadge status="DUE_SOON" />);
    expect(screen.getByText("Due Soon")).toBeTruthy();

    rerender(<StatusBadge status="EXPIRED" />);
    expect(screen.getByText("Expired")).toBeTruthy();
  });
});
