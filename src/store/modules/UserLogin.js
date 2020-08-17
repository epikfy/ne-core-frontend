import axios from 'axios'
import VuexPersistence from 'vuex-persist'

export default {
  state: {
    token: localStorage.getItem('user-token') ? localStorage.getItem('user-token').replace(/^"|"$/g, '') : '',
    loggedIn: false,
    error: '',
    user: {
      id: 0,
      name: 'Unknown user name'
    }
  },
  getters: {
    getLoggedIn: state => {
      return state.loggedIn
    },
    getUserLoggedInInfo: state => {
      return state.user
    },
    getToken: state => {
      return state.token
    }
  },
  mutations: {
    SET_LOGIN (state, payload) {
      state.user.id = payload.data.id ? payload.data.id : state.user.id
      state.user.name = payload.data.name ? payload.data.name : state.user.name
      state.token = payload.data.token
      state.loggedIn = true
      let stateSave = new VuexPersistence()
      stateSave.saveState('user-token', payload.data.token, window.localStorage)
      stateSave.saveState('user-data', state.user, window.localStorage)
      axios.defaults.headers.common = { 'Authorization': `Bearer ${payload.data.token}` }
    },
    SET_LOGOUT (state) {
      localStorage.removeItem('user-token')
      localStorage.removeItem('user-data')
      delete axios.defaults.headers.common['Authorization']
      state.loggedIn = false
    },
    SET_ERROR (state, payload) {
      state.error = payload.data
    },
    SET_CHECK_LOGGED_IN (state) {
      if (localStorage.getItem('user-token') !== null) {
        state.loggedIn = true
        if (localStorage.getItem('user-data') !== null) {
          state.user = JSON.parse(localStorage.getItem('user-data'))
        } else {
          let stateSave = new VuexPersistence()
          stateSave.saveState('user-data', state.user, window.localStorage)
        }
      }
    }
  },
  actions: {
    login ({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios.post('/api/v1/auth/login', payload.data).then(response => {
          commit('SET_LOGIN', { data: response.data })
          dispatch('getProducts')
          resolve(response)
        }).catch(err => {
          let errorMessage = 'Wrong username and/or password mismatch. Please try again.'
          if (err.response.status !== 401) {
            errorMessage = err.response.data.message
          }
          reject(errorMessage)
        })
      })
    },
    logout (context) {
      axios.get('/api/v1/auth/logout', { params: { token: context.state.token } })
        .then(() => {
          context.commit('SET_LOGOUT')
        })
    },
    setLogout (context) {
      context.commit('SET_LOGOUT')
    },
    checkLoggedIn ({ commit, dispatch, getters }, payload) {
      commit('SET_CHECK_LOGGED_IN')
      if (getters.getLoggedIn) {
        dispatch('getProducts')
      }
    }
  }
}
