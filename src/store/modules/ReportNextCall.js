import service from '../../services/reportsService'

export default {
  state: {
    nextCallClients: [],
    totalNextCallClients: 0,
    loadedNextCallClients: false
  },
  getters: {
    getNextCallClients: state => {
      return state.nextCallClients
    },
    getNextCallClientsLength: state => {
      return state.totalNextCallClients
    },
    getLoadedNextCallClients: state => {
      return state.loadedNextCallClients
    }
  },
  mutations: {
    SET_NEXT_CALL_CLIENTS (state, payload) {
      if (payload.data.data !== undefined) {
        state.nextCallClients = payload.data.data
        state.totalNextCallClients = payload.data.total
        state.loadedNextCallClients = true
      }
    },
    SET_LOADING_NEXT_CALLS_CLIENTS: state => {
      state.loadedNextCallClients = false
    }
  },
  actions: {
    setNextCallClients ({ commit }, payload) {
      commit('SET_LOADING_NEXT_CALLS_CLIENTS')
      let dataParams = {}
      for (let key in payload.pageSetup) {
        dataParams[key] = payload.pageSetup[key]
      }
      return service.getReportNextToCall(dataParams)
        .then(response => {
          commit('SET_NEXT_CALL_CLIENTS', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    }
  }
}
