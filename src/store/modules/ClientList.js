import service from '../../services/clientsService'

export default {
  state: {
    clients: [],
    allClients: [],
    totalClients: 0,
    loadedClients: false
  },
  getters: {
    getClients: state => {
      return state.clients
    },
    getAllClients: state => {
      return state.allClients
    },
    getClientsLength: state => {
      return state.totalClients
    },
    getLoadedClients: state => {
      return state.loadedClients
    }
  },
  mutations: {
    SET_CLIENTS_LIST (state, payload) {
      if (payload.data.data !== undefined) {
        state.clients = payload.data.data
        state.totalClients = payload.data.total
      }
      state.loadedClients = true
    },
    SET_ALL_CLIENTS_LIST (state, payload) {
      if (payload.data.data !== undefined) {
        state.allClients = payload.data.data
        state.totalClients = payload.data.total
      }
      state.loadedClients = true
    },
    SET_LOADING_CLIENTS (state) {
      state.loadedClients = false
    },
    CLEAN_CLIENTS_LIST (state) {
      state.loadedClients = false
      state.clients = []
      state.allClients = []
      state.totalClients = 0
    }
  },
  actions: {
    setClientsList ({ commit }, payload) {
      commit('SET_LOADING_CLIENTS')

      if (payload.pageSetup === undefined) {
        payload.pageSetup = {
          per_page: 10,
          page: 1
        }
      }

      let dataParams = {}
      let searchClient = false

      for (let key in payload.pageSetup) {
        dataParams[key] = payload.pageSetup[key]
      }

      if (payload.searchData) {
        searchClient = true
        dataParams['search'] = payload.searchData
      }

      if (payload.sortSetup.by !== null) {
        dataParams['sortBy'] = payload.sortSetup.by
        dataParams['sortDesc'] = payload.sortSetup.desc
      }

      if (searchClient === false) {
        return service.getAllClients(dataParams)
          .then(response => {
            commit('SET_CLIENTS_LIST', { data: response.data })
            return response
          })
          .catch(err => commit('FETCHING_DATA_ERROR', err))
      } else {
        return service.searchClients(dataParams)
          .then(response => {
            commit('SET_CLIENTS_LIST', { data: response.data })
            return response
          })
          .catch(err => commit('FETCHING_DATA_ERROR', err))
      }
    },
    setAllClientsList ({ commit }, payload) {
      commit('SET_LOADING_CLIENTS')

      let dataParams = {
        per_page: 0,
        page: 1
      }

      if (payload.sortSetup.by !== null) {
        dataParams['sortBy'] = payload.sortSetup.by
        dataParams['sortDesc'] = payload.sortSetup.desc
      }

      return service.getAllClients(dataParams)
        .then(response => {
          commit('SET_ALL_CLIENTS_LIST', { data: response.data })
          return response
        })
        .catch(err => commit('FETCHING_DATA_ERROR', err))
    },
    cleanClientsList ({ commit }, payload) {
      commit('CLEAN_CLIENTS_LIST')
    }
  }
}
