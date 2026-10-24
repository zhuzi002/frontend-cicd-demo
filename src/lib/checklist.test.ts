import { describe, expect, it } from "vitest";
import { parseDone, summarize, toggleDone } from "./checklist";

describe("parseDone", () => {
  it("reads a list of ids", () => {
    expect(parseDone(JSON.stringify(["lint", "smoke"]))).toEqual([
      "lint",
      "smoke",
    ]);
  });

  it("drops malformed storage instead of throwing", () => {
    expect(parseDone("not-json")).toEqual([]);
    expect(parseDone(JSON.stringify({ lint: true }))).toEqual([]);
    expect(parseDone(JSON.stringify(["lint", 1, null]))).toEqual(["lint"]);
    expect(parseDone(null)).toEqual([]);
  });
});

describe("toggleDone", () => {
  it("adds and removes an id", () => {
    expect(toggleDone([], "lint")).toEqual(["lint"]);
    expect(toggleDone(["lint", "smoke"], "lint")).toEqual(["smoke"]);
  });
});

describe("summarize", () => {
  it("names the three progress states", () => {
    expect(summarize(6, 0)).toBe("还没开始");
    expect(summarize(6, 2)).toBe("进行中");
    expect(summarize(6, 6)).toBe("可以发布");
    expect(summarize(0, 0)).toBe("没有检查项");
  });
});
