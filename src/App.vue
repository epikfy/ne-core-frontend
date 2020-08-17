<template>
  <div id="app">
    <notifications group="notifications-top-right" position="top right" />
    <router-view/>
  </div>
</template>

<style src="@/vendor/styles/theme-air.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="./style.scss" lang="scss"></style>

<script>
export default {
  name: 'app',
  metaInfo: {
    title: 'Index',
    titleTemplate: '%s - CORE NE'
  },
  updated () {
    // Remove loading state
    setTimeout(() => document.body.classList.remove('app-loading'), 1)
  }
}
</script>
