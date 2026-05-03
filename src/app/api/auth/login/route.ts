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

    const resp = await fetch(`${gatewayUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!resp.ok) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: resp.status }
      );
    }

    const data = await resp.json();

    const response = NextResponse.json({ ok: true });

    response.cookies.set("token", data.token, {
      httpOnly: true,
      secure: false, // en localhost mejor false
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Error interno en login" },
      { status: 500 }
    );
  }
}
