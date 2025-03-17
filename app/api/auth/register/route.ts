import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import type { RegisterRequest } from '@/types/api'

export async function POST(req: Request) {
  try {
    const { email, password, name, code }: RegisterRequest = await req.json()

    // 验证必填字段
    if (!email || !password || !name || !code) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
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

    // 检查验证码
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email: email.toLowerCase(),
        code,
        type: 'register',
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!verificationCode) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      )
    }

    // 检查邮箱和用户名是否已存在
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { name }
        ]
      }
    })

    if (existingUsers.length > 0) {
      const emailTaken = existingUsers.some(user => user.email === email.toLowerCase())
      const usernameTaken = existingUsers.some(user => user.name === name)

      if (emailTaken && usernameTaken) {
        return NextResponse.json(
          { error: '该邮箱和用户名都已被使用' },
          { status: 400 }
        )
      } else if (emailTaken) {
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: '该用户名已被使用' },
          { status: 400 }
        )
      }
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    // 标记验证码已使用
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 