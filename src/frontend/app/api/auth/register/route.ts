import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 500));

    const existingUser = mockUsers.find((u) => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "empleado" as const,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      user: newUser,
      token: `mock-jwt-token-${newUser.id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
