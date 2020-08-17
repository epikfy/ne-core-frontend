import axios from 'axios'

export default {
  state: {
    client: { country: 'Germany' },
    originalClient: { country: 'Germany' }
  },
  getters: {
    getClient: state => {
      return state.client
    },
    getFullName: state => {
      if (state.client.first_name === undefined) {
        return ''
      } else {
        return `${state.client.first_name} ${state.client.last_name}`
      }
    }
  },
  mutations: {
    SET_CLIENT (state, payload) {
      state.client = payload.data !== undefined ? payload.data : payload
      state.originalClient = JSON.parse(JSON.stringify(state.client))
    },
    SET_ORIGINAL_CLIENT (state) {
      state.client = JSON.parse(JSON.stringify(state.originalClient))
    },
    ADD_CLIENT (state, payload) {
      state.client = payload.data
    },
    UPDATE_CLIENT (state, payload) {
      state.client = payload.data.data
    },
    CLEAN_CLIENT (state) {
      state.client = { country: 'Germany' }
      state.originalClient = { country: 'Germany' }
    }
  },
  actions: {
    async getClient ({ commit }, id) {
      await new Promise((resolve) => {
        axios
          .get(`/api/v1/clients/${id}`)
          .then(response => {
            commit('SET_CLIENT', response.data)
            resolve(response)
          })
      })
    },
    async createClient ({ commit }, params) {
      await new Promise((resolve, reject) => {
        axios
          .post('/api/v1/clients', params)
          .then(response => {
            commit('CLEAN_CLIENT')
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    async updateClient ({ commit }, params) {
      await new Promise((resolve, reject) => {
        axios
          .put(`/api/v1/clients/${params.id}`, params)
          .then(response => {
            commit('UPDATE_CLIENT', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    cleanClient ({ commit }, params) {
      commit('CLEAN_CLIENT')
    },
    setClient ({ commit }, params) {
      commit('SET_CLIENT', params)
    },
    setOriginalClientData ({ commit }) {
      commit('SET_ORIGINAL_CLIENT')
    }
  }
}
