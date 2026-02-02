import { NextResponse } from "next/server";
import { mockProviders } from "@/lib/mock-data";

let providers = [...mockProviders];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json(providers);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newProvider = {
      ...data,
      id: `prov-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    providers.push(newProvider);
    return NextResponse.json(newProvider, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el proveedor" },
      { status: 500 }
    );
  }
}
