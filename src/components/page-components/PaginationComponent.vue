<template>
    <div class="row" v-if="dataLength">
        <div class="col-md-11 text-center">
            <b-pagination class="justify-content-md-center justify-content-sm-start"
                          v-if="dataLength"
                          v-model="pageOptions.page"
                          :total-rows="dataLength"
                          :per-page="pageOptions.per_page"
                          size="md"
                          @input="paginationChange"
            />
        </div>
        <div class="col-md-1 text-md-right text-sm-left mb-3 mb-sm-0">
            <span class="text-muted" v-if="totalPages">Page {{ page }} of {{ totalPages }}</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    dataLength: Number,
    per_page: Number,
    page: Number
  },
  computed: {
    totalPages () {
      return Math.ceil(this.dataLength / this.per_page) || (this.dataLength ? 1 : 0)
    },
    pageOptions () {
      return {
        'per_page': this.per_page,
        'page': this.page
      }
    }
  },
  methods: {
    paginationChange () {
      this.$emit('paginationChange', this.pageOptions)
    }
  }
}
</script>

<style scoped>

</style>
