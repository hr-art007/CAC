import api from './api'

const surveyService = {
  getAll: async (params?: any) => {
    const response = await api.get('/surveys', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/surveys/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post('/surveys', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/surveys/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/surveys/${id}`)
    return response.data
  },
  respond: async (id: string, data: any) => {
    const response = await api.post(`/surveys/${id}/respond`, data)
    return response.data
  },
  getResults: async (id: string) => {
    const response = await api.get(`/surveys/${id}/results`)
    return response.data
  },
}

export default surveyService
