import service from '../../services/reportsService'

export default {
  state: {
    bestClients: [],
    allBestClients: [],
    totalBestClients: 0,
    loadedBestClients: false
  },
  getters: {
    getBestClients: state => {
      return state.bestClients
    },
    getAllBestClients: state => {
      return state.allBestClients
    },
    getBestClientsLength: state => {
      return state.totalBestClients
    },
    getLoadedBestClients: state => {
      return state.loadedBestClients
    }
  },
  mutations: {
    SET_BEST_CLIENTS (state, payload) {
      if (payload.data.data !== undefined) {
        state.bestClients = payload.data.data
        state.totalBestClients = payload.data.total
        state.loadedBestClients = true
      }
    },
    SET_ALL_BEST_CLIENTS (state, payload) {
      if (payload.data.data !== undefined) {
        state.allBestClients = payload.data.data
        state.totalBestClients = payload.data.total
        state.loadedBestClients = true
      }
    },
    SET_LOADING_BEST_CLIENTS: state => {
      state.loadedBestClients = false
    }
  },
  actions: {
    setBestClients ({ commit }, payload) {
      commit('SET_LOADING_BEST_CLIENTS')
      let dataParams = {}
      for (let key in payload.pageSetup) {
        dataParams[key] = payload.pageSetup[key]
      }
      dataParams['year'] = payload.selectedYear

      return service.getReportBestClients(dataParams)
        .then(response => {
          commit('SET_BEST_CLIENTS', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    },
    setAllBestClients ({ commit }, payload) {
      commit('SET_LOADING_BEST_CLIENTS')

      let dataParams = {
        per_page: 0,
        page: 1
      }

      dataParams['year'] = payload.selectedYear

      return service.getReportBestClients(dataParams)
        .then(response => {
          commit('SET_ALL_BEST_CLIENTS', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    }
  }
}
