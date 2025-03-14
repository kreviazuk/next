import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import type { LoginRequest, AuthResponse } from '@/types/api'

export async function POST(req: Request) {
  try {
    const { email, password }: LoginRequest = await req.json()

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 生成token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || ''
      },
      token
    }

    const nextResponse = NextResponse.json(response)

    // 设置cookie
    nextResponse.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24小时
    })

    return nextResponse
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
} 