import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getBackendBaseUrl,
  missingBackendBaseUrlResponse,
} from "@/app/api/backend";

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No auth" }, { status: 401 });
  }

  const gatewayUrl = getBackendBaseUrl();

  if (!gatewayUrl) {
    return missingBackendBaseUrlResponse();
  }

  const { searchParams } = new URL(req.url);
  const criterio = searchParams.get("criterio") ?? "general";

  const body = await req.json();

  const resp = await fetch(
    `${gatewayUrl}/api/comparar?criterio=${encodeURIComponent(criterio)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  return NextResponse.json(data, { status: resp.status });
}
