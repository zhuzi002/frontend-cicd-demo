import { describe, expect, it } from "vitest";
import { readBuildInfo } from "./build-info";

describe("readBuildInfo", () => {
  it("prefers the runtime values written by the container", () => {
    expect(
      readBuildInfo({
        APP_VERSION: "0.1.0",
        NEXT_PUBLIC_APP_VERSION: "0.0.1",
        GIT_SHA: "abc1234",
        NEXT_PUBLIC_GIT_SHA: "baked",
        BUILD_TIME: "2026-10-24T01:40:00.000Z",
      }),
    ).toEqual({
      version: "0.1.0",
      commit: "abc1234",
      builtAt: "2026-10-24T01:40:00.000Z",
    });
  });

  it("falls back to values inlined at build time", () => {
    expect(
      readBuildInfo({
        NEXT_PUBLIC_APP_VERSION: "0.1.0",
        NEXT_PUBLIC_GIT_SHA: "deadbee",
        NEXT_PUBLIC_BUILD_TIME: "2026-10-24T00:00:00.000Z",
      }),
    ).toEqual({
      version: "0.1.0",
      commit: "deadbee",
      builtAt: "2026-10-24T00:00:00.000Z",
    });
  });

  it("uses a readable placeholder when nothing was recorded", () => {
    expect(readBuildInfo({})).toEqual({
      version: "0.1.0",
      commit: "local",
      builtAt: "未记录",
    });
  });
});
