<template>
    <div>
        <page-title :pageTitle="pageTitle">
            <b-button slot="buttons" variant="secondary" @click="exportToCsv" right :disabled="isExporting">
                <div class="text-center" v-if="!getLoadedInvoices && isExporting">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>{{ $t('base.loading') }}</strong>
                </div>
                <span v-else>{{ formLabels.export_csv_button }}</span>
            </b-button>
        </page-title>
        <b-row align-h="between" align-v="end">
            <b-col cols="12" md="3" v-if="getInvoicesListLength" class="mb-4">
                {{ formLabels.page }}:
                <b-select size="sm" :options="perPageOptions" v-model="pageSetup.per_page" class="d-inline-block w-auto"
                          @change="paginationChange(pageSetup)"/>
            </b-col>
            <b-col cols="12" md="3" v-if="getInvoicesListLength" class="mb-4">
                {{ $t('base.perPage') }}:
                <b-select size="sm" :options="perPageOptions" v-model="pageSetup.per_page" class="d-inline-block w-auto" @change="paginationChange(pageSetup)" />
            </b-col>
            <b-col sm="5" md="4" lg="3" xl="2" class="mb-4 ml-auto">
                <b-input-group size="sm">
                    <template v-slot:prepend>
                        <b-input-group-text>
                            <em class="ion ion-ios-search"></em>
                        </b-input-group-text>
                    </template>
                    <b-input v-bind:placeholder="$t('base.search')"
                             v-model="searchSetup.searchData"
                             @change="getFilteredClients"
                    />
                    <b-input-group-append v-if="searchSetup.searchData">
                        <b-button variant="outline-secondary" @click="clearData"><em class="ion ion-md-close" ></em></b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
        </b-row>
        <!-- Table -->
        <div class="table-responsive">
            <b-table
                    :items="getInvoicesList"
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
                    :busy="!getLoadedInvoices && !isExporting"
                    show-empty
            >
                <template v-slot:cell(invoice_nr)="data">
                    <router-link :to="{ name: 'invoices-view', params: { id: data.item.id } }">{{ data.item.invoice_nr }}</router-link>
                </template>
                <template v-slot:cell(client_name)="data">
                    <router-link :to="{ name: 'clients-view', params: { id: data.item.client_id } }">{{ data.item.client.first_name }} {{ data.item.client.last_name }}</router-link>
                </template>
                <template v-slot:cell(amount)="data">
                    {{ data.item.amount | formatCurrency }}
                </template>
                <template v-slot:cell(tax)="data">
                    {{  data.item.tax | formatCurrency }}
                </template>
                <template v-slot:cell(total)="data">
                    {{ (data.item.amount + data.item.tax ) | formatCurrency }}
                </template>
                <template v-slot:cell(date)="data">
                    {{ data.item.date | formatDate }}
                </template>
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>{{ $t('base.loading') }}</strong>
                    </div>
                </template>
                <template v-slot:empty>
                    <div>{{ $t('warnings.noInvoicesAvailable') }}</div>
                </template>
            </b-table>
        </div>
        <pagination
                :dataLength="getInvoicesListLength"
                :page="pageSetup.page"
                :per_page="pageSetup.per_page"
                @paginationChange="paginationChange"></pagination>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationComponent from '../page-components/PaginationComponent'
import { saveAs } from 'file-saver'
import { unparse } from 'papaparse'

export default {
  name: 'invoices-list',
  metaInfo () {
    return {
      title: this.$t('invoices.title')
    }
  },
  components: {
    pagination: PaginationComponent
  },
  computed: {
    ...mapGetters(['getInvoicesList', 'getInvoicesListLength', 'getLoadedInvoices', 'getAllInvoices', 'getDataError'])
  },
  data () {
    return {
      pageTitle: {
        parents: [this.$t('invoices.title')],
        title: this.$t('base.list')
      },
      formLabels: {
        export_csv_button: this.$t('formFields.export_csv_button'),
        page: this.$t('base.perPage')
      },
      tableFields: [
        {
          key: 'invoice_nr',
          label: this.$t('tableFields.invoice_nr')
        },
        {
          key: 'client_name',
          label: this.$t('tableFields.client_name')
        },
        {
          key: 'date',
          label: this.$t('tableFields.date')
        },
        {
          key: 'quantity',
          label: this.$t('tableFields.quantity')
        },
        {
          key: 'amount',
          label: this.$t('tableFields.amount')
        },
        {
          key: 'tax',
          label: this.$t('tableFields.tax')
        },
        {
          key: 'total',
          label: this.$t('tableFields.total')
        },
        {
          thClass: 'd-none',
          tdClass: 'd-none',
          key: 'discount',
          label: this.$t('tableFields.discount')
        },
        {
          thClass: 'd-none',
          tdClass: 'd-none',
          key: 'internal_nr',
          label: this.$t('tableFields.internal_nr')
        },
        {
          thClass: 'd-none',
          tdClass: 'd-none',
          key: 'tax_percentage',
          label: this.$t('tableFields.tax_percentage')
        }
      ],
      // Pagination
      pageSetup: {
        per_page: 10,
        page: 1
      },

      // Table options
      headerStyleOptions: [{ text: 'Default', value: null }, { text: 'Light', value: 'light' }, { text: 'Dark', value: 'dark' }],
      isStickyHeader: false,
      isSortable: false,
      isSortIconLeft: false,
      isStacked: false,
      isStriped: false,
      isHoverable: false,
      isBordered: true,
      isBorderless: false,
      isOutlined: false,
      isSmall: false,
      isFixed: true,
      isSelectable: false,
      isDark: false,
      isFootClone: false,
      headerStyle: null,
      isExporting: false,
      searchSetup: {
        minCharLength: 3,
        searchData: ''
      },
      searchedData: false
    }
  },
  created () {
    this.grabInvoices()
  },
  methods: {
    paginationChange (value) {
      this.pageSetup.per_page = value.per_page
      this.pageSetup.page = value.page
      this.grabInvoices()
    },
    getFilteredClients () {
      if (this.searchSetup.searchData.length >= this.searchSetup.minCharLength || (this.searchedData && this.searchSetup.searchData.length === 0)) {
        this.searchedData = !this.searchedData
        this.grabInvoices()
      }
    },
    grabInvoices () {
      this.$store.dispatch('setInvoicesList', { searchData: this.searchSetup.searchData, pageSetup: this.pageSetup })
    },
    clearData () {
      this.searchSetup.searchData = ''
      this.searchedData = false
      this.grabInvoices()
    },
    exportToCsv () {
      this.isExporting = true
      this.$store.dispatch('setAllInvoicesList', {
        sortSetup: this.sortSetup
      }).then(() => {
        this.isExporting = false
        if (this.getDataError !== null) {
          this.showNotification('error', this.getDataError)
        } else {
          let columnFields = []
          let headerLabels = []
          this.tableFields.map(function (item, index) {
            columnFields.push(item.key)
            headerLabels.push(item.label.toUpperCase())
          })
          let filters = this.$options.filters

          this.getAllInvoices.map(function (item, index) {
            item['total'] = filters.formatCurrency(item['amount'] + item['tax'])
            item['tax'] = filters.formatCurrency(item['tax'])
            item['amount'] = filters.formatCurrency(item['amount'])
            item['date'] = filters.formatDate(item['date'])
          })
          let CSVdata = unparse(this.getAllInvoices, {
            'columns': columnFields,
            'header': false
          })
          CSVdata = headerLabels.join(',') + '\r\n' + CSVdata

          let blob = new Blob([CSVdata], {
            type: 'application/csv;charset=utf-8'
          })

          saveAs(blob, 'invoices_liste.csv')
        }
      })
    }
  }
}
</script>

<style scoped>
    .table-responsive >>> th:nth-child(1) {
        width: 10%;
    }
    .table-responsive >>> th:nth-child(2) {
        width: 20%;
    }
    .table-responsive >>> th:nth-child(3) {
        width: 10%;
    }
    .table-responsive >>> th:nth-child(4) {
        width: 10%;
    }
    .table-responsive >>> th:nth-child(5) {
        width: 15%;
    }
    .table-responsive >>> th:nth-child(6) {
        width: 15%;
    }
    .table-responsive >>> th:nth-child(7) {
        width: 20%;
    }
</style>
