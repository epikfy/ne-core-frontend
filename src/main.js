import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import VueHtmlToPaper from 'vue-html-to-paper'
import axios from 'axios'
import Notifications from 'vue-notification'

import BootstrapVue from 'bootstrap-vue'

import globals from './globals'
import Popper from 'popper.js'

import '@/globalComponents'

const HtmlToPaperOptions = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    '/css/vendor/bootstrap.css',
    '/css/vendor/appwork.css',
    '/css/vendor/theme-corporate.css',
    '/css/vendor/colors.css',
    '/css/vendor/uikit.css'
  ]
}

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(VueHtmlToPaper, HtmlToPaperOptions)
Vue.use(Notifications)

// Load all locales and remember context
function loadMessages () {
  const context = require.context('./locales', true, /[a-z0-9-_]+\.json$/i)

  const messages = context
    .keys()
    .map((key) => ({ key, locale: key.match(/[a-z0-9-_]+/i)[0] }))
    .reduce(
      (messages, { key, locale }) => ({
        ...messages,
        [locale]: context(key)
      }),
      {}
    )
  return { context, messages }
}

const { context, messages } = loadMessages()

// VueI18n instance
const i18n = new VueI18n({
  locale: 'en',
  messages
})

// Hot updates
if (module.hot) {
  module.hot.accept(context.id, () => {
    const { messages: newMessages } = loadMessages()

    Object.keys(newMessages)
      .filter((locale) => messages[locale] !== newMessages[locale])
      .forEach((locale) => {
        messages[locale] = newMessages[locale]
        i18n.setLocaleMessage(locale, messages[locale])
      })
  })
}

// Global RTL flag
Vue.mixin({
  data: globals,
  methods: {
    print (id) {
      this.$htmlToPaper(id, null, () => {
        console.log('Printing completed')
      })
    },
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({ name: 'login' })
      })
    },
    showNotification (type = 'success', text) {
      type = type.toLowerCase()
      let notificationType = 'success'
      let notificationTitle = this.$t('base.success')
      if (type === 'error') {
        notificationTitle = this.$t('base.error')
        notificationType = 'error'
      } else if (type === 'warn') {
        notificationTitle = this.$t('base.warning')
        notificationType = 'warn'
      }

      this.$notify({
        group: 'notifications-top-right',
        type: notificationType,
        title: notificationTitle,
        text: text,
        duration: 5000,
        closeOnClick: true
      })
    },
    getDaysInMonth (month, year) {
      return new Date(year, month, 0).getDate()
    }
  }
})

// Global Filters
Vue.filter('formatDate', dateValue => {
  if (dateValue === null || dateValue === undefined) {
    return null
  }
  let dateInfo = new Date(dateValue)
  let year = dateInfo.getFullYear()
  let month = dateInfo.getMonth() + 1
  let day = dateInfo.getDate()

  // Place 0 when day and month is less then 10
  month = (month > 9 ? '' : '0') + month
  day = (day > 9 ? '' : '0') + day

  return day + '.' + month + '.' + year
})

Vue.filter('formatCurrency', (currencyValue, decimal = ',', thousands = '.', currencySign = '€', signPosition = 'end') => {
  signPosition = signPosition.toLowerCase()
  currencySign = currencySign.toUpperCase()
  if (isFinite(currencyValue)) {
    let decimalCount = 2

    let currencyAmount = parseInt(currencyValue = Math.abs(Number(currencyValue) || 0).toFixed(decimalCount)).toString()
    let currencyString = (currencyAmount.length > 3) ? currencyAmount.length % 3 : 0

    currencyValue = (currencyString ? currencyAmount.substr(0, currencyString) + thousands : '') + currencyAmount.substr(currencyString).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(currencyValue - currencyAmount).toFixed(decimalCount).slice(2) : '')

    if (signPosition === 'start') {
      return currencySign + ' ' + currencyValue
    } else {
      return currencyValue + ' ' + currencySign
    }
  } else {
    return currencyValue
  }
})

Vue.filter('formatFloat', (floatValue, decimalPlaces = 2) => {
  if (isFinite(floatValue)) {
    return floatValue.toFixed(decimalPlaces)
  } else {
    return floatValue
  }
})

new Vue({
  i18n,
  router,
  store,
  created () {
    if (this.$router.currentRoute.name !== 'login') {
      this.$store.dispatch('checkLoggedIn')
      axios.interceptors.response.use(response => response,
        err => {
          let responseStatus = err.response.status
          let responseMessage = err.response.data.message
          let authErrorCode = 401
          let servErrorCodesMin = 500
          let servErrorCodesMax = 599
          if (responseStatus === authErrorCode) {
            this.$store.dispatch('setLogout').then(() => {
              this.$router.push({ name: 'login' })
            })
          } else if (responseStatus >= servErrorCodesMin && responseStatus <= servErrorCodesMax) {
            this.showNotification('error', "Server returned error '" + responseStatus + "'. Get in contact with the administrators. Error: '" + responseMessage + "'")
          }

          return Promise.reject(err)
        })
    }
  },
  render: h => h(App)
}).$mount('#app')
