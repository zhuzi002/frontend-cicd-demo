import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReleaseBoard } from "./release-board";
import { releases } from "@/lib/releases";

describe("ReleaseBoard", () => {
  it("shows an empty state and can clear it", () => {
    render(<ReleaseBoard items={releases} />);

    fireEvent.change(screen.getByRole("textbox", { name: "搜索版本或说明" }), {
      target: { value: "没有这条发布" },
    });

    expect(screen.getByText("没有符合条件的发布")).toBeDefined();
    expect(screen.queryByRole("heading", { name: "0.1.0" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "清空筛选" }));

    expect(screen.getByRole("heading", { name: "0.1.0" })).toBeDefined();
  });

  it("filters to a single environment", () => {
    render(<ReleaseBoard items={releases} />);

    fireEvent.click(screen.getByRole("button", { name: "生产" }));

    expect(screen.getByRole("heading", { name: "0.0.8" })).toBeDefined();
    expect(screen.queryByRole("heading", { name: "0.1.0" })).toBeNull();
  });
});
