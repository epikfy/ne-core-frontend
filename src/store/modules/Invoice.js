import axios from 'axios'

export default {
  state: {
    invoice: {},
    originalInvoice: {}
  },
  getters: {
  },
  mutations: {
    SET_INVOICE (state, payload) {
      state.invoice = payload.data !== undefined ? payload.data : payload
      state.originalInvoice = JSON.parse(JSON.stringify(state.invoice))
    },
    SET_ORIGINAL_INVOICE (state) {
      state.invoice = JSON.parse(JSON.stringify(state.originalInvoice))
    },
    CLEAN_INVOICE (state) {
      state.invoice = {}
      state.originalInvoice = {}
    }
  },
  actions: {
    async getInvoice ({ commit }, params) {
      commit('SET_INVOICE', params)
      await new Promise((resolve, reject) => {
        axios
          .get(`/api/v1/invoices/${params}`)
          .then(response => {
            commit('SET_INVOICE', response.data)
            resolve(response)
          // commit('cleanClient')
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    async createInvoice ({ commit }, params) {
      commit('SET_INVOICE', params)
      await new Promise((resolve, reject) => {
        axios
          .post('/api/v1/invoices', params)
          .then(response => {
            commit('CLEAN_INVOICE')
            commit('CLEAN_CLIENT')
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    async updateInvoice ({ commit }, params) {
      await new Promise((resolve, reject) => {
        axios
          .put(`/api/v1/invoices/${params.id}`, params)
          .then(response => {
            commit('SET_INVOICE', params)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    setInvoice ({ commit }, params) {
      commit('SET_INVOICE', params)
    },
    cleanInvoice ({ commit }) {
      commit('CLEAN_INVOICE')
    },
    setOriginalInvoiceData ({ commit }) {
      commit('SET_ORIGINAL_INVOICE')
    }
  }
}
