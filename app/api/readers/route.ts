import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 注意这里使用命名导入

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.name) {
      return NextResponse.json(
        { error: "姓名是必填项" },
        { status: 400 }
      );
    }
    
    // 创建读者记录
    const reader = await prisma.reader.create({
      data: {
        name: body.name,
        gender: body.gender || "男",
        age: Number(body.age) || 0,
        phone: body.phone || "",
        address: body.address || "",
      },
    });
    
    return NextResponse.json(reader, { status: 201 });
  } catch (error) {
    console.error("创建读者失败:", error);
    return NextResponse.json(
      { error: "创建读者失败" },
      { status: 500 }
    );
  }
}

// 获取所有读者的 API
export async function GET() {
  try {
    const readers = await prisma.reader.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(readers);
  } catch (error) {
    console.error("获取读者列表失败:", error);
    return NextResponse.json(
      { error: "获取读者列表失败" },
      { status: 500 }
    );
  }
} 