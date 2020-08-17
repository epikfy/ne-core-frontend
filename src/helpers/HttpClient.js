import axios from 'axios'
import env from '../environment/Environment'

/**
 * Axios basic configuration
 * Some general configuration can be added like timeout, headers, params etc. More details can be found on https://github.com/axios/axios
 * */
const config = {
  baseURL: env.apiBaseUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    'Cache-Control': 'no-cache'
  }
}

let httpClient = axios.create(config)

/**
 * Auth interceptors
 * @description Configuration related to AUTH token can be done in interceptors.
 * Currenlty it is just doing nothing but idea to to show the capability of axios and its interceptors
 * In future, interceptors can be created into separate files and consumed into multiple http clients
 * @param {*} configAuth
 */
const authInterceptor = configAuth => {
  /** add auth token */
  const token = localStorage.getItem('user-token').replace(/^"|"$/g, '')
  configAuth.headers.Authorization = `Bearer ${token}`
  return configAuth
}

const loggerInterceptor = configLogger => {
  /** Add logging here */

  return configLogger
}

/** Adding the request interceptors */
httpClient.interceptors.request.use(authInterceptor)
httpClient.interceptors.request.use(loggerInterceptor)

function errorResponseHandler (error) {
  // Check if there is a response error (Network error)
  if (error.response === undefined) {
    return Promise.reject(error)
  }

  // check for errorHandle config
  if ((error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false) || error.response.status === 401) {
    return Promise.resolve(error)
  }
  // TO-DO: Do something with response error
}

/** Adding the response interceptors */
httpClient.interceptors.response.use(
  response => {
    return response
  },
  errorResponseHandler
)

export default httpClient
