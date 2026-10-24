import { describe, expect, it } from "vitest";
import { filterReleases, releases } from "./releases";

describe("filterReleases", () => {
  it("returns every release, newest first, when the query is empty", () => {
    const result = filterReleases(releases, { environment: "all", keyword: "" });
    expect(result.map((release) => release.version)).toEqual([
      "0.1.0",
      "0.0.9",
      "0.0.8",
      "0.0.7",
      "0.0.6",
    ]);
  });

  it("keeps one environment", () => {
    const result = filterReleases(releases, {
      environment: "local",
      keyword: " ",
    });
    expect(result.map((release) => release.id)).toEqual(["rel-014", "rel-010"]);
  });

  it("matches version or summary, ignoring case and surrounding spaces", () => {
    const result = filterReleases(releases, {
      environment: "all",
      keyword: "  HEALTH  ",
    });
    expect(result.map((release) => release.id)).toEqual(["rel-013"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(
      filterReleases(releases, {
        environment: "production",
        keyword: "41821",
      }),
    ).toEqual([]);
  });
});
