import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const gatewayUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!gatewayUrl) {
      return NextResponse.json(
        { message: "Falta NEXT_PUBLIC_API_URL" },
        { status: 500 }
      );
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