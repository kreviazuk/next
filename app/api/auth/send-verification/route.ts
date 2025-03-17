import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { Redis } from '@upstash/redis'

console.log('加载发送验证码路由模块')

// 创建 Redis 客户端
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: Request) {
  console.log('收到发送验证码请求')
  
  try {
    const body = await request.json()
    console.log('请求体:', body)
    
    const { email } = body
    console.log('发送验证码 - 邮箱:', email)

    if (!email) {
      console.log('邮箱地址为空')
      return NextResponse.json({ error: '邮箱地址不能为空' }, { status: 400 })
    }

    // 生成6位随机验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('生成的验证码类型:', typeof verificationCode, '值:', verificationCode)
    
    // 将验证码存储到 Redis，设置5分钟过期
    console.log('Redis 配置:', {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN?.slice(0, 10) + '...'
    })
    
    // 确保存储为字符串
    await redis.set(`verification:${email}`, String(verificationCode), { ex: 300 })
    
    // 验证存储
    const storedCode = await redis.get(`verification:${email}`)
    console.log('存储后立即读取验证码类型:', typeof storedCode, '值:', storedCode)

    // 发送验证码邮件
    console.log('SMTP 配置:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM
    })
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: '验证码 - 您的应用名称',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>验证码</h2>
          <p>您的验证码是：</p>
          <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; text-align: center; letter-spacing: 4px; margin: 24px 0;">
            ${verificationCode}
          </div>
          <p>此验证码将在5分钟后过期。</p>
          <p>如果这不是您的操作，请忽略此邮件。</p>
        </div>
      `,
    })
    console.log('验证码邮件已发送')

    return NextResponse.json({ message: '验证码已发送' })
  } catch (error: any) {
    console.error('发送验证码失败:', error)
    return NextResponse.json(
      { error: '发送验证码失败，请稍后重试' },
      { status: 500 }
    )
  }
} 