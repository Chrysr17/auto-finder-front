import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const resp = await fetch(`${gatewayUrl}/api/favoritos/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  return NextResponse.json(data, { status: resp.status });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const resp = await fetch(`${gatewayUrl}/api/favoritos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (resp.status === 204) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const text = await resp.text();
  const data = text ? JSON.parse(text) : { ok: resp.ok };

  return NextResponse.json(data, { status: resp.status });
}