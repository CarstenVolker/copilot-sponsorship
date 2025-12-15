const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  timestamp: string
}

export interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    page: number
    size: number
    hasMore: boolean
  }
  timestamp: string
}

class ApiClient {
  private token: string | null = null
  private tokenLoaded = false

  setToken(token: string) {
    this.token = token
    this.tokenLoaded = true
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  getToken(): string | null {
    if (this.token) {
      console.log('[api-client] getToken - returning cached token')
      return this.token
    }
    
    // Try to get from localStorage on client side
    if (typeof window !== 'undefined') {
      if (!this.tokenLoaded) {
        const stored = localStorage.getItem('auth_token')
        console.log('[api-client] getToken - loading from localStorage:', stored ? 'found' : 'not found')
        if (stored) {
          this.token = stored
        }
        this.tokenLoaded = true
      }
      return this.token
    }
    
    return null
  }

  clearToken() {
    this.token = null
    this.tokenLoaded = false
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const token = this.getToken()
    console.log('[api-client] getHeaders - token:', token ? 'present' : 'missing')
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    } else {
      // Final fallback: try to read directly from localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('auth_token')
        console.log('[api-client] getHeaders - localStorage fallback:', stored ? 'found' : 'not found')
        if (stored) {
          headers['Authorization'] = `Bearer ${stored}`
        }
      }
    }

    return headers
  }

  async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`
    const headers = this.getHeaders()
    const options: RequestInit = {
      method,
      headers,
    }

    console.log('[api-client]', method, endpoint, '- Authorization header:', headers['Authorization'] ? 'present' : 'missing')

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `HTTP ${response.status}`,
        },
      }))
      
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`
      const error = new Error(errorMessage)
      ;(error as any).status = response.status
      throw error
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint)
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data)
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data)
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint)
  }

  async getPaginated<T>(
    endpoint: string,
    page: number = 1
  ): Promise<PaginatedApiResponse<T>> {
    const url = `${endpoint}?page=${page}`
    return this.request<T>('GET', url) as Promise<PaginatedApiResponse<T>>
  }
}

export const apiClient = new ApiClient()
