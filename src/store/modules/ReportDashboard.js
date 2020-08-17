import reportsService from '../../services/reportsService'

export default {
  state: {
    invoicesTotalDashboard: [],
    loadingDashboardData: false
  },
  getters: {
    getInvoicesTotalDashboard: state => {
      return state.invoicesTotalDashboard
    },
    getLoadingDashboardData: state => {
      return state.loadingDashboardData
    }
  },
  mutations: {
    SET_INVOICES_DASHBOARD (state, payload) {
      if (payload.data !== undefined) {
        state.invoicesTotalDashboard = payload.data
      }
    },
    SET_INVOICES_DASHBOARD_LOADING (state, payload) {
      state.loadingDashboardData = payload.loading
    },
    CLEAN_INVOICES_DASHBOARD (state) {
      state.invoicesTotalDashboard = []
      state.loadingDashboardData = false
    }
  },
  actions: {
    setInvoicesDashboard ({ commit }, params) {
      commit('SET_INVOICES_DASHBOARD_LOADING', { loading: true })
      commit('CLEAN_INVOICES_DASHBOARD')
      let dataParams = {
        year: params.year
      }

      return reportsService.getReportInvoicesDashboard(dataParams)
        .then(response => {
          commit('SET_INVOICES_DASHBOARD', { data: response.data })
          commit('SET_INVOICES_DASHBOARD_LOADING', { loading: false })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    },
    cleanInvoicesDashboard ({ commit }) {
      commit('CLEAN_INVOICES_DASHBOARD')
    }
  }
}
