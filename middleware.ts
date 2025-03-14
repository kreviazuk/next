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

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // 需要保护的路由
  const protectedPaths = ['/dashboard', '/profile']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const isValid = await verifyJWT(token)
    if (!isValid) {
      throw new Error('Invalid token')
    }
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 