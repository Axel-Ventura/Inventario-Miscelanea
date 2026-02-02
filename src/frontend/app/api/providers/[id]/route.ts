import { NextResponse } from "next/server";
import { mockProviders } from "@/lib/mock-data";

let providers = [...mockProviders];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await new Promise((resolve) => setTimeout(resolve, 200));

  const provider = providers.find((p) => p.id === id);

  if (!provider) {
    return NextResponse.json(
      { error: "Proveedor no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(provider);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = providers.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    providers[index] = {
      ...providers[index],
      ...data,
    };

    return NextResponse.json(providers[index]);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = providers.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Proveedor no encontrado" },
      { status: 404 }
    );
  }

  providers = providers.filter((p) => p.id !== id);
  return NextResponse.json({ success: true });
}
