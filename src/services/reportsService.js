import httpClient from '../helpers/HttpClient'

export default {
  getReportNextToCall (filters) {
    return httpClient.get('/api/v1/report/calls', {
      params: filters
    })
  },
  getReportBestClients (filters) {
    return httpClient.get('/api/v1/report/bests', {
      params: filters
    })
  },
  getReportWorstClients (filters) {
    return httpClient.get('/api/v1/report/worst', {
      params: filters
    })
  },
  getReportToBeRemoved (filters) {
    return httpClient.get('/api/v1/report/deprecated', {
      params: filters
    })
  },
  getReportInvoicesDashboard (filters) {
    return httpClient.get('/api/v1/report/totalInvoices', {
      params: filters
    })
  },
  getReportClientYearTotal (id) {
    return httpClient.get(`/api/v1/report/${id}/totalPerYear`)
  }
}
