import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";

let users = [...mockUsers];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  return NextResponse.json(usersWithoutPasswords);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    const newUser = {
      ...data,
      id: `user-${Date.now()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}
