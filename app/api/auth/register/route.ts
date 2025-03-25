import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import type { RegisterRequest, AuthResponse } from '@/types/api'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export async function POST(req: Request) {
  try {
    const { email, password, name, verificationCode }: RegisterRequest = await req.json()

    // 验证必填字段
    if (!email || !password || !name || !verificationCode) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 验证用户名格式（只允许字母、数字和下划线，长度3-20）
    const nameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!nameRegex.test(name)) {
      return NextResponse.json(
        { error: '用户名只能包含字母、数字和下划线，长度3-20位' },
        { status: 400 }
      )
    }

    // 验证密码强度（至少8位，包含字母和数字）
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: '密码至少8位，必须包含字母和数字' },
        { status: 400 }
      )
    }

    // 验证验证码
    const storedCode = await redis.get(`verification:${email}`)
    console.log('验证码验证 - 邮箱:', email)
    console.log('存储的验证码类型:', typeof storedCode, '值:', storedCode)
    console.log('用户输入的验证码类型:', typeof verificationCode, '值:', verificationCode)
    
    // 确保两个验证码都转换为字符串进行比较
    const storedCodeStr = String(storedCode)
    const inputCodeStr = String(verificationCode)
    
    console.log('转换后的比较:')
    console.log('存储的验证码:', storedCodeStr)
    console.log('用户输入的验证码:', inputCodeStr)
    console.log('是否相等:', storedCodeStr === inputCodeStr)
    
    if (!storedCode || storedCodeStr !== inputCodeStr) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已被注册
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { name }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '邮箱或用户名已被注册' },
        { status: 400 }
      )
    }

    // 创建新用户
    const hashedPassword = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    // 删除已使用的验证码
    await redis.del(`verification:${email}`)

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
  } catch (error: any) {
    console.error('注册失败:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 