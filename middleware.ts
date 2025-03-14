import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Edge compatible JWT verification
async function verifyJWT(token: string): Promise<boolean> {
  try {
    const encodedPayload = token.split('.')[1]
    const payload = JSON.parse(atob(encodedPayload))
    const exp = payload.exp

    if (Date.now() >= exp * 1000) {
      return false
    }
    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register')

  // 没有token且不是认证页面，重定向到登录
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 有token但访问认证页面，重定向到仪表盘
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 