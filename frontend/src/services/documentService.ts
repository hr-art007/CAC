import api from './api'

const documentService = {
  getAll: async (params?: any) => {
    const response = await api.get('/documents', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/documents/${id}`)
    return response.data
  },
  upload: async (formData: FormData) => {
    const response = await api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/documents/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`)
    return response.data
  },
}

export default documentService
