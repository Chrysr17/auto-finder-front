import { NextResponse } from "next/server";
import {
  getBackendBaseUrl,
  missingBackendBaseUrlResponse,
} from "@/app/api/backend";

export async function GET() {
  const gatewayUrl = getBackendBaseUrl();

  if (!gatewayUrl) {
    return missingBackendBaseUrlResponse();
  }

  const resp = await fetch(`${gatewayUrl}/api/categorias`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : [];

  return NextResponse.json(data, { status: resp.status });
}
