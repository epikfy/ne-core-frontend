<template>
    <div>
        <page-title :pageTitle="pageTitle"></page-title>
            <b-card style="width: 700px;">
                <b-card-header>
                    <b-row>
                         <b-col cols="6">
                             <h3>Sales per Year</h3>
                         </b-col>
                        <b-col cols="6">
                            <b-form-select
                                    v-model="selectedYear"
                                    :options="selectOptions"
                                    value-field="item"
                                    text-field="name"
                                    @change="getChartInvoices"
                                    :disabled="!loadedInvoices"
                            >
                            </b-form-select>
                        </b-col>
                    </b-row>
                </b-card-header>
                <b-card-body>
                    <line-chart v-if="loadedInvoices && !getLoadingDashboardData && getInvoicesTotalDashboard.length > 0" :chart-data="lineData" :options="chartOptions" />
                    <div v-else-if="!loadedInvoices && !getLoadingDashboardData" class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>{{ $t('base.loading') }}</strong>
                    </div>
                    <div v-else> {{ $t('data.noData') }} </div>
                </b-card-body>
            </b-card>
    </div>
</template>

<script>
import LineChart from '../page-components/LineChart'
import { mapGetters } from 'vuex'

const months = {
  selected: '',
  options: [
    {
      item: '',
      name: 'ALLES',
      shortName: 'ALLES'
    },
    {
      item: 1,
      name: 'JANUAR',
      shortName: 'JAN'
    },
    {
      item: 2,
      name: 'FEBRUAR',
      shortName: 'FEB'
    },
    {
      item: 3,
      name: 'MÄRZ',
      shortName: 'MÄR'
    },
    {
      item: 4,
      name: 'APRIL',
      shortName: 'APR'
    },
    {
      item: 5,
      name: 'MAI',
      shortName: 'MAI'
    },
    {
      item: 6,
      name: 'JUNI',
      shortName: 'JUN'
    },
    {
      item: 7,
      name: 'JULI',
      shortName: 'JUL'
    },
    {
      item: 8,
      name: 'AUGUST',
      shortName: 'AUG'
    },
    {
      item: 9,
      name: 'SEPTEMBER',
      shortName: 'SEP'
    },
    {
      item: 10,
      name: 'OKTOBER',
      shortName: 'OKT'
    },
    {
      item: 11,
      name: 'NOVEMBER',
      shortName: 'NOV'
    },
    {
      item: 12,
      name: 'DEZEMBER',
      shortName: 'DEZ'
    }
  ]
}

export default {
  name: 'home',
  metaInfo () {
    return {
      title: this.$t('home.title')
    }
  },
  components: {
    LineChart
  },
  data () {
    return {
      pageTitle: {
        parents: [],
        title: this.$t('home.dashboard')
      },
      lineData: null,
      chartOptions: {
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return value + ' €'
                }
              }
            }
          ]
        }
      },
      months: months,
      selectedYear: 2020,
      selectOptions: [],
      loadedInvoices: false
    }
  },
  created () {
    this.selectOptions = this.getSelectYearOptions()
    this.selectedYear = this.selectOptions[0]
    this.getChartInvoices()
  },
  computed: {
    getLineData () {
      return this.lineData
    },
    ...mapGetters(['getDataError', 'getInvoicesTotalDashboard', 'getLoadingDashboardData'])
  },
  methods: {
    getSelectedYearData (selectedYear) {
      this.selectedYear = selectedYear
    },
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
    getChartInvoices () {
      this.loadedInvoices = false
      this.$store.dispatch('setInvoicesDashboard', { year: this.selectedYear })
        .then(() => {
          if (this.getDataError !== null) {
            this.showNotification('error', this.getDataError)
          } else {
            this.loadedInvoices = true
            let data = []
            let labels = []
            this.getInvoicesTotalDashboard.map(function (item, index) {
              months.options.map(function (monthItem, monthIndex) {
                if (item['month'] === monthItem['item']) {
                  labels.push(monthItem['shortName'])
                }
              })
              data.push(item['total'])
            })
            this.lineData = {
              labels: labels,
              datasets: [
                {
                  label: 'Sales',
                  data: data,
                  fill: false,
                  backgroundColor: '#00bb7e',
                  borderColor: '#00bb7e'
                }
              ]
            }
          }
        })
    }
  }
}
</script>
