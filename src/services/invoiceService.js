import httpClient from '../helpers/HttpClient'

export default {
  allInvoices (filters) {
    return httpClient.get('/api/v1/invoices', {
      params: filters
    })
  }
}
