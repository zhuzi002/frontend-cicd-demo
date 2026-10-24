import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ChecklistBoard } from "./checklist-board";
import { checklistStorageKey, resetChecklistMemory } from "@/lib/checklist";

const originalStorage = window.localStorage;

describe("ChecklistBoard", () => {
  beforeEach(() => {
    resetChecklistMemory();
    originalStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: originalStorage,
    });
  });

  it("starts empty, then keeps a checked item", () => {
    render(<ChecklistBoard />);

    expect(screen.getByText("还没开始")).toBeDefined();
    fireEvent.click(screen.getByRole("checkbox", { name: /代码检查通过/ }));
    expect(screen.getByText("进行中")).toBeDefined();
    expect(
      JSON.parse(originalStorage.getItem(checklistStorageKey) ?? "[]"),
    ).toEqual(["lint"]);
  });

  it("tells you when the browser refuses local storage", () => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem() {
          throw new Error("denied");
        },
        setItem() {
          throw new Error("denied");
        },
        clear() {},
        removeItem() {},
        key() {
          return null;
        },
        length: 0,
      },
    });

    render(<ChecklistBoard />);

    expect(
      screen.getByText("浏览器没有放开本地存储，勾选只会留在这次打开里。"),
    ).toBeDefined();
  });
});
