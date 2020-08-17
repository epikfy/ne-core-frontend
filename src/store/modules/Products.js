import axios from 'axios'

export default {
  state: {
    products: {
      selected: '',
      options: []
    },
    product: {}
  },
  getters: {
    getProducts: state => {
      return state.products
    }
  },
  mutations: {
    GET_PRODUCTS (state, payload) {
      state.products.options = payload.data !== undefined ? payload.data : payload
    },
    GET_PRODUCT (state, payload) {
      state.product = payload.data !== undefined ? payload.data : payload
    },
    SET_SELECTED_PRODUCT (state, productId) {
      state.products.selected = productId
    }
  },
  actions: {
    async getProduct ({ commit }, params) {
      await axios
        .get(`/api/v1/products/${params}`)
        .then(data => {
          commit('GET_PRODUCTS', data.data)
          commit('GET_PRODUCT', data.data)
        })
        .catch({})
    },
    async getProducts ({ commit }, params) {
      await axios
        .get(`/api/v1/products?fields[products]=id,description`)
        .then(data => {
          commit('GET_PRODUCTS', data.data)
        })
        .catch({})
    },
    setSelectedProduct ({ commit }, productId) {
      commit('SET_SELECTED_PRODUCT', productId)
    }
  }
}
