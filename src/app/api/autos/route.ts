import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ message: "No auth" }, { status: 401 });

  const gatewayUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!gatewayUrl) {
    return NextResponse.json({ message: "Falta NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const resp = await fetch(`${gatewayUrl}/autos`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  return NextResponse.json(data, { status: resp.status });
}