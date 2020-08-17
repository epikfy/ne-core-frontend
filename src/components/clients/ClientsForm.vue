<template>
    <b-card no-body>
        <b-card-body>
            <b-row>
                <b-col md="6" lg="6" xl="6" class="mb-2 mt-4">
                    <validation-provider name="Client Id" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.clientId }}</div>
                            <b-input
                                    name="ClientId"
                                    type="text"
                                    :trim="true"
                                    v-focus="!modifyMode"
                                    v-model='clientInfo.client.internal_id'
                                    :placeholder="placeholders.praxis"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col md="6" lg="6" xl="6" class="mb-2 mt-4">
                    <validation-provider name="Cellagon Id" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.cellagonId }}</div>
                            <b-input
                                    type="text"
                                    v-model='clientInfo.client.cellagon_id'
                                    :trim="true"
                                    placeholder=""
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" lg="6" xl="6" class="mb-2">
                    <validation-provider name="First Name" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.firstName }}</div>
                            <b-input
                                    type="text"
                                    v-model='clientInfo.client.first_name'
                                    :trim="true"
                                    placeholder=""
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col md="6" lg="6" xl="6" class="mb-2">
                    <validation-provider name="Last Name" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.lastName }}</div>
                            <b-input
                                    type="text"
                                    v-model='clientInfo.client.last_name'
                                    :trim="true"
                                    placeholder=""
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" lg="6" xl="6" class="mb-2">
                    <validation-provider name="Phone" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.phone }}</div>
                            <b-input
                                    type="text"
                                    v-model='clientInfo.client.telephone'
                                    :trim="true"
                                    :placeholder="placeholders.phone"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col md="6" lg="6" xl="6" class="mb-2">
                    <validation-provider name="Mobile" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.mobile }}</div>
                            <b-input
                                    type="text"
                                    v-model='clientInfo.client.mobile'
                                    :trim="true"
                                    :placeholder="placeholders.mobil"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="mb-2">
                    <validation-provider name="E-Mail" rules="email" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.email }}</div>
                            <b-input
                                    type="email"
                                    v-model='clientInfo.client.email'
                                    :trim="true"
                                    :placeholder="placeholders.email"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="mb-2">
                    <validation-provider name="Address" rules="required" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.address }}</div>
                            <b-input
                                    type="text"
                                    v-model='clientInfo.client.address'
                                    :trim="true"
                                    :placeholder="placeholders.address"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="4" lg="4" xl="4" class="mb-2">
                    <validation-provider name="ZIP Code" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.code }}</div>
                            <b-input
                                    type="text"
                                    v-model='clientInfo.client.postal_code'
                                    :trim="true"
                                    :placeholder="placeholders.code"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col md="4" lg="4" xl="4" class="mb-2">
                    <validation-provider name="City" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.city }}</div>
                            <b-input
                                    type="text"
                                    v-model='clientInfo.client.city'
                                    :trim="true"
                                    :placeholder="placeholders.city"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col md="4" lg="4" xl="4" class="mb-2">
                    <validation-provider name="Country" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.country }}</div>
                            <b-select
                                    value="Select state"
                                    v-model='clientInfo.client.country'
                                    :options="countries"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="mb-2">
                    <validation-provider name="Comment" rules="" v-slot="{ errors }">
                        <b-form-group class="position-relative">
                            <div class="text-muted small">{{ formLabels.comment }}</div>
                            <b-textarea
                                    v-model='clientInfo.client.comment'
                                    :placeholder="placeholders.comment"
                                    :trim="true"
                                    :disabled="modifyMode"
                                    :state="errors[0] ? false : null"
                            />
                            <span class="invalid-tooltip">{{ errors[0] }}</span>
                        </b-form-group>
                    </validation-provider>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
import Vue from 'vue'
import { ValidationProvider, extend } from 'vee-validate'
import { email, required } from 'vee-validate/dist/rules'
import { countries } from './countries'

extend('email', {
  ...email,
  message: 'Please enter a valid email'
})

extend('required', {
  ...required,
  message: '{_field_} cannot be empty.'
})

export default {
  props: {
    modifyMode: {
      type: Boolean,
      default: false
    },
    clientInfo: {
      type: Object,
      required
    }
  },
  data () {
    return {
      countries: countries,
      formLabels: {
        clientId: this.$t('formFields.clientId'),
        cellagonId: this.$t('formFields.cellagonId'),
        firstName: this.$t('formFields.firstName'),
        lastName: this.$t('formFields.lastName'),
        phone: this.$t('formFields.phone'),
        mobile: this.$t('formFields.mobile'),
        email: this.$t('formFields.email'),
        address: this.$t('formFields.address'),
        code: this.$t('formFields.code'),
        city: this.$t('formFields.city'),
        country: this.$t('formFields.country'),
        comment: this.$t('formFields.commentClient')
      },
      placeholders: {
        praxis: this.$t('placeholders.praxis'),
        phone: this.$t('placeholders.phone'),
        mobile: this.$t('placeholders.mobile'),
        email: this.$t('placeholders.email'),
        address: this.$t('placeholders.address'),
        code: this.$t('placeholders.code'),
        city: this.$t('placeholders.city'),
        comment: this.$t('placeholders.commentClient')
      }
    }
  },
  components: {
    ValidationProvider
  },
  directives: {
    focus: {
      // Definición de directiva
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
