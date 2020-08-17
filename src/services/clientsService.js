import httpClient from '../helpers/HttpClient'

export default {
  getAllClients (filters) {
    return httpClient.get('/api/v1/clients', {
      params: filters
    })
  },
  searchClients (filters) {
    return httpClient.get('/api/v1/search/clients', {
      params: filters
    })
  },
  getClientInvoices (id, params) {
    return httpClient.get(`/api/v1/clients/${id}/invoices`, {
      params: params
    })
  }
}
