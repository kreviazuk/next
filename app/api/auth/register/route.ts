import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import type { RegisterRequest } from '@/types/api'

export async function POST(req: Request) {
  try {
    const { email, password, name }: RegisterRequest = await req.json()

    // 输入验证
    if (!email || !password || !name) {
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

    // 检查邮箱和用户名是否已存在
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: email.toLowerCase() }, // 邮箱转小写
          { name }
        ]
      }
    })

    if (existingUsers.length > 0) {
      const existingEmail = existingUsers.find(user => user.email === email.toLowerCase())
      const existingName = existingUsers.find(user => user.name === name)

      if (existingEmail && existingName) {
        return NextResponse.json(
          { error: '该邮箱和用户名都已被使用' },
          { status: 400 }
        )
      } else if (existingEmail) {
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 400 }
        )
      } else if (existingName) {
        return NextResponse.json(
          { error: '该用户名已被使用' },
          { status: 400 }
        )
      }
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(), // 存储时转小写
        password: await bcrypt.hash(password, 12), // 增加加密强度
        name,
        createdAt: new Date(), // 添加创建时间
        updatedAt: new Date()  // 添加更新时间
      }
    })

    return NextResponse.json({ 
      id: user.id,
      email: user.email,
      name: user.name 
    })
  } catch (error) {
    console.error('注册错误:', error)
    // 更详细的错误处理
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `注册失败: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 