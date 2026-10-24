import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  output: "standalone",
  // 开发服务器绑在 0.0.0.0 上时，浏览器从 127.0.0.1 打开会被当成跨站，
  // 热更新握手会被拒绝，页面停在静态壳上，筛选和检查单都不会响应。
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
