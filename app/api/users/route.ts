import { prisma } from '@/lib/prisma'

export async function GET() {
  // 获取所有用户
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      // 不返回密码字段
    }
  })
  return Response.json(users)
}

export async function POST(req: Request) {
  // 创建新用户
  const data = await req.json()
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name
    }
  })
  return Response.json(user)
} 