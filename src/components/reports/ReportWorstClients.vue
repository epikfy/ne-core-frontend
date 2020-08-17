<template>
    <div>
        <page-title :pageTitle="pageTitle">
            <b-button slot="buttons" variant="secondary" @click="print('printInfo')" right>{{ formLabels.print_button }}</b-button>
        </page-title>

        <b-row class="justify-content-md-end justify-content-sm-start mb-3">
            <b-col cols="10" align-self="start" v-if="getWorstClientsLength">
                <b-form-group>
                    {{ formLabels.page }}:
                    <b-select size="sm" :options="perPageOptions" v-model="pageSetup.per_page" class="d-inline-block w-auto"
                              @change="paginationChange(pageSetup)"/>
                </b-form-group>
            </b-col>
            <b-col cols="2" align-self="end">
                <multiselect
                        v-model="selectedYear"
                        :options="selectOptions"
                        :allowEmpty="false"
                        :showNoResults="false"
                        :showLabels="false"
                        :placeholder="placeholders.search_year"
                        @select="getSelectedYearData"
                />
            </b-col>
        </b-row>

        <div class="table-responsive">
            <b-table
                    :items="getWorstClients"
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
                    :busy="!getLoadedWorstClients"
                    show-empty
            >
                <template v-slot:cell(first_name)="data">
                    <router-link :to="{ name: 'clients-view', params: { id: data.item.id } }">{{ data.item.first_name }}</router-link>
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
                :dataLength="getWorstClientsLength"
                :page="pageSetup.page"
                :per_page="pageSetup.per_page"
                @paginationChange="paginationChange"></pagination>

        <!-- Printing information, not displayed on screen -->
        <div class="table-responskive" id="printInfo">
            <h4 class="text-center">{{ pageTitle.title }}</h4>
            <b-table
                    :items="getWorstClients"
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
            </b-table>
        </div>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-input-tag/vue-input-tag.scss" lang="scss"></style>

<script>
import { mapGetters } from 'vuex'
import PaginationComponent from '../page-components/PaginationComponent'
import Multiselect from 'vue-multiselect'

export default {
  name: 'worst-clients',
  metaInfo: {
    title: 'Reports - Worst clients'
  },
  components: {
    pagination: PaginationComponent,
    Multiselect
  },
  data () {
    return {
      pageTitle: {
        parents: [this.$t('menu.reports.title')],
        title: this.$t('menu.reports.worstClients')
      },
      formLabels: {
        print_button: this.$t('formFields.print_button'),
        page: this.$t('base.perPage')
      },
      placeholders: {
        search_year: this.$t('placeholders.search_year')
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
          label: this.$t('tableFields.totalReveneu')
        },
        {
          key: 'average',
          label: this.$t('tableFields.averageAmount')
        },
        {
          key: 'date',
          label: this.$t('tableFields.date_last_purchase')
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
      selectedYear: 2020,
      selectOptions: [],

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
      'getWorstClients',
      'getWorstClientsLength',
      'getLoadedWorstClients'
    ])
  },
  created () {
    this.selectOptions = this.getSelectYearOptions()
    this.selectedYear = this.selectOptions[0]
    this.grabWorstClients()
  },
  methods: {
    getSelectYearOptions (oldestYear = null) {
      let currentDate = new Date()
      let currentYear = currentDate.getFullYear()
      let selectOptions = [currentYear]
      let numberOfYears = 5

      if (oldestYear === null || oldestYear >= currentYear || !Number.isInteger(oldestYear)) {
        oldestYear = currentYear - numberOfYears
      }

      let yearAdded = currentYear - 1
      while (yearAdded >= oldestYear) {
        selectOptions.push(yearAdded)
        yearAdded--
      }
      return selectOptions
    },
    setPopOver (id) {
      this.popoverShow[id] = !this.popoverShow[id]
    },
    paginationChange (value) {
      this.pageSetup.per_page = value.per_page
      this.pageSetup.page = value.page
      this.grabWorstClients()
    },
    getSelectedYearData (selectedYear) {
      this.selectedYear = selectedYear
      this.grabWorstClients()
    },
    grabWorstClients () {
      this.$store.dispatch('setWorstClients', {
        selectedYear: this.selectedYear,
        pageSetup: this.pageSetup
      })
    }
  }
}
</script>

<style scoped>
    .table-responsive >>> th:nth-child(1) {
        width: 15%;
    }

    .table-responsive >>> th:nth-child(2) {
        width: 15%;
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
