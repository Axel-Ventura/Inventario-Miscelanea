import { NextResponse } from 'next/server'
import { MOCK_USERS } from '@/lib/mock-data'
import type { AuthResponse } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Credenciales incompletas',
          error: 'El correo y la contrasena son requeridos',
        },
        { status: 400 }
      )
    }

    // Find user in mock data
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (!user) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Usuario no encontrado',
          error: 'El correo electronico no esta registrado',
        },
        { status: 401 }
      )
    }

    // Check password (in production, use bcrypt)
    if (user.password !== password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Contrasena incorrecta',
          error: 'La contrasena ingresada es incorrecta',
        },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.activo) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Usuario inactivo',
          error: 'Tu cuenta esta desactivada. Contacta al administrador.',
        },
        { status: 403 }
      )
    }

    // Generate mock token (in production, use JWT)
    const token = `mock_token_${user.id}_${Date.now()}`

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json<AuthResponse>({
      success: true,
      message: 'Inicio de sesion exitoso',
      data: {
        user: userWithoutPassword,
        token,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: 'Error del servidor',
        error: 'Ocurrio un error al procesar la solicitud',
      },
      { status: 500 }
    )
  }
}
