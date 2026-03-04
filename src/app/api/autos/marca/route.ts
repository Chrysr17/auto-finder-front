import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(_req: Request, ctx: { params: { marca: string } }) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No auth" }, { status: 401 });
  }

  const gatewayUrl = process.env.NEXT_PUBLIC_API_URL;

  const resp = await fetch(
    `${gatewayUrl}/api/autos/marca/${ctx.params.marca}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await resp.json();

  return NextResponse.json(data, { status: resp.status });
}