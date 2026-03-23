import api from './api'

const decisionService = {
  getAll: async (params?: any) => {
    const response = await api.get('/decisions', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/decisions/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post('/decisions', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/decisions/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/decisions/${id}`)
    return response.data
  },
  getStats: async () => {
    const response = await api.get('/decisions/stats')
    return response.data
  },
}

export default decisionService
