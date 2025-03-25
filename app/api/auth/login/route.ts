import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import type { LoginRequest, AuthResponse } from '@/types/api'

export async function POST(req: Request) {
  try {
    const { identifier, password }: LoginRequest = await req.json()

    // 查找用户（通过邮箱或用户名）
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        password: true
      },
      where: {
        OR: [
          { email: identifier },
          { name: identifier }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 验证密码
    const isPasswordValid = await compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    // 生成令牌
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    )

    const response: AuthResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
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
    console.error('登录失败:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
} 