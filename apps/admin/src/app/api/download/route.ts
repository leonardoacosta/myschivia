import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { download } from "@tribal-cities/api";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const url = request.url.split("/").slice(5);

  const [year, fileName] = url;
  console.log("year:", year);
  console.log("fileName:", fileName);
  if (!year || !fileName) return NextResponse.json({ success: false });

  const file = await download(year, fileName);
  if (!file) return NextResponse.json({ success: false });

  return new NextResponse(file as any, {
    headers: { "Content-Disposition": `attachment; filename="${fileName}"` },
  });
}
