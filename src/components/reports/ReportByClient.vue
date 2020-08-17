<template>
    <div>
        <page-title :pageTitle="pageTitle"></page-title>
        <b-row>
            <b-col cols="6">
                <!--Main info-->
                <b-card header="" header-tag="h6" class="mb-4">
                    <b-row>
                        <b-col cols="12" class="mb-4">
                            <div class="text-muted small">{{ formLabels.client }}</div>
                            <b-input-group>
                                <b-input-group-text slot="prepend">
                                    <em class="ion" :class="loading ? 'ion-md-sync' : 'ion-ios-search'"></em>
                                </b-input-group-text>
                                <input type="text" class="form-control"
                                       :placeholder="placeholders.client"
                                       autocomplete="off"
                                       v-model="searchForClient"
                                       @keydown.down="down"
                                       @keydown.up="up"
                                       @keydown.enter="hit"
                                       @keydown.esc="reset"
                                       @blur="reset"
                                       @input="updateQuery"/>
                                <b-input-group-text slot="append" v-if="isDirty || searchForClient" @click="resetInput">
                                    <em class="ion ion-md-close"></em>
                                </b-input-group-text>
                            </b-input-group>
                            <div class="dropdown-menu" :class="{ 'd-block': hasItems }"
                                 :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items"
                                   :key="item.first_name" :class="activeClass($item)" @mousedown="hit"
                                   @mousemove="setActive($item)">
                                    <span class="name" v-text="item.first_name"></span>
                                    <span class="text-muted">{{ item.last_name }}</span>
                                    <span class="text-muted float-right ml-3">{{ item.cellagon_id }}</span>
                                </a>
                            </div>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12" class="mb-4">
                            <div class="text-muted small">{{ formLabels.city }}</div>
                            <b-input type="text" disabled v-model='Client.client.city' :placeholder="placeholders.city"/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12" class="mb-4">
                            <div class="text-muted small">{{ formLabels.mobile }}</div>
                            <b-input type="text" disabled v-model='Client.client.mobile'
                                     :placeholder="placeholders.mobile"/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12" class="mb-4">
                            <div class="text-muted small">{{ formLabels.email }}</div>
                            <b-input type="text" disabled v-model='Client.client.email'
                                     :placeholder="placeholders.email"/>
                        </b-col>
                    </b-row>
                </b-card>
                <!--Sales by year-->
                <b-card no-body class="mb-3">
                    <b-card-header class="row no-gutters align-items-center">
                        <div class="pl-2 font-weight-bold">{{ formLabels.sales_year }}</div>
                    </b-card-header>
                    <b-card-header v-for="(sale, index) in getSales" :key="index"
                                   class="row no-gutters align-items-center">
                        <b-col cols="6" class="pl-4">{{ sale.year }}</b-col>
                        <b-col cols="6" class="text-muted">
                            <div class="row no-gutters align-items-center">
                                <div class="col-9 text-right">{{ sale.total | formatCurrency }}</div>
                            </div>
                        </b-col>
                    </b-card-header>
                </b-card>
            </b-col>
            <b-col cols="6">
                <b-card no-body class="mb-3">
                    <b-card-header class="row no-gutters align-items-center">
                        <div class="pl-2 font-weight-bold">{{ formLabels.invoice }}</div>
                    </b-card-header>
                    <b-card-header class="row no-gutters">
                        <b-col md="4" lg="4" xl="4" class="pr-2">
                            <b-form-select
                                    v-model="years.selected"
                                    :options="years.options"
                                    value-field="item"
                                    text-field="name"
                                    @change="getInvoicesByClient(); setDaysOptions();"
                                    :disabled="disabled"
                            >
                            </b-form-select>
                        </b-col>
                        <b-col md="4" lg="4" xl="4" class="pl-2 pr-2">
                            <b-form-select
                                    v-model="months.selected"
                                    :options="months.options"
                                    value-field="item"
                                    text-field="name"
                                    @change="getInvoicesByClient(); setDaysOptions();"
                                    :disabled="disabled"
                            >
                            </b-form-select>
                        </b-col>
                        <b-col md="4" lg="4" xl="4" class="pl-2">
                            <b-form-select
                                    v-model="selectedDay"
                                    :options="daysOptions"
                                    value-field="item"
                                    text-field="name"
                                    @change="getInvoicesByClient"
                                    :disabled="disabled"
                            >
                            </b-form-select>
                        </b-col>
                    </b-card-header>
                    <b-card-header v-for="(invoice, index) in getInvoices" :key="index"
                                   class="row no-gutters align-items-center">
                        <b-col cols="3">
                            <router-link :to="{ name: 'invoices-view', params: {id: invoice.id}}" target="_blank">{{ invoice.invoice_nr }}
                            </router-link>
                        </b-col>
                        <b-col cols="3" class="text-right">{{ invoice.date | formatDate }}</b-col>
                        <b-col cols="6" class="text-muted">
                            <div class="row no-gutters align-items-center">
                                <div class="col-9 text-right">{{ invoice.amount | formatCurrency }}</div>
                            </div>
                        </b-col>
                    </b-card-header>
                    <b-card-header v-if="getInvoices.length === 0 && searchForClient !== '' && !disabled">{{ formLabels.invoice_found }}
                    </b-card-header>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
    .form-control:disabled {
        background-color: #fdfdfd !important;
    }
</style>

<script>
import Vue from 'vue'
import Axios from 'axios'
import VueTypeahead from 'vue-typeahead'
import { mapGetters, mapState } from 'vuex'

Vue.prototype.$http = Axios

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
    document.body.getAttribute('dir') === 'rtl'
}

const year = new Date().getFullYear()

const years = {
  selected: year,
  options: [
    {
      item: '',
      name: 'ALLES'
    },
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024'
  ]
}

const month = new Date().getMonth() + 1

const months = {
  selected: month,
  options: [
    {
      item: '',
      name: 'ALLES'
    },
    {
      item: 1,
      name: 'JANUAR'
    },
    {
      item: 2,
      name: 'FEBRUAR'
    },
    {
      item: 3,
      name: 'MÄRZ'
    },
    {
      item: 4,
      name: 'APRIL'
    },
    {
      item: 5,
      name: 'MAI'
    },
    {
      item: 6,
      name: 'JUNI'
    },
    {
      item: 7,
      name: 'JULI'
    },
    {
      item: 8,
      name: 'AUGUST'
    },
    {
      item: 9,
      name: 'SEPTEMBER'
    },
    {
      item: 10,
      name: 'OKTOBER'
    },
    {
      item: 11,
      name: 'NOVEMBER'
    },
    {
      item: 12,
      name: 'DEZEMBER'
    }
  ]
}

export default {
  extends: VueTypeahead,
  name: 'reports-by-client',
  metaInfo: {
    title: 'Reports - by client'
  },
  components: {},
  data () {
    return {
      pageTitle: {
        parents: [this.$t('menu.reports.title')],
        title: this.$t('menu.reports.byClient')
      },
      formLabels: {
        client: this.$t('fields.criteria'),
        city: this.$t('formFields.city'),
        phone: this.$t('formFields.city'),
        mobile: this.$t('formFields.mobile'),
        email: this.$t('formFields.email'),
        invoice_found: this.$t('formFields.invoices_found'),
        invoice: this.$t('formFields.invoices'),
        sales_year: this.$t('formFields.sales_year')
      },
      placeholders: {
        client: this.$t('placeholders.search_for_clients'),
        city: this.$t('placeholders.city_registered'),
        mobile: this.$t('placeholders.mobile_registered'),
        email: this.$t('placeholders.email_registered')
      },
      spinner: true,
      modifyMode: true,
      disabled: true,
      searchForClient: '',
      src: `${Axios.defaults.baseURL}api/v1/search/clients`,
      queryParamName: 'search',
      limit: 10,
      minChars: 3,
      dateConfig: {
        altInput: true,
        animate: !isRTL()
      },
      years: years,
      months: months,
      selectedDay: '',
      daysOptions: [
        {
          item: '',
          name: 'ALLES'
        }
      ]
    }
  },
  computed: {
    ...mapState(['Client']),
    ...mapGetters([
      'getInvoices',
      'getSales'
    ])
  },
  created () {
    this.resetInput()
    this.setDaysOptions()
    if (this.$route.params.id > 0) {
      return this.$store.dispatch('getClient', this.$route.params.id)
    } else {
      return ''
    }
  },
  methods: {
    updateQuery () {
      this.spinner = true
      this.modifyMode = true
      this.query = this.searchForClient
      this.update()
    },
    onHit (item) {
      this.spinner = true
      this.modifyMode = true
      this.searchForClient = `${item.first_name} ${item.last_name}`
      this.Client.client = item
      this.disabled = false
      this.getInvoicesByClient()
      this.getSalesByYear()
      this.reset()
    },
    resetInput () {
      this.spinner = true
      this.disabled = true
      this.modifyMode = true
      this.searchForClient = ''
      this.Client.client = []
      this.$store.dispatch('cleanInvoicesByClient')
      this.$store.dispatch('cleanSalesByYear')
      this.reset()
    },
    prepareResponseData (data) {
      return data.data
    },
    getInvoicesByClient () {
      let params = {
        'id': this.Client.client.id,
        'year': years.selected,
        'month': months.selected,
        'day': this.selectedDay
      }
      this.$store.dispatch('setInvoicesByClient', params)
    },
    getSalesByYear () {
      this.$store.dispatch('setSalesByYear', this.Client.client.id)
    },
    setDaysOptions () {
      this.daysOptions = [
        {
          item: '',
          name: 'ALLES'
        }
      ]

      this.selectedDay = ''

      if (months.selected !== '' && years.selected !== '') {
        let numberOfDays = this.getDaysInMonth(months.selected, years.selected)

        for (let dayCount = 1; dayCount <= numberOfDays; dayCount++) {
          this.daysOptions.push({
            item: dayCount,
            name: dayCount
          })
        }
      }
    }
  },
  directives: {
    focus: {
      // Definición de directiva
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>
