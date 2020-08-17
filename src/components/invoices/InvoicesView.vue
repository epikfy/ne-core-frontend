<template>
    <div>
        <page-title :pageTitle="pageTitle"></page-title>
        <ValidationObserver v-slot="{ handleSubmit }">
            <!--Typehead and Button-->
            <b-row class="mb-4" align-h="between" align-v="end">
                <!--Typehead-->
                <b-col md="5">
                    <b-card class="">
                        <div class="position-relative">
                            <b-input-group>
                                <b-input-group-text slot="prepend" v-if="loading">
                                    <em class="ion ion-md-sync"></em>
                                </b-input-group-text>
                                <b-input-group-text slot="prepend" v-if="!loading">
                                    <em class="ion ion-ios-search"></em>
                                </b-input-group-text>
                                <b-input type="text" class="form-control"
                                         :placeholder="placeholders.invoice"
                                         autocomplete="off"
                                         v-model="searchInvoiceNr"
                                         @keydown.down="down"
                                         @keydown.up="up"
                                         @keydown.enter="hit"
                                         @keydown.esc="reset"
                                         @blur="reset"
                                         @input="updateQuery"
                                />
                                <b-input-group-append v-if="isDirty || searchInvoiceNr">
                                    <b-button variant="outline-secondary" @click="resetInput"><em class="ion ion-md-close"></em></b-button>
                                </b-input-group-append>
                            </b-input-group>

                            <div class="dropdown-menu" :class="{ 'd-block': hasItems }"
                                 :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :key="item.first_name"
                                   :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                    <span class="name">Invoice Nr:</span>
                                    <strong v-text="item.invoice_nr"></strong>
                                </a>
                            </div>
                        </div>
                    </b-card>
                </b-col>

                <!--Button-->
                <b-col cols="12" md="5" class="text-right mt-2">
                    <div v-if="spinner">
                        <b-btn @click="handleSubmit(toogleView)" type="" :variant="modifyMode ? 'primary' : 'success'"
                               :disabled="searchInvoiceNr === pageTitle.title ? false : true">
                            {{ modifyMode ? $t('base.modify') : $t('base.saveChanges') }}
                        </b-btn>
                        <b-btn v-if="!modifyMode" @click="handleSubmit(toogleView(true))" type="" variant="danger">{{ $t('base.cancel') }}</b-btn>
                    </div>
                    <div v-else>
                        <b-btn type="" variant="success" disabled>
                            <b-spinner/>
                            {{ $t('base.savingChanges') }}
                        </b-btn>
                    </div>
                </b-col>
            </b-row>
            <!--Main info-->
            <b-card :header="formLabels.main" header-tag="h6" class="mb-4">
                <b-row>
                    <b-col md="3" lg="3" xl="3" class="mb-4">
                        <div class="text-muted small">{{ formLabels.invoiceId }}</div>
                        <b-input type="text" disabled v-model='Invoice.invoice.id' :placeholder="placeholders.invoiceId"/>
                    </b-col>
                    <b-col md="3" lg="3" xl="3" class="mb-4">
                        <div class="text-muted small">{{ formLabels.clientName }}</div>
                        <b-input type="text" disabled v-model='getFullName' :placeholder="placeholders.clientName"/>
                    </b-col>
                    <b-col md="3" lg="3" xl="3" class="mb-4">
                        <div class="text-muted small">{{ formLabels.createdBy }}</div>
                        <b-input type="text" disabled v-model='Invoice.invoice.user_name' :placeholder="placeholders.user"/>
                    </b-col>
                    <b-col md="3" lg="3" xl="3" class="mb-4">
                        <div class="text-muted small">{{ formLabels.createdAt }}</div>
                        <b-input disabled :value="Invoice.invoice.created_at | formatDate" :placeholder="placeholders.createdAt"/>
                    </b-col>
                </b-row>
            </b-card>

            <invoices-form :header-title="formLabels.invoiceDetail" :modify-mode="modifyMode" :invoice-info="Invoice"></invoices-form>
        </ValidationObserver>
    </div>
</template>

<style src="@/vendor/styles/pages/authentication.scss" lang="scss"></style>
<!-- Custom template animation -->
<style>
    .form-control:disabled {
        background-color: #fdfdfd !important;
    }
</style>

<script>
import Vue from 'vue'
import Axios from 'axios'
import VueTypeahead from 'vue-typeahead'
import { mapState, mapGetters } from 'vuex'
import InvoicesForm from './InvoicesForm'

Vue.prototype.$http = Axios

export default {
  extends: VueTypeahead,
  name: 'invoices-view',
  metaInfo: {
    title: 'Invoices-view'
  },
  components: {
    InvoicesForm
  },
  data () {
    return {
      pageTitle: {
        parents: [this.$t('invoices.title')],
        title: this.$t('base.view')
      },
      formLabels: {
        main: this.$t('formFields.main'),
        invoiceId: this.$t('formFields.invoiceId'),
        clientName: this.$t('formFields.clientName'),
        createdAt: this.$t('formFields.createdAt'),
        createdBy: this.$t('formFields.createdBy'),
        invoiceDetail: this.$t('formFields.invoiceDetail')
      },
      placeholders: {
        invoice: this.$t('placeholders.search_for_invoice'),
        invoiceId: this.$t('placeholders.invoiceId'),
        clientName: this.$t('placeholders.clientName'),
        user: this.$t('placeholders.user'),
        createdAt: this.$t('placeholders.created_at')
      },
      modifyMode: true,
      disabled: false,
      searchInvoiceNr: '',
      src: `${Axios.defaults.baseURL}api/v1/invoices`,
      queryParamName: 'search',
      limit: 5,
      minChars: 3,
      spinner: true
    }
  },
  computed: {
    ...mapState([
      'Invoice',
      'originalInvoice',
      'UserLogin',
      'Client'
    ]),
    ...mapGetters(['getFullName'])
  },
  methods: {
    toogleView (cancel = false) {
      // Check if Invoice has been selected;
      if (this.Invoice.invoice.id === false) {
        return
      }
      // Check if the View is in mode Modify or view:
      if (this.modifyMode) {
        this.modifyMode = false
        // Only way it works removing last element and pushing to the last element
        this.pageTitle.parents.pop()
        this.pageTitle.parents.push('Modify')
      } else {
        this.pageTitle.parents.pop()
        this.pageTitle.parents.push(this.$t('base.view'))
        this.modifyMode = true
        this.spinner = false
        if (cancel === false) {
          this.$store.dispatch('updateInvoice', this.Invoice.invoice).then(() => {
            this.spinner = true
            this.showNotification('success', this.$t('success.invoiceModified'))
            this.searchInvoiceNr = `${this.Invoice.invoice.invoice_nr} ${this.Invoice.invoice.client_name}`
            this.pageTitle.title = this.searchInvoiceNr
            this.Invoice.originalInvoice = JSON.parse(JSON.stringify(this.Invoice.invoice))
          }).catch(err => {
            this.showNotification('error', `${this.$t('errors.invoiceNotModified')} ${err.response.data.message}`)
          })
        } else {
          this.$store.dispatch('setOriginalInvoiceData')
          this.spinner = true
        }
      }
    },
    updateQuery () {
      this.spinner = true
      this.modifyMode = true
      this.query = this.searchInvoiceNr
      this.update()
    },
    onHit (item) {
      this.spinner = true
      this.searchInvoiceNr = item.invoice_nr
      this.Invoice.invoice = item
      this.Invoice.originalInvoice = JSON.parse(JSON.stringify(item))
      this.reset()
      this.$store.dispatch('setInvoice', item)
      this.$store.dispatch('getClient', item.client_id)
      this.pageTitle.parents.push(this.$t('base.view'))
      this.pageTitle.title = this.searchInvoiceNr
    },
    prepareResponseData (data) {
      return data.data
    },
    resetInput () {
      this.spinner = true
      this.searchInvoiceNr = ''
      this.reset()
      this.modifyMode = true
      this.Client.client = []
      this.$store.dispatch('cleanInvoice')
      if (this.pageTitle.parents.length > 1) {
        this.pageTitle.title = this.pageTitle.parents.pop()
      }
    }
  },
  created: function () {
    this.resetInput()
    if (this.$route.params.id) {
      this.pageTitle.parents.push(this.$t('base.view'))
      this.pageTitle.title = this.$t('base.loading')
      this.$store.dispatch('getInvoice', this.$route.params.id)
        .then(() => {
          if ((this.Invoice.invoice.client_id !== null) && (this.Invoice.invoice.client_id !== 'undefined')) {
            this.$store.dispatch('getClient', this.Invoice.invoice.client_id)
          }
          this.$store.dispatch('setSelectedProduct', this.Invoice.invoice.product_id)
          this.searchInvoiceNr = `${this.Invoice.invoice.invoice_nr} ${this.Invoice.invoice.client_name}`
          this.pageTitle.title = this.searchInvoiceNr
        })
    } else {
      return ''
    }
  }
}
</script>
