import api from './api'

const meetingService = {
  getAll: async (params?: any) => {
    const response = await api.get('/meetings', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/meetings/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post('/meetings', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/meetings/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/meetings/${id}`)
    return response.data
  },
  getStats: async () => {
    const response = await api.get('/meetings/stats')
    return response.data
  },
  getAttendance: async (id: string) => {
    const response = await api.get(`/meetings/${id}/attendance`)
    return response.data
  },
  recordAttendance: async (id: string, data: any) => {
    const response = await api.post(`/meetings/${id}/attendance`, data)
    return response.data
  },
}

export default meetingService
