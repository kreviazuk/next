import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // 假设使用Prisma

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const reader = await prisma.reader.create({
      data: {
        name: body.name,
        // 其他字段
      },
    });
    
    return NextResponse.json(reader, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "添加读者失败" },
      { status: 500 }
    );
  }
} 