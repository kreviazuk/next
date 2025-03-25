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

export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 