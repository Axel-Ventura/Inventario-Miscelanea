import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
