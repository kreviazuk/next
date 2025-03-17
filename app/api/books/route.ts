import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取图书列表
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(books)
  } catch (error) {
    console.error('获取图书列表失败:', error)
    return NextResponse.json(
      { error: '获取图书列表失败' },
      { status: 500 }
    )
  }
}

// 创建新图书
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      author,
      isbn,
      category,
      description,
      publishDate,
      publisher,
      price,
      totalCopies
    } = body

    // 验证必填字段
    if (!title || !author || !isbn || !category || !publishDate || !publisher || !price || !totalCopies) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 检查 ISBN 是否已存在
    const existingBook = await prisma.book.findUnique({
      where: { isbn }
    })

    if (existingBook) {
      return NextResponse.json(
        { error: '该 ISBN 已存在' },
        { status: 400 }
      )
    }

    // 创建新图书
    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        category,
        description: description || '',
        publishDate: new Date(publishDate),
        publisher,
        price: parseFloat(price),
        totalCopies: parseInt(totalCopies),
        availableCopies: parseInt(totalCopies), // 初始可借数量等于总数量
        status: '可借'
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error('创建图书失败:', error)
    return NextResponse.json(
      { error: '创建图书失败' },
      { status: 500 }
    )
  }
} 