import { connection } from "next/server";
import { readBuildInfo } from "@/lib/build-info";

export async function GET() {
  await connection();
  const info = readBuildInfo(process.env);

  return Response.json(
    {
      ok: true,
      service: "zhanqiao",
      ...info,
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
