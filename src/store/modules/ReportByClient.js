import clientsService from '../../services/clientsService'
import reportsService from '../../services/reportsService'

export default {
  state: {
    invoicesByClient: [],
    salesByYear: []
  },
  getters: {
    getInvoices: state => {
      return state.invoicesByClient
    },
    getSales: state => {
      return state.salesByYear
    }
  },
  mutations: {
    SET_INVOICES_BY_CLIENT (state, payload) {
      if (payload.data !== undefined) {
        state.invoicesByClient = payload.data.data
      }
    },
    SET_SALES_BY_YEAR (state, payload) {
      if (payload.data !== undefined) {
        state.salesByYear = payload.data.data
      }
    },
    CLEAN_INVOICES_BY_CLIENT (state) {
      state.invoicesByClient = []
    },
    CLEAN_SALES_BY_YEAR (state) {
      state.salesByYear = []
    }
  },
  actions: {
    setInvoicesByClient ({ commit }, params) {
      commit('CLEAN_INVOICES_BY_CLIENT')
      let dataParams = {
        year: params.year,
        month: params.month,
        day: params.day
      }

      return clientsService.getClientInvoices(params.id, dataParams)
        .then(response => {
          commit('SET_INVOICES_BY_CLIENT', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    },
    setSalesByYear ({ commit }, id) {
      commit('CLEAN_SALES_BY_YEAR')

      return reportsService.getReportClientYearTotal(id)
        .then(response => {
          commit('SET_SALES_BY_YEAR', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    },
    cleanInvoicesByClient ({ commit }) {
      commit('CLEAN_INVOICES_BY_CLIENT')
    },
    cleanSalesByYear ({ commit }) {
      commit('CLEAN_SALES_BY_YEAR')
    }
  }
}
