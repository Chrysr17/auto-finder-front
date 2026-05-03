import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getBackendBaseUrl,
  missingBackendBaseUrlResponse,
} from "@/app/api/backend";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No auth" }, { status: 401 });
  }

  const gatewayUrl = getBackendBaseUrl();

  if (!gatewayUrl) {
    return missingBackendBaseUrlResponse();
  }

  const { id } = await params;
  const body = await req.text();

  const resp = await fetch(`${gatewayUrl}/api/favoritos/${id}`, {
    method: "POST",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    },
    body: body || undefined,
    cache: "no-store",
  });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  return NextResponse.json(data, { status: resp.status });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No auth" }, { status: 401 });
  }

  const gatewayUrl = getBackendBaseUrl();

  if (!gatewayUrl) {
    return missingBackendBaseUrlResponse();
  }

  const { id } = await params;
  const body = await req.text();

  const resp = await fetch(`${gatewayUrl}/api/favoritos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body || "{}",
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

  const gatewayUrl = getBackendBaseUrl();

  if (!gatewayUrl) {
    return missingBackendBaseUrlResponse();
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
