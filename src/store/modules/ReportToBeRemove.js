import service from '../../services/reportsService'

export default {
  state: {
    nextToBeRemoveClients: [],
    totalToBeRemoveClients: 0,
    loadedToBeRemoveClients: false
  },
  getters: {
    getToBeRemoveClients: state => {
      return state.nextToBeRemoveClients
    },
    getToBeRemoveClientsLength: state => {
      return state.totalToBeRemoveClients
    },
    getLoadedToBeRemoveClients: state => {
      return state.loadedToBeRemoveClients
    }
  },
  mutations: {
    SET_TO_BE_REMOVE_CLIENTS (state, payload) {
      if (payload.data.data !== undefined) {
        state.nextToBeRemoveClients = payload.data.data
        state.totalToBeRemoveClients = payload.data.total
        state.loadedToBeRemoveClients = true
      }
    },
    SET_LOADING_TO_BE_REMOVED_CLIENTS: state => {
      state.loadedToBeRemoveClients = false
    }
  },
  actions: {
    setToBeRemoveClients ({ commit }, payload) {
      commit('SET_LOADING_TO_BE_REMOVED_CLIENTS')
      let dataParams = {}
      for (let key in payload.pageSetup) {
        dataParams[key] = payload.pageSetup[key]
      }
      dataParams['year'] = payload.selectedYear

      return service.getReportToBeRemoved(dataParams)
        .then(response => {
          commit('SET_TO_BE_REMOVE_CLIENTS', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    }
  }
}
