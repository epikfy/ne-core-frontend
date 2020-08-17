<template>
    <b-card no-body :header="headerTitle" :header-tag="headerTag" class="mb-4">
        <b-card-body>
            <b-row>
                <b-col cols="12" class="mb-4">
                    <validation-provider name="Invoice Nr." rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.invoiceNr }}</div>
                            <b-input
                                    type="number"
                                    v-model='invoiceInfo.invoice.invoice_nr'
                                    v-focus="!modifyMode" :placeholder="placeholders.invoiceNr"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                                    min="0"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="mb-4">
                    <validation-provider name="Invoice Date" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.invoiceDate }}</div>
                            <datepicker
                                    input-class="form-control"
                                    v-model="invoiceInfo.invoice.date"
                                    :placeholder="!isIEMode ? placeholders.invoiceDate : null"
                                    :format="datePickerDateFormat"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" lg="6" xl="6" class="mb-4">
                    <validation-provider name="Product" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.product }}</div>
                            <b-select value="Select Product"
                                      v-model='invoiceInfo.invoice.product_id'
                                      :options="getProducts.options"
                                      value-field="id"
                                      text-field="description"
                                      :placeholder="placeholders.product"
                                      :disabled="modifyMode"
                                      :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col md="6" lg="6" xl="6" class="mb-4">
                    <validation-provider name="Product Quantity" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.productQuantity }}</div>
                            <b-input
                                    type="number"
                                    v-model='invoiceInfo.invoice.quantity'
                                    :placeholder="placeholders.productQuantity"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                                    min="0"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="mb-4">
                    <validation-provider name="Invoice amount" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.invoiceAmount }}</div>
                            <b-input-group prepend="€">
                                <b-input
                                        type="number"
                                        v-model='invoiceInfo.invoice.amount'
                                        :placeholder="placeholders.invoiceAmount"
                                        :disabled="modifyMode"
                                        :state="errors[0] ? false : null"
                                        min="0"
                                />
                                <span class="invalid-tooltip">{{ errors[0] }}</span>
                            </b-input-group>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="mb-4">
                    <validation-provider name="Taxes amount" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.taxesAmount }}</div>
                            <b-input-group prepend="€">
                                <b-input
                                        type="number"
                                        v-model='invoiceInfo.invoice.tax'
                                        :placeholder="placeholders.taxesAmount"
                                        :disabled="modifyMode"
                                        :state="errors[0] ? false : null"
                                        min="0"
                                />
                                <span class="invalid-tooltip">{{ errors[0] }}</span>
                            </b-input-group>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="mb-4">
                    <validation-provider name="Discount amount" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.discountAmount }}</div>
                            <b-input-group prepend="€">
                                <b-input
                                        type="number"
                                        v-model='invoiceInfo.invoice.discount'
                                        :placeholder="placeholders.discountAmount"
                                        :disabled="modifyMode"
                                        :state="errors[0] ? false : null"
                                        min="0"
                                />
                                <span class="invalid-tooltip">{{ errors[0] }}</span>
                            </b-input-group>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="mb-4">
                    <validation-provider name="Gesamtsumme" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.totalAmount }}</div>
                            <b-input-group prepend="€">
                                <b-input
                                        type="number"
                                        v-model='totalAmount'
                                        placeholder="Gesamtsumme"
                                        disabled
                                        :state="errors[0] ? false : null"
                                />
                                <span class="invalid-tooltip">{{ errors[0] }}</span>
                            </b-input-group>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { required } from 'vee-validate/dist/rules'
import { ValidationProvider, extend } from 'vee-validate'
import Datepicker from 'vuejs-datepicker'

extend('required', {
  ...required,
  message: '{_field_} cannot be empty.'
})

export default {
  name: 'InvoicesForm',
  props: {
    modifyMode: {
      type: Boolean,
      default: false
    },
    invoiceInfo: {
      type: Object,
      required
    },
    headerTitle: {
      type: String,
      default: ''
    },
    headerTag: {
      type: String,
      default: 'h6'
    }
  },
  data () {
    return {
      formLabels: {
        invoiceNr: this.$t('formFields.invoiceNr'),
        invoiceDate: this.$t('formFields.invoiceDate'),
        product: this.$t('formFields.product'),
        productQuantity: this.$t('formFields.productQuantity'),
        invoiceAmount: this.$t('formFields.invoiceAmount'),
        taxesAmount: this.$t('formFields.taxesAmount'),
        discountAmount: this.$t('formFields.discountAmount'),
        totalAmount: this.$t('formFields.totalAmount')
      },
      placeholders: {
        invoiceNr: this.$t('placeholders.invoiceNr'),
        invoiceDate: this.$t('placeholders.invoiceDate'),
        product: this.$t('placeholders.product'),
        productQuantity: this.$t('placeholders.productQuantity'),
        invoiceAmount: this.$t('placeholders.invoiceAmount'),
        taxesAmount: this.$t('placeholders.taxesAmount'),
        discountAmount: this.$t('placeholders.discountAmount')
      }
    }
  },
  computed: {
    ...mapGetters(['getProducts']),
    totalAmount: function () {
      let amount = this.setFloat(this.invoiceInfo.invoice.amount)
      let discount = this.setFloat(this.invoiceInfo.invoice.discount)
      let tax = this.setFloat(this.invoiceInfo.invoice.tax)

      let total = (amount + tax) - discount

      return total.toFixed(2)
    }
  },
  components: {
    ValidationProvider,
    Datepicker
  },
  methods: {
    setFloat: function (value) {
      if (isNaN(value) || value === '' || value === null) {
        return parseFloat(0)
      }
      return parseFloat(value)
    }
  },
  directives: {
    focus: {
      // Definición de directivas
      inserted: el => {
        el.focus()
      },
      update: (el, binding) => {
        let value = binding.value
        let oldValue = binding.oldValue
        if (value !== oldValue) {
          Vue.nextTick(() => {
            el.focus()
          })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
