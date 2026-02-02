import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

let products = [...mockProducts];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newProduct = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
