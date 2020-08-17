<template>
    <div>
        <page-title :pageTitle="pageTitle">
            <b-button slot="buttons" variant="secondary" @click="exportToCsv" right :disabled="isExporting">
                <div class="text-center" v-if="!getLoadedClients && isExporting">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>{{ $t('base.loading') }}</strong>
                </div>
                <span v-else>{{ formLabels.export_csv_button }}</span>
            </b-button>
        </page-title>
        <b-row align-h="between" align-v="end">
            <b-col cols="12" md="3" v-if="getClientsLength" class="mb-4">
                {{ formLabels.page }}:
                <b-select size="sm" :options="perPageOptions" v-model="pageSetup.per_page" class="d-inline-block w-auto"
                          @change="paginationChange(pageSetup)"/>
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
                        <b-button variant="outline-secondary" @click="clearData"><em class="ion ion-md-close"></em>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
        </b-row>
        <!-- Table -->
        <div class="table-responsive">
            <b-table
                    :items="getClients"
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
                    :selectable="isSelectable"
                    :dark="isDark"
                    :foot-clone="isFootClone"
                    :busy="!getLoadedClients && !isExporting"
                    :no-local-sorting="!isSortableLocal"
                    :sort-by="sortSetup.by"
                    :sort-desc="sortSetup.desc"
                    @sort-changed="sortingChanged"
                    show-empty
            >
                <template v-slot:cell(cellagon_id)="data">
                    <router-link :to="{ name: 'clients-view', params: { id: data.item.id } }">{{ data.item.cellagon_id }}
                    </router-link>
                </template>
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>{{ $t('base.loading') }}</strong>
                    </div>
                </template>
                <template v-slot:empty>
                    <div>{{ $t('warnings.noClientsAvailable') }}</div>
                </template>
            </b-table>
        </div>
        <pagination
                :dataLength="getClientsLength"
                :page="pageSetup.page"
                :per_page="pageSetup.per_page"
                @paginationChange="paginationChange"
        ></pagination>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationComponent from '../page-components/PaginationComponent'
import { saveAs } from 'file-saver'
import { unparse } from 'papaparse'

export default {
  name: 'client-list',
  metaInfo () {
    return {
      title: this.$t('clients.title')
    }
  },
  components: {
    pagination: PaginationComponent
  },
  data () {
    return {
      pageTitle: {
        parents: [this.$t('clients.title')],
        title: this.$t('base.list')
      },
      formLabels: {
        export_csv_button: this.$t('formFields.export_csv_button'),
        page: this.$t('base.perPage')
      },
      tableFields: [
        {
          key: 'internal_id',
          label: this.$t('tableFields.internal_nr')
        },
        {
          key: 'cellagon_id',
          label: this.$t('tableFields.cellagonId')
        },
        {
          key: 'first_name',
          label: this.$t('tableFields.firstName')
        },
        {
          key: 'last_name',
          label: this.$t('tableFields.lastName')
        },
        {
          key: 'address',
          label: this.$t('tableFields.address'),
          class: 'd-none d-md-table-cell'
        },
        {
          key: 'postal_code',
          label: this.$t('tableFields.postalCode'),
          class: 'd-none d-md-table-cell'
        },
        {
          key: 'city',
          label: this.$t('tableFields.city'),
          class: 'd-none d-md-table-cell',
          sortable: true
        },
        {
          key: 'country',
          label: this.$t('tableFields.country'),
          class: 'd-none d-md-table-cell'
        },
        {
          key: 'comment',
          label: this.$t('tableFields.comments'),
          class: 'd-md-table-cell'
        },
        {
          key: 'email',
          label: this.$t('tableFields.email'),
          class: 'd-none'
        },
        {
          key: 'telephone',
          label: this.$t('tableFields.telephone'),
          class: 'd-none'
        },
        {
          key: 'mobile',
          label: this.$t('tableFields.mobile'),
          class: 'd-none'
        }
      ],
      // Pagination
      pageSetup: {
        per_page: 10,
        page: 1
      },
      sortSetup: {
        by: null,
        desc: false
      },
      popoverShow: [],
      disable: [],

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
      isSmall: true,
      isSelectable: false,
      isDark: false,
      isFootClone: false,
      isSortableLocal: false,
      headerStyle: null,
      isExporting: false,

      searchSetup: {
        minCharLength: 3,
        searchData: ''
      },
      searchedData: false
    }
  },
  computed: {
    ...mapGetters([
      'getClients',
      'getAllClients',
      'getClientsLength',
      'getLoadedClients',
      'getDataError'
    ])
  },
  created () {
    this.grabClients()
  },
  methods: {
    paginationChange (value) {
      this.pageSetup.per_page = value.per_page
      this.pageSetup.page = value.page
      this.grabClients()
    },
    getFilteredClients () {
      this.sortSetup.by = null
      if (this.searchSetup.searchData.length >= this.searchSetup.minCharLength || (this.searchedData && this.searchSetup.searchData.length === 0)) {
        this.searchedData = !this.searchedData
        this.grabClients()
      }
    },
    grabClients () {
      this.$store.dispatch('setClientsList', {
        searchData: this.searchSetup.searchData,
        pageSetup: this.pageSetup,
        sortSetup: this.sortSetup
      }).then(() => {
        if (this.getDataError !== null) {
          this.showNotification('error', this.getDataError)
        }
      })
    },
    clearData () {
      this.searchSetup.searchData = ''
      this.searchedData = false
      this.sortSetup.by = null
      this.grabClients()
    },
    sortingChanged (sorting) {
      this.sortSetup.by = sorting.sortBy
      this.sortSetup.desc = sorting.sortDesc

      this.grabClients()
    },
    exportToCsv () {
      this.isExporting = true
      this.$store.dispatch('setAllClientsList', {
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
          let CSVdata = unparse(this.getAllClients, {
            'columns': columnFields,
            'header': false
          })

          CSVdata = headerLabels.join(',') + '\r\n' + CSVdata

          let blob = new Blob([CSVdata], {
            type: 'application/csv;charset=utf-8'
          })

          saveAs(blob, 'kunden_liste.csv')
        }
      })
    }
  }
}
</script>

<style scoped>
    .table-responsive >>> th:nth-child(1) {
        width: 8%;
    }

    .table-responsive >>> th:nth-child(2) {
        width: 8%;
    }

    .table-responsive >>> th:nth-child(3) {
        width: 15%;
    }

    .table-responsive >>> th:nth-child(4) {
        width: 15%;
    }

    .table-responsive >>> th:nth-child(5) {
        width: 24%;
    }

    .table-responsive >>> th:nth-child(6) {
        width: 10%;
    }

    .table-responsive >>> th:nth-child(7) {
        width: 10%;
    }

    .table-responsive >>> th:nth-child(8) {
        width: 10%;
    }
</style>
