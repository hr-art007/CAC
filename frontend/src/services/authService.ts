import api from './api'

export interface LoginCredentials { email: string; password: string }
export interface RegisterData { email: string; password: string; firstName: string; lastName: string; role?: string }
export interface User { id: string; email: string; firstName: string; lastName: string; role: string }
export interface AuthResponse { success: boolean; data: { user: User; token: string }; message: string }

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/change-password', data)
    return response.data
  },
}

export default authService
