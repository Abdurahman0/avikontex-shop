import { apiRequest, unwrapPayload } from './apiClient'

function getCollection(payload, keys = ['data', 'results', 'items']) {
  const data = unwrapPayload(payload)
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []

  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key]
  }
  return []
}

export const companyService = {
  async getCompanies() {
    return getCollection(await apiRequest('/api/companies/'))
  },

  getCompany(companyId) {
    return apiRequest(`/api/companies/${companyId}/`)
  },

  async getDocumentTypes() {
    return getCollection(await apiRequest('/api/document-types/'))
  },

  async getDocuments(companyId) {
    return getCollection(await apiRequest(`/api/companies/${companyId}/documents/`))
  },

  async getAddresses(companyId, type = '') {
    const query = type ? `?type=${encodeURIComponent(type)}` : ''
    return getCollection(await apiRequest(`/api/companies/${companyId}/addresses/${query}`))
  },

  uploadDocument(companyId, { documentType, file }) {
    const formData = new FormData()
    formData.set('document_type', documentType)
    formData.set('file', file)

    return apiRequest(`/api/companies/${companyId}/documents/`, {
      method: 'POST',
      body: formData,
    })
  },
}
