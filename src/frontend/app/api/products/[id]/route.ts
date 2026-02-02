import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

let products = [...mockProducts];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await new Promise((resolve) => setTimeout(resolve, 200));

  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
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

  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  products = products.filter((p) => p.id !== id);
  return NextResponse.json({ success: true });
}
