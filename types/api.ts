export interface LoginRequest {
  identifier: string  // 用户名或邮箱
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
  code: string  // 验证码
}

export interface AuthResponse {
  user: {
    id: number
    email: string
    name: string
  }
  token: string
} 