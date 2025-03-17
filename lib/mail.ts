import nodemailer from 'nodemailer'

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: '940025541@qq.com',
    pass: 'njskmqcmcsosbcjj',
  },
})

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: '940025541@qq.com',
    to: email,
    subject: '邮箱验证码',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">邮箱验证码</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          您好，您正在注册账号，请输入以下验证码完成注册：
        </p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 5px;">
            ${code}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">
          验证码有效期为10分钟，请尽快完成验证。如果不是您本人的操作，请忽略此邮件。
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
} 