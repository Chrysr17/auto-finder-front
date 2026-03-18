import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No auth" }, { status: 401 });
  }

  const gatewayUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!gatewayUrl) {
    return NextResponse.json(
      { message: "Falta NEXT_PUBLIC_API_URL" },
      { status: 500 }
    );
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