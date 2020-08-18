<template>
  <b-navbar toggleable="lg" :variant="getLayoutNavbarBg()" class="layout-navbar align-items-lg-center container-p-x">
    <!-- Brand demo (see demo.css) -->
    <b-navbar-brand to="/" class="app-brand demo d-lg-none py-0 mr-4">
      <span class="app-brand-logo">
        <img :src="`${publicUrl}img/core-logo.png`" class="d-block ui-w-20 rounded-circle" alt="Core NE">
      </span>
      <span class="app-brand-text demo font-weight-normal ml-2">CORE</span>
    </b-navbar-brand>

    <!-- Sidenav toggle (see demo.css) -->
    <b-navbar-nav class="layout-sidenav-toggle d-lg-none align-items-lg-center mr-auto" v-if="sidenavToggle">
      <a class="nav-item nav-link px-0 mr-lg-4" href="javascript:void(0)" @click="toggleSidenav">
        <em class="ion ion-md-menu text-large align-middle" />
      </a>
    </b-navbar-nav>

    <b-navbar-toggle target="app-layout-navbar"></b-navbar-toggle>
    <b-collapse is-nav id="app-layout-navbar">
      <!-- Divider -->
      <hr class="d-lg-none w-100 my-2">

      <b-navbar-nav class="align-items-lg-center ml-auto">
        <b-nav-item-dropdown :right="!isRTL" class="demo-navbar-user" v-if="getLoggedIn">
          <template slot="button-content">
            <span class="d-inline-flex flex-lg-row-reverse align-items-center align-middle">
              <span class="px-1 mr-lg-2 ml-2 ml-lg-0">{{ getUserLoggedInInfo.name }}</span>
            </span>
          </template>

          <b-dd-item><em class="ion ion-ios-person text-lightest"></em> {{ $t('main.myProfile') }}</b-dd-item>
          <b-dd-divider />
          <b-dd-item @click="logout"><em class="ion ion-ios-log-out text-danger"></em> &nbsp; {{ $t('main.logout') }}</b-dd-item>
        </b-nav-item-dropdown>
        <b-button v-else @click.prevent="login">{{ $t('main.login') }}</b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app-layout-navbar',

  props: {
    sidenavToggle: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['getLoggedIn', 'getUserLoggedInInfo'])
  },

  methods: {
    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    },

    getLayoutNavbarBg () {
      return this.layoutNavbarBg
    },
    login () {
      this.$router.push({ name: 'login', params: { nextName: this.$router.currentRoute.name } })
    }
  }
}
</script>
