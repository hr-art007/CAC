import api from './api'

const voteService = {
  getAll: async (params?: any) => {
    const response = await api.get('/votes', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/votes/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post('/votes', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/votes/${id}`, data)
    return response.data
  },
  cast: async (id: string, data: any) => {
    const response = await api.post(`/votes/${id}/cast`, data)
    return response.data
  },
  close: async (id: string) => {
    const response = await api.post(`/votes/${id}/close`)
    return response.data
  },
  getStats: async () => {
    const response = await api.get('/votes/stats')
    return response.data
  },
}

export default voteService
