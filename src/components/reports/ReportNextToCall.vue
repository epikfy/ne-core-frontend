<template>
    <div>
        <page-title :pageTitle="pageTitle">
            <b-button slot="buttons" variant="secondary" @click="print('printInfo')" right>{{ formLabels.print_button }}</b-button>
        </page-title>

        <b-row v-if="getNextCallClientsLength">
            <b-col cols="12">
                <b-form-group>
                    {{ formLabels.page }}:
                    <b-select size="sm" :options="perPageOptions" v-model="pageSetup.per_page" class="d-inline-block w-auto"
                              @change="paginationChange(pageSetup)"/>
                </b-form-group>
            </b-col>
        </b-row>
        <div class="table-responsive">
            <b-table
                    :items="getNextCallClients"
                    :sort-icon-left="isSortIconLeft"
                    :fields="tableFields"
                    :sticky-header="isStickyHeader"
                    :stacked="isStacked"
                    :striped="isStriped"
                    :hover="isHoverable"
                    :bordered="isBordered"
                    :borderless="isBorderless"
                    :outlined="isOutlined"
                    :small="isSmall"
                    :fixed="isFixed"
                    :selectable="isSelectable"
                    :dark="isDark"
                    :foot-clone="isFootClone"
                    :head-variant="headerStyle"
                    :busy="!getLoadedNextCallClients"
                    show-empty
            >
                <template v-slot:cell(first_name)="data">
                    <router-link :to="{ name: 'clients-view', params: { id: data.item.client_id } }">{{ data.item.first_name }}</router-link>
                </template>
                <template v-slot:cell(last_name)="data">
                    <router-link :to="{ name: 'clients-view', params: { id: data.item.client_id } }">{{ data.item.last_name }}</router-link>
                </template>
                <template v-slot:cell(max_date)="data">
                    {{ data.item.max_date | formatDate }}
                </template>
                <template v-slot:cell(total)="data">
                    {{ data.item.total | formatCurrency }}
                </template>
                <template v-slot:cell(average)="data">
                    {{ data.item.average | formatFloat }} {{ data.item.average === 1 ? 'tag' : 'tage'}}
                </template>
                <template v-slot:empty>
                    <div>No clients available</div>
                </template>
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>
            </b-table>
        </div>
        <pagination
                :dataLength="getNextCallClientsLength"
                :page="pageSetup.page"
                :per_page="pageSetup.per_page"
                @paginationChange="paginationChange"></pagination>

        <!-- Printing information, not displayed on screen -->
        <div class="table-responsive" id="printInfo">
            <h4 class="text-center">{{ pageTitle.title }}</h4>
            <b-table
                    :items="getNextCallClients"
                    :sort-icon-left="isSortIconLeft"
                    :fields="tableFields"
                    :sticky-header="isStickyHeader"
                    :stacked="isStacked"
                    :striped="isStriped"
                    :hover="isHoverable"
                    :bordered="isBordered"
                    :borderless="isBorderless"
                    :outlined="isOutlined"
                    :small="isSmall"
                    :fixed="isFixed"
                    :selectable="isSelectable"
                    :dark="isDark"
                    :foot-clone="isFootClone"
                    :head-variant="headerStyle"
                    show-empty
            >
                <template v-slot:cell(max_date)="data">
                    {{ data.item.max_date | formatDate }}
                </template>
                <template v-slot:cell(total)="data">
                    {{ data.item.total | formatCurrency }}
                </template>
                <template v-slot:cell(average)="data">
                    {{ data.item.average | formatFloat }} {{ data.item.average === 1 ? 'tag' : 'tage'}}
                </template>
                <template v-slot:empty>
                    <div>No clients available</div>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationComponent from '../page-components/PaginationComponent'

export default {
  name: 'next-to-call',
  metaInfo: {
    title: 'Reports - Next to call'
  },
  components: {
    pagination: PaginationComponent
  },
  data () {
    return {
      pageTitle: {
        parents: [this.$t('menu.reports.title')],
        title: this.$t('menu.reports.nextToCallInside')
      },
      formLabels: {
        print_button: this.$t('formFields.print_button'),
        page: this.$t('base.perPage')
      },
      tableFields: [
        {
          key: 'first_name',
          label: this.$t('tableFields.firstName')
        },
        {
          key: 'last_name',
          label: this.$t('tableFields.lastName')
        },
        {
          key: 'total',
          label: this.$t('tableFields.total')
        },
        {
          key: 'average',
          label: this.$t('tableFields.average')
        },
        {
          key: 'max_date',
          label: this.$t('tableFields.max_date')
        },
        {
          key: 'telephone',
          label: this.$t('tableFields.telephone')
        },
        {
          key: 'email',
          label: this.$t('tableFields.email')
        }
      ],
      // Pagination
      pageSetup: {
        per_page: 10,
        page: 1
      },
      popoverShow: [],

      // Table options
      headerStyleOptions: [
        {
          text: 'Default',
          value: null
        },
        {
          text: 'Light',
          value: 'light'
        },
        {
          text: 'Dark',
          value: 'dark'
        }
      ],
      isStickyHeader: false,
      isSortable: false,
      isSortIconLeft: false,
      isStacked: false,
      isStriped: true,
      isHoverable: false,
      isBordered: true,
      isBorderless: false,
      isOutlined: false,
      isSmall: false,
      isFixed: false,
      isSelectable: false,
      isDark: false,
      isFootClone: false,
      headerStyle: null
    }
  },
  computed: {
    ...mapGetters([
      'getNextCallClients',
      'getNextCallClientsLength',
      'getLoadedNextCallClients'
    ])
  },
  created () {
    this.grabNextCall()
  },
  methods: {
    setPopOver (id) {
      this.popoverShow[id] = !this.popoverShow[id]
    },
    paginationChange (value) {
      this.pageSetup.per_page = value.per_page
      this.pageSetup.page = value.page
      this.grabNextCall()
    },
    getFilteredClients () {
      if (this.searchSetup.searchData.name.length >= this.searchSetup.minCharLength) {
        this.grabNextCall()
      }
    },
    grabNextCall () {
      this.$store.dispatch('setNextCallClients', { pageSetup: this.pageSetup })
    }
  }
}
</script>
<style scoped>
    .table-responsive >>> th:nth-child(1) {
        width: 10%;
    }
    .table-responsive >>> th:nth-child(2) {
        width: 10%;
    }
    .table-responsive >>> th:nth-child(3) {
        width: 10%;
    }
    .table-responsive >>> th:nth-child(4) {
        width: 15%;
    }
    .table-responsive >>> th:nth-child(5) {
        width: 15%;
    }
    .table-responsive >>> th:nth-child(6) {
        width: 10%;
    }
    .table-responsive >>> th:nth-child(7) {
        width: 20%;
    }
</style>
