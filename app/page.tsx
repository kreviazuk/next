import { redirect } from 'next/navigation'

export default function HomePage() {
  // 将根路径重定向到登录页
  redirect('/login')
}
