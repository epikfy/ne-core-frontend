import service from '../../services/invoiceService'

export default {
  name: 'InvoiceList',
  state: {
    invoices: [],
    allInvoices: [],
    totalInvoices: 0,
    loadedInvoices: false
  },
  getters: {
    getInvoicesList: state => {
      return state.invoices
    },
    getAllInvoices: state => {
      return state.allInvoices
    },
    getInvoicesListLength: state => {
      return state.totalInvoices
    },
    getLoadedInvoices: state => {
      return state.loadedInvoices
    }
  },
  mutations: {
    SET_INVOICES_LIST (state, payload) {
      if (payload.data.data !== undefined) {
        state.invoices = payload.data.data
        state.totalInvoices = payload.data.total
        state.loadedInvoices = true
      }
    },
    SET_ALL_INVOICES_LIST (state, payload) {
      if (payload.data.data !== undefined) {
        state.allInvoices = payload.data.data
        state.totalInvoices = payload.data.total
        state.loadedInvoices = true
      }
    },
    SET_LOADING_INVOICES (state) {
      state.loadedInvoices = false
    }
  },
  actions: {
    setInvoicesList ({ commit }, params) {
      commit('SET_LOADING_INVOICES')

      let dataParams = {}
      for (let key in params.pageSetup) {
        if (params.pageSetup[key] !== '') {
          dataParams[key] = params.pageSetup[key]
        }
      }

      if (params.searchData) {
        dataParams['search'] = params.searchData
      }

      return service.allInvoices(dataParams)
        .then(response => {
          commit('SET_INVOICES_LIST', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    },
    setAllInvoicesList ({ commit }, payload) {
      commit('SET_LOADING_INVOICES')
      let dataParams = {
        per_page: 0,
        page: 1
      }

      return service.allInvoices(dataParams)
        .then(response => {
          commit('SET_ALL_INVOICES_LIST', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    }
  }
}
