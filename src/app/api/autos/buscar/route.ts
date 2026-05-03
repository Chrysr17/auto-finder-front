import { NextResponse } from "next/server";
import {
  getBackendBaseUrl,
  missingBackendBaseUrlResponse,
} from "@/app/api/backend";

export async function GET(req: Request) {
  const gatewayUrl = getBackendBaseUrl();

  if (!gatewayUrl) {
    return missingBackendBaseUrlResponse();
  }

  const { search } = new URL(req.url);

  const resp = await fetch(`${gatewayUrl}/api/autos/buscar${search}`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  return NextResponse.json(data, { status: resp.status });
}
