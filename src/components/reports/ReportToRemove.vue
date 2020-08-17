<template>
    <div>
        <page-title :pageTitle="pageTitle">
            <b-button slot="buttons" variant="secondary" @click="print('printInfo')" right>{{ formLabels.print_button }}</b-button>
        </page-title>

        <b-row v-if="getToBeRemoveClientsLength">
            <b-col cols="12">
                <b-form-group>
                    {{ formLabels.page }}:
                    <b-select size="sm" :options="perPageOptions" v-model="pageSetup.per_page" class="d-inline-block w-auto" @change="paginationChange(pageSetup)" />
                </b-form-group>
            </b-col>
        </b-row>
        <div class="table-responsive">
            <b-table
                    :items="getToBeRemoveClients"
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
                    :busy="!getLoadedToBeRemoveClients"
                    show-empty
            >
                <template v-slot:cell(first_name)="data">
                    <router-link :to="{ name: 'clients-view', params: { id: data.item.id} }">{{ data.item.first_name }}</router-link>
                </template>
                <template v-slot:cell(last_name)="data">
                    <router-link :to="{ name: 'clients-view', params: { id: data.item.id } }">{{ data.item.last_name }}</router-link>
                </template>
                <template v-slot:cell(total)="data">
                    {{ data.item.total | formatCurrency }}
                </template>
                <template v-slot:cell(date)="data">
                    {{ data.item.date | formatDate }}
                </template>
                <template v-slot:cell(average)="data">
                    {{ data.item.total / data.item.countInvoices | formatCurrency }}
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
                :dataLength="getToBeRemoveClientsLength"
                :page="pageSetup.page"
                :per_page="pageSetup.per_page"
                @paginationChange="paginationChange"></pagination>

        <!-- Printing information, not displayed on screen -->
        <div class="table-responsive" id="printInfo">
            <h4 class="text-center">{{ pageTitle.title }}</h4>
            <b-table
                    :items="getToBeRemoveClients"
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
                <template v-slot:cell(total_sale_amount)="data">
                    {{ data.item.total_sale_amount }} {{ data.item.currency }}
                </template>
                <template v-slot:cell(last_sale)="data">
                    {{ data.item.last_sale | formatDate }}
                </template>
                <template v-slot:cell(average)="data">
                    {{ data.item.total / data.item.countInvoices | formatCurrency }}
                </template>
                <template v-slot:empty>
                    <div>No clients available</div>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>

import PaginationComponent from '../page-components/PaginationComponent'
import { mapGetters } from 'vuex'

export default {
  name: 'to-be-removed',
  metaInfo: {
    title: 'Reports - To be removed'
  },
  components: {
    pagination: PaginationComponent
  },
  data () {
    return {
      pageTitle: {
        parents: [this.$t('menu.reports.title')],
        title: this.$t('menu.reports.toBeRemoved')
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
          label: this.$t('tableFields.averageAmount')
        },
        {
          key: 'date',
          label: this.$t('tableFields.max_date')
        },
        {
          key: 'telephone',
          label: this.$t('tableFields.telephone')
        },
        {
          key: 'email',
          label: this.$t('tableFields.email')
        },
        {
          key: 'days_to_block',
          label: this.$t('tableFields.days_to_block')
        }
      ],
      // Pagination
      pageSetup: {
        per_page: 10,
        page: 1
      },
      popoverShow: [],
      disable: [],

      // Table options
      headerStyleOptions: [{ text: 'Default', value: null }, { text: 'Light', value: 'light' }, {
        text: 'Dark',
        value: 'dark'
      }],
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
    ...mapGetters(['getToBeRemoveClients', 'getToBeRemoveClientsLength', 'getLoadedToBeRemoveClients'])
  },
  created () {
    this.grabToBeRemovedClients()
  },
  methods: {
    onClose (id) {
      this.$root.$emit('bv::hide::popover', 'pop-' + id)
    },
    onOk (id, index) {
      this.disable[id] = true
      this.$root.$emit('bv::hide::popover', 'pop-' + id)
      this.$store.dispatch('deleteToBeRemoveClient', {
        id: id,
        index: index
      })
    },
    setPopOver (id) {
      this.popoverShow[id] = !this.popoverShow[id]
    },
    onShowPopOver () {
      this.$root.$emit('bv::hide::popover')
    },
    paginationChange (value) {
      this.pageSetup.per_page = value.per_page
      this.pageSetup.page = value.page
      this.grabToBeRemovedClients()
    },
    grabToBeRemovedClients () {
      this.$store.dispatch('setToBeRemoveClients', { pageSetup: this.pageSetup })
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
        width: 18%;
    }
    .table-responsive >>> th:nth-child(8) {
        width: 12%;
    }
</style>
