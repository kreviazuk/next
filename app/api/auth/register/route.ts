import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import type { RegisterRequest } from '@/types/api'

export async function POST(req: Request) {
  try {
    const { email, password, name }: RegisterRequest = await req.json()

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name
      }
    })

    return NextResponse.json({ 
      id: user.id,
      email: user.email,
      name: user.name 
    })
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    )
  }
} 