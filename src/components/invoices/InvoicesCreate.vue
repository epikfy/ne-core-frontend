<template>
    <div>
        <page-title :pageTitle="pageTitle"></page-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(submit)">
                <!--Buttons-->
                <b-row align-h="end" class="mb-4">
                    <b-col md="2" lg="2" xl="1" class="text-right">
                        <b-btn v-if="spinner" type="submit" variant="success">
                            Create
                        </b-btn>
                        <b-btn v-else type="" variant="success" disabled>
                            <b-spinner/>
                            Creating
                        </b-btn>
                    </b-col>
                </b-row>
                <!--Inputs-->
                <b-card no-body>
                    <b-card-body>
                        <div class="row">
                            <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
                                <div class="text-muted small">Client Name</div>
                                <validation-provider rules="required" v-slot="{ errors }">
                                    <b-input-group>
                                        <b-input-group-text slot="prepend" v-if="loading">
                                            <em class="ion ion-md-sync"></em>
                                        </b-input-group-text>
                                        <b-input-group-text slot="prepend" v-if="!loading">
                                            <em class="ion ion-ios-search"></em>
                                        </b-input-group-text>
                                        <input type="text" class="form-control"
                                               placeholder="Search for client"
                                               autocomplete="off"
                                               v-model="value"
                                               @keydown.down="down"
                                               @keydown.up="up"
                                               @keydown.enter="hit"
                                               @keydown.esc="reset"
                                               @blur="reset"
                                               @input="updateQuery"/>
                                        <b-input-group-text slot="append" v-if="isDirty || value" @click="resetInput">
                                            <em class="ion ion-md-close"></em>
                                        </b-input-group-text>
                                    </b-input-group>
                                    <div class="dropdown-menu" :class="{ 'd-block': hasItems }"
                                         :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                        <a class="dropdown-item" href="javascript:void(0)"
                                           v-for="(item, $item) in items" :key="item.first_name"
                                           :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                            <span class="name" v-text="item.first_name"></span>
                                            <span class="text-muted">{{ item.last_name }}</span>
                                            <span class="text-muted"> <strong>Praxis Nr:</strong> {{ item.internal_id }}</span>
                                        </a>
                                    </div>
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
                                <div class="text-muted small">Invoice Nr</div>
                                <validation-provider rules="required" v-slot="{ errors }">
                                    <b-input type="number" v-model='Invoice.invoice.internal_nr'
                                             placeholder="12313 ..."/>
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
                                <div class="text-muted small">Invoice Date</div>
                                <validation-provider rules="required" v-slot="{ errors }">
                                    <flat-pickr v-model="Invoice.invoice.date" :config="dateConfig"
                                                :placeholder="!isIEMode ? 'Select Date' : null"/>
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-lg-6 col-xl-6 mb-4">
                                <div class="text-muted small">Product</div>
                                <validation-provider rules="" v-slot="{ errors }">
                                    <b-select value=""
                                              v-model='Invoice.invoice.product_id'
                                              :options="Products.products.options"
                                              value-field="id"
                                              text-field="description"
                                              placeholder="Select Product"
                                    />
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                            <div class="col-md-6 col-lg-6 col-xl-6 mb-4">
                                <div class="text-muted small">Product Quantity</div>
                                <validation-provider rules="" v-slot="{ errors }">
                                    <b-input type="number" v-model='Invoice.invoice.quantity'
                                             placeholder="1, 2, 3, ..."/>
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
                                <div class="text-muted small">Invoice amount</div>
                                <validation-provider rules="required" v-slot="{ errors }">
                                    <b-input-group prepend="€">
                                        <b-input type="number" step=".01" v-model='Invoice.invoice.amount'
                                                 placeholder=""/>
                                    </b-input-group>
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
                                <div class="text-muted small">Taxes Amount</div>
                                <validation-provider rules="required" v-slot="{ errors }">
                                    <b-input-group prepend="€">
                                        <b-input type="number" v-model='Invoice.invoice.tax' placeholder=""/>
                                    </b-input-group>
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
                                <div class="text-muted small">Discount amount</div>
                                <validation-provider rules="" v-slot="{ errors }">
                                    <b-input-group prepend="€">
                                        <b-input type="number" v-model='Invoice.invoice.discount' placeholder=""/>
                                    </b-input-group>
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
                                <div class="text-muted small">Total amount</div>
                                <validation-provider rules="required" v-slot="{ errors }">
                                    <b-input-group prepend="€">
                                        <b-input type="number" disabled v-model='totalAmount' placeholder=""/>
                                    </b-input-group>
                                    <span class="text-danger">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
            </form>
        </ValidationObserver>
    </div>
</template>

<style src="@/vendor/styles/pages/authentication.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<!-- Custom template animation -->
<style>
</style>

<script>
import Vue from 'vue'
import Axios from 'axios'
import flatPickr from 'vue-flatpickr-component'
import VueTypeahead from 'vue-typeahead'
import { required } from 'vee-validate/dist/rules'
import { mapState } from 'vuex'
import { ValidationProvider, extend } from 'vee-validate'

Vue.prototype.$http = Axios

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
    document.body.getAttribute('dir') === 'rtl'
}

extend('required', {
  ...required,
  message: 'Please complete'
})

export default {
  extends: VueTypeahead,
  name: 'invoices-create',
  metaInfo: {
    title: 'Invoices-Create'
  },
  components: {
    ValidationProvider,
    flatPickr
  },
  computed: {
    ...mapState([
      'Invoice',
      'UserLogin',
      'Client',
      'Products'
    ]),
    totalAmount: function () {
      let amount = this.setFloat(this.Invoice.invoice.amount)
      let discount = this.setFloat(this.Invoice.invoice.discount)
      let tax = this.setFloat(this.Invoice.invoice.tax)

      return (amount + tax) - discount
    }
  },
  created () {
    this.$store.dispatch('cleanInvoice')
    this.$store.dispatch('cleanClient')
  },
  data () {
    return {
      pageTitle: {
        parents: ['Invoices'],
        title: 'Create'
      },
      disabled: false,
      value: '',
      src: `${Axios.defaults.baseURL}api/v1/search/clients`,
      queryParamName: 'search',
      limit: 5,
      minChars: 3,
      spinner: true,
      date: null,
      dateConfig: {
        altInput: true,
        animate: !isRTL()
      }
    }
  },
  methods: {
    submit () {
      this.spinner = false
      this.Invoice.invoice.user_id = this.UserLogin.user.id
      this.Invoice.invoice.client_id = this.Client.client.id
      this.$store.dispatch('createInvoice', this.Invoice.invoice)
        .then(() => {
          this.showNotification('success', 'The Invoice was successfully created')
          this.resetInput()
          this.$refs.form.reset()
        })
        .catch((error) => {
          this.showNotification('error', `The system could not create the Invoice: ${error.response.data.message}`)
        })
      this.spinner = true
    },
    updateQuery () {
      this.spinner = true
      this.modifyMode = true
      this.query = this.value
      this.update()
    },
    onHit (item) {
      this.spinner = true
      this.value = `${item.first_name} ${item.last_name}`
      this.Client.client = item
      this.$store.dispatch('setClient', item)
      this.reset()
    },
    prepareResponseData (data) {
      return data.data
    },
    resetInput () {
      this.spinner = true
      this.value = ''
      this.Client.client = []
      this.reset()
    },
    setFloat: function (value) {
      if (isNaN(value) || value === '') {
        return parseFloat(0)
      } else {
        return parseFloat(value)
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
