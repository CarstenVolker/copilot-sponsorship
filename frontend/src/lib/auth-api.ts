import { apiClient } from './api-client'

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
}

export const authApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email: input.email,
      password: input.password,
    })

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Login failed')
    }

    // Store token
    apiClient.setToken(response.data.token)

    return response.data
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    console.log('[auth-api] Register attempt:', {
      username: input.username,
      email: input.email,
      password: '***' // Don't log actual password
    })

    const response = await apiClient.post<AuthResponse>('/auth/register', {
      username: input.username,
      email: input.email,
      password: input.password,
    })

    if (!response.success || !response.data) {
      console.error('[auth-api] Registration failed:', response.error?.message)
      throw new Error(response.error?.message || 'Registration failed')
    }

    console.log('[auth-api] Registration successful for:', input.email)

    // Store token
    apiClient.setToken(response.data.token)

    return response.data
  },

  logout() {
    apiClient.clearToken()
  },

  getStoredToken(): string | null {
    return apiClient.getToken()
  },

  setToken(token: string) {
    apiClient.setToken(token)
  },
}
