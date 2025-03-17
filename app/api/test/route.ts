import { NextResponse } from 'next/server'

console.log('加载测试路由模块')

export async function GET() {
  console.log('收到测试请求')
  return NextResponse.json({ message: 'API 路由工作正常' })
} 