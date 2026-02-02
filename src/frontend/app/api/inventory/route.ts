import { NextResponse } from "next/server";
import { mockMovements } from "@/lib/mock-data";

let movements = [...(mockMovements ?? [])];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredMovements = movements;

  if (type === "entrada" || type === "salida") {
    filteredMovements = movements.filter((m) => m.type === type);
  }

  return NextResponse.json(filteredMovements);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newMovement = {
      ...data,
      id: `mov-${Date.now()}`,
      date: new Date().toISOString(),
    };

    movements.unshift(newMovement);
    return NextResponse.json(newMovement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrar el movimiento" },
      { status: 500 }
    );
  }
}
