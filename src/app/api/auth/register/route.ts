import { NextResponse } from "next/server";
import {
  getBackendBaseUrl,
  missingBackendBaseUrlResponse,
} from "@/app/api/backend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const gatewayUrl = getBackendBaseUrl();

    if (!gatewayUrl) {
      return missingBackendBaseUrlResponse();
    }

    const resp = await fetch(`${gatewayUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await resp.text();
    const data = text ? JSON.parse(text) : null;

    if (!resp.ok) {
      return NextResponse.json(data, { status: resp.status });
    }

    const response = NextResponse.json({ ok: true }, { status: resp.status });

    if (data?.token) {
      response.cookies.set("token", data.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: "Error interno en registro" },
      { status: 500 }
    );
  }
}
