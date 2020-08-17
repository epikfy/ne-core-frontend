<template>
    <div>
        <b-row class="mb-4">
            <b-col md="6" sm="12">
                <h4 class="font-weight-bold">
                    <span class="text-muted font-weight-light" v-for="(page, key) in pageTitle.parents" :key="key">{{ page }} / </span>
                    {{ pageTitle.title }}
                </h4>
            </b-col>
            <b-col md="6" sm="12" class="text-md-right text-sm-left">
                <slot name="buttons"></slot>
            </b-col>
        </b-row>
        <hr class="container-m-nx border-light mt-0 mb-4">
    </div>
</template>

<script>
export default {
  name: 'PageTitle',
  data () {
    return {}
  },
  props: {
    pageTitle: Object
  }
}
</script>
