export interface LoginRequest {
  identifier: string  // 用户名或邮箱
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  verificationCode: string
}

export interface AuthResponse {
  user: {
    id: number
    email: string
    name: string
  }
  token: string
} 