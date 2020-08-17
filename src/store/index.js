import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import ClientList from './modules/ClientList'
import ReportByClient from './modules/ReportByClient'
import ReportNextCall from './modules/ReportNextCall'
import ReportBestClients from './modules/ReportBestClients'
import ReportWorstClients from './modules/ReportWorstClients'
import ReportToBeRemove from './modules/ReportToBeRemove'
import ReportDashboard from './modules/ReportDashboard'
import Client from './modules/Client'
import UserLogin from './modules/UserLogin'
import Invoice from './modules/Invoice'
import InvoiceList from './modules/InvoicesList'
import Products from './modules/Products'

// @TODO: CUANDO TODO ESTE EN SERVICIOS NO SE NECESITA LAS SIGUIENTES LINEAS DE AXIOS
axios.defaults.baseURL = 'https://api.cellagon.teamq.biz/'

let token = localStorage.getItem('user-token')
if (token) {
  token = token.slice(1, -1)
  axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
}

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'

Vue.use(Vuex, axios)

export default new Vuex.Store({
  state: {
    users: [],
    products: [],
    error: null
  },
  getters: {
    getDataError: state => {
      return state.error
    }
  },
  mutations: {
    FETCHING_DATA_ERROR (state, error) {
      state.error = error
    }
  },
  actions: {
  },
  modules: {
    UserLogin,
    ClientList,
    ReportByClient,
    ReportNextCall,
    ReportBestClients,
    ReportWorstClients,
    ReportToBeRemove,
    Client,
    Invoice,
    InvoiceList,
    Products,
    ReportDashboard
  }
})
