import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getBackendBaseUrl,
  missingBackendBaseUrlResponse,
} from "@/app/api/backend";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ marca: string }> }
) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No auth" }, { status: 401 });
  }

  const gatewayUrl = getBackendBaseUrl();

  if (!gatewayUrl) {
    return missingBackendBaseUrlResponse();
  }

  const { marca } = await params;

  const resp = await fetch(
    `${gatewayUrl}/api/autos/marca/${encodeURIComponent(marca)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const text = await resp.text();
  const data = text ? JSON.parse(text) : [];

  return NextResponse.json(data, { status: resp.status });
}
