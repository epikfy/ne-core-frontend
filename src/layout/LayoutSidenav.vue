<template>
  <sidenav :orientation="orientation" :class="curClasses" :accordion="false">

    <!-- Brand demo (see src/demo.css) -->
    <div class="app-brand demo" v-if="orientation !== 'horizontal'">
      <span class="app-brand-logo demo bg-white">
        <img :src="`${publicUrl}img/core-logo.png`" class="d-block ui-w-20 rounded-circle" alt="CORE Logo">
      </span>
      <router-link :to="{ name: 'home' }" class="app-brand-text demo sidenav-text font-weight-normal ml-2">CORE</router-link>
      <a href="javascript:void(0)" class="layout-sidenav-toggle sidenav-link text-large ml-auto" @click="toggleSidenav()">
        <em class="ion ion-md-menu align-middle"></em>
      </a>
    </div>
    <div class="sidenav-divider mt-0" v-if="orientation !== 'horizontal'"></div>

    <!-- Links -->
    <div class="sidenav-inner" :class="{ 'py-1': orientation !== 'horizontal' }">

      <sidenav-router-link icon="ion ion-md-home" :to="{ name: 'home' }" exact>{{ $t('menu.home') }}</sidenav-router-link>

      <!-- Reports -->
      <sidenav-menu icon="ion ion-ios-trending-up" :active="isMenuActive('/reports')" :open="isMenuOpen('/reports')">
        <template slot="link-text">{{ $t('menu.reports.title') }}</template>
        <sidenav-router-link :to="{name: 'byClient'}" exact>{{ $t('menu.reports.byClient') }}</sidenav-router-link>
        <sidenav-router-link :to="{name: 'nextToCall'}" exact>{{ $t('menu.reports.nextToCall') }}</sidenav-router-link>
        <sidenav-router-link :to="{name: 'bestClients'}" exact>{{ $t('menu.reports.bestClients') }}</sidenav-router-link>
        <sidenav-router-link :to="{name: 'worstClients'}" exact>{{ $t('menu.reports.worstClients') }}</sidenav-router-link>
        <sidenav-router-link :to="{name: 'toBeRemoved'}" exact>{{ $t('menu.reports.toBeRemoved') }}</sidenav-router-link>
      </sidenav-menu>

      <sidenav-divider class="mb-1"/>
      <!-- Clients -->
      <sidenav-menu icon="ion ion-ios-people" :active="isMenuActive('/clients')" :open="true">
        <template slot="link-text">{{ $t('menu.clients.title') }}</template>
        <sidenav-router-link icon="ion ion-ios-list" :to="{name: 'clients-list'}" exact>{{ $t('menu.clients.listClients') }}</sidenav-router-link>
        <!-- <sidenav-router-link icon="ion ion-md-person-add" :to="{name: 'clients-create'}" exact>{{ $t('menu.clients.createClient') }}</sidenav-router-link> -->
        <sidenav-router-link icon="ion ion-ios-cloud-upload" :to="{ name: 'clients-import' }" exact>{{ $t('menu.clients.importClients') }}</sidenav-router-link>
        <sidenav-router-link icon="ion ion-ios-desktop" :to="{ name: 'clients-view' }">{{ $t('menu.clients.viewModifyClient') }}</sidenav-router-link>
      </sidenav-menu>

      <sidenav-divider class="mb-1"/>
      <!-- Invoices -->
      <sidenav-menu icon="ion ion-ios-paper" :active="isMenuActive('/invoices')" :open="true">
        <template slot="link-text">{{ $t('menu.invoices.title') }}</template>
        <sidenav-router-link icon="ion ion-ios-list" :to="{ name: 'invoices-list' }" exact>{{ $t('menu.invoices.listInvoices') }}</sidenav-router-link>
        <!-- <sidenav-router-link icon="ion ion-ios-document" :to="{ name: 'invoices-create' }" exact>{{ $t('menu.invoices.createInvoice') }}</sidenav-router-link> -->
        <sidenav-router-link icon="ion ion-ios-cloud-upload" :to="{ name: 'invoices-import' }" exact>{{ $t('menu.invoices.importInvoices') }}</sidenav-router-link>
        <sidenav-router-link icon="ion ion-ios-desktop" :to="{ name: 'invoices-view' }">{{ $t('menu.invoices.viewModifyInvoice') }}</sidenav-router-link>
      </sidenav-menu>
      <sidenav-divider class="mb-1"/>
    </div>
  </sidenav>
</template>

<script>
import { Sidenav, SidenavLink, SidenavRouterLink, SidenavMenu, SidenavHeader, SidenavBlock, SidenavDivider } from '@/vendor/libs/sidenav'

export default {
  name: 'app-layout-sidenav',
  components: {
    /* eslint-disable vue/no-unused-components */
    Sidenav,
    SidenavLink,
    SidenavRouterLink,
    SidenavMenu,
    SidenavHeader,
    SidenavBlock,
    SidenavDivider
    /* eslint-enable vue/no-unused-components */
  },

  props: {
    orientation: {
      type: String,
      default: 'vertical'
    }
  },
  computed: {
    curClasses () {
      let bg = this.layoutSidenavBg

      if (this.orientation === 'horizontal' && (bg.indexOf(' sidenav-dark') !== -1 || bg.indexOf(' sidenav-light') !== -1)) {
        bg = bg
          .replace(' sidenav-dark', '')
          .replace(' sidenav-light', '')
          .replace('-darker', '')
          .replace('-dark', '')
      }

      return `bg-${bg} ` + (
        this.orientation !== 'horizontal'
          ? 'layout-sidenav'
          : 'layout-sidenav-horizontal container-p-x flex-grow-0'
      )
    }
  },
  methods: {
    isMenuActive (url) {
      return this.$route.path.indexOf(url) === 0
    },
    isMenuOpen (url) {
      return this.$route.path.indexOf(url) === 0 && this.orientation !== 'horizontal'
    },
    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    }
  }
}
</script>
