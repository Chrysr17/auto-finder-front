import { NextResponse } from "next/server";

export function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? null;
}

export function missingBackendBaseUrlResponse() {
  return NextResponse.json(
    { message: "Falta NEXT_PUBLIC_API_URL" },
    { status: 500 }
  );
}
