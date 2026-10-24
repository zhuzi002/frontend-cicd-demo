export type BuildInfo = {
  version: string;
  commit: string;
  builtAt: string;
};

type Env = Record<string, string | undefined>;

function first(env: Env, keys: string[], fallback: string) {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) return value;
  }
  return fallback;
}

export function readBuildInfo(env: Env): BuildInfo {
  return {
    version: first(env, ["APP_VERSION", "NEXT_PUBLIC_APP_VERSION"], "0.1.0"),
    commit: first(env, ["GIT_SHA", "NEXT_PUBLIC_GIT_SHA"], "local"),
    builtAt: first(env, ["BUILD_TIME", "NEXT_PUBLIC_BUILD_TIME"], "未记录"),
  };
}
