import service from '../../services/reportsService'

export default {
  state: {
    worstClients: [],
    totalWorstClients: 0,
    loadedWorstClients: false
  },
  getters: {
    getWorstClients: state => {
      return state.worstClients
    },
    getWorstClientsLength: state => {
      return state.totalWorstClients
    },
    getLoadedWorstClients: state => {
      return state.loadedWorstClients
    }
  },
  mutations: {
    SET_WORST_CLIENTS (state, payload) {
      if (payload.data.data !== undefined) {
        state.worstClients = payload.data.data
        state.totalWorstClients = payload.data.total
        state.loadedWorstClients = true
      }
    },
    SET_LOADING_WORST_CLIENTS: state => {
      state.loadedWorstClients = false
    }
  },
  actions: {
    setWorstClients ({ commit }, payload) {
      commit('SET_LOADING_WORST_CLIENTS')
      let dataParams = {}
      for (let key in payload.pageSetup) {
        dataParams[key] = payload.pageSetup[key]
      }
      dataParams['year'] = payload.selectedYear

      return service.getReportWorstClients(dataParams)
        .then(response => {
          commit('SET_WORST_CLIENTS', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    }
  }
}
