import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";

let users = [...mockUsers];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await new Promise((resolve) => setTimeout(resolve, 200));

  const user = users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  const { password, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    users[index] = {
      ...users[index],
      ...data,
    };

    const { password, ...userWithoutPassword } = users[index];
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
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

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  users = users.filter((u) => u.id !== id);
  return NextResponse.json({ success: true });
}
