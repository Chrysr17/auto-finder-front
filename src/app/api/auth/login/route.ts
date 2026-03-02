import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json(); // { username, password }

  const gatewayUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!gatewayUrl) {
    return NextResponse.json({ message: "Falta NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const resp = await fetch(`${gatewayUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    // Propagamos error del backend sin filtrar detalle sensible
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: resp.status });
  }

  const data = (await resp.json()) as { token: string };

  const res = NextResponse.json({ ok: true });

  // Cookie httpOnly (no accesible desde JS)
  res.cookies.set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // opcional: expira en 1 día
    maxAge: 60 * 60 * 24,
  });

  return res;
}