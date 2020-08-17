import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import NotFound from '@/components/NotFound'
import login from '@/components/login'

import globals from '@/globals'

import layoutsRoutes from './layouts'

import home from './home'
import clients from './clients'
import invoices from './invoices'
import reports from './reports'

Vue.use(Router)
Vue.use(Meta)

const ROUTES = [
  // Default route
  { path: '', redirect: { name: 'home' } }
]
  .concat(layoutsRoutes)
  .concat(home)
  .concat(clients)
  .concat(invoices)
  .concat(reports)

// 404 Not Found page
ROUTES.push({
  path: '*',
  component: NotFound
})

// Login page
ROUTES.push({
  name: 'login',
  path: '/login',
  component: login
})

const router = new Router({
  base: '/',
  mode: 'history',
  routes: ROUTES
})

router.afterEach(() => {
  // Remove initial splash screen
  const splashScreen = document.querySelector('.app-splash-screen')
  if (splashScreen) {
    splashScreen.style.opacity = 0
    setTimeout(() => splashScreen && splashScreen.parentNode.removeChild(splashScreen), 300)
  }

  // On small screens collapse sidenav
  if (window.layoutHelpers && window.layoutHelpers.isSmallScreen() && !window.layoutHelpers.isCollapsed()) {
    setTimeout(() => window.layoutHelpers.setCollapsed(true, true), 10)
  }

  // Scroll to top of the page
  globals().scrollTop(0, 0)
})

router.beforeEach((to, from, next) => {
  // Set loading state
  document.body.classList.add('app-loading')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('user-token') === null) {
      next({
        name: 'login',
        params: { nextName: to.name }
      })
    } else {
      next()
    }
  } else {
    next()
  }

  // Add tiny timeout to finish page transition
  setTimeout(() => next(), 10)
})

export default router
