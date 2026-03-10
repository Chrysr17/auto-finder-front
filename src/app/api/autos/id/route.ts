import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
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

  const resp = await fetch(`${gatewayUrl}/api/autos/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (resp.status === 404) {
    return NextResponse.json(
      { message: "Auto no encontrado" },
      { status: 404 }
    );
  }

  const data = await resp.json();

  return NextResponse.json(data, { status: resp.status });
}