<template>
  <div class="not-found-container">
    <div class="text-center">
      <h1 class="not-found-status">404</h1>
      <h2 class="not-found-message">Not Found</h2>
      <router-link tag="button" class="btn btn-primary m-2" :to="{ name: 'home' }">Home Page</router-link>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .not-found-container {
    width: 100%;
    min-height: 100vh;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .not-found-status {
    font-size: 10rem;
    font-weight: 400;
    margin: 0;
    line-height: 1;
  }

  .not-found-message {
    font-weight: 300;
    font-size: 3.25rem;
    margin: 0;
    line-height: 1;
  }
</style>

<script>
export default {
  name: 'not-found',
  metaInfo: {
    title: '404 Not Found'
  }
}
</script>
