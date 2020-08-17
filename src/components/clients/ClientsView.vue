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
                                       :placeholder="placeholders.client"
                                       autocomplete="off"
                                       v-model="searchClient"
                                       @keydown.down="down"
                                       @keydown.up="up"
                                       @keydown.enter="hit"
                                       @keydown.esc="reset"
                                       @blur="reset"
                                       @input="updateQuery"
                                />
                                <b-input-group-append v-if="isDirty || searchClient">
                                    <b-button variant="outline-secondary" @click="resetInput"><em class="ion ion-md-close"></em></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            <div class="dropdown-menu" :class="{ 'd-block': hasItems }"
                                 :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :key="item.first_name"
                                   :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                    <span class="name" v-text="item.first_name"></span>
                                    <span class="text-muted">{{ item.last_name }}</span>
                                </a>
                            </div>
                        </div>
                    </b-card>
                </b-col>

                <!--Button-->
                <b-col cols="12" md="5" class="text-right mt-2">
                    <div v-if="spinner">
                        <b-btn @click="toggleView" type="" variant="primary" v-if="modifyMode"
                               :disabled="searchClient === pageTitle.title ? false : true">
                            {{ $t('base.modify') }}
                        </b-btn>
                        <b-btn v-if="!modifyMode" @click="handleSubmit(toggleView)" type="" variant="success">{{ $t('base.saveChanges') }}</b-btn>
                        <b-btn v-if="!modifyMode" @click="handleSubmit(toggleView(true))" type="" variant="danger">{{ $t('base.cancel') }}</b-btn>
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
                    <b-col md="6" lg="6" xl="6" class="mb-4">
                        <div class="text-muted small">{{ formLabels.createdBy }}</div>
                        <b-input type="text" disabled v-model='Client.client.user_name' :placeholder="placeholders.user"/>
                    </b-col>
                    <b-col md="6" lg="6" xl="6" class="mb-4">
                        <div class="text-muted small">{{ formLabels.createdBy }}</div>
                        <b-input type="text" disabled :value='Client.client.created_at | formatDate' :placeholder="placeholders.createdAt"/>
                    </b-col>
                </b-row>
            </b-card>
            <clients-form :modify-mode="modifyMode" :client-info="Client"></clients-form>
        </ValidationObserver>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style>
    .form-control:disabled {
        background-color: #fdfdfd !important;
    }
</style>

<script>
import Vue from 'vue'
import Axios from 'axios'
import VueTypeahead from 'vue-typeahead'
import { mapState } from 'vuex'
import ClientsForm from './ClientsForm'

Vue.prototype.$http = Axios

export default {
  extends: VueTypeahead,
  name: 'client-view',
  metaInfo: {
    title: 'Clients-view'
  },
  components: {
    ClientsForm
  },
  data () {
    return {
      pageTitle: {
        parents: [this.$t('clients.title')],
        title: this.$t('base.view')
      },
      formLabels: {
        main: this.$t('formFields.main'),
        createdAt: this.$t('formFields.createdAt'),
        createdBy: this.$t('formFields.createdBy')
      },
      placeholders: {
        client: this.$t('placeholders.search_for_clients'),
        user: this.$t('placeholders.user'),
        createdAt: this.$t('placeholders.created_at')
      },
      spinner: true,
      modifyMode: true,
      disabled: false,
      searchClient: '',
      src: `${Axios.defaults.baseURL}api/v1/search/clients`,
      queryParamName: 'search',
      limit: 5,
      minChars: 3,
      dateConfig: {
        altInput: true
      }
    }
  },
  computed: {
    ...mapState([
      'Client',
      'originalClient'
    ])
  },
  methods: {
    toggleView (cancel = false) {
      // Check if Client has been selected;
      if (this.Client.client.id === false) {
        return
      }
      if (this.modifyMode) {
        this.modifyMode = false
        // Only way it works removing last element and pushing to the last element
        this.pageTitle.parents.pop()
        this.pageTitle.parents.push(this.$t('base.modify'))
      } else {
        this.pageTitle.parents.pop()
        this.pageTitle.parents.push(this.$t('base.view'))
        this.modifyMode = true
        this.spinner = false
        if (cancel === false) {
          this.$store.dispatch('updateClient', this.Client.client).then(() => {
            this.spinner = true
            this.searchClient = `${this.Client.client.first_name} ${this.Client.client.last_name}`
            this.pageTitle.title = this.searchClient
            this.Client.originalClient = JSON.parse(JSON.stringify(this.Client.client))
            this.showNotification('success', this.$t('success.clientModified'))
          }).catch(err => {
            this.showNotification('error', `${this.$t('errors.clientNotModified')} ${err.response.data.message}`)
          })
        } else {
          this.$store.dispatch('setOriginalClientData')
          this.spinner = true
        }
      }
    },
    updateQuery () {
      this.spinner = true
      this.modifyMode = true
      this.query = this.searchClient
      this.update()
    },
    onHit (item) {
      this.spinner = true
      this.modifyMode = true
      this.searchClient = `${item.first_name} ${item.last_name}`
      this.Client.client = item
      this.Client.originalClient = JSON.parse(JSON.stringify(item))
      this.reset()
      this.pageTitle.parents.push(this.$t('base.view'))
      this.pageTitle.title = this.searchClient
    },
    prepareResponseData (data) {
      return data.data
    },
    resetInput () {
      this.spinner = true
      this.modifyMode = true
      this.searchClient = ''
      this.Client.client = []
      this.reset()
      this.$store.dispatch('cleanClient')
      if (this.pageTitle.parents.length > 1) {
        this.pageTitle.title = this.pageTitle.parents.pop()
      }
    }
  },
  created () {
    this.resetInput()
    if (this.$route.params.id > 0) {
      this.pageTitle.parents.push(this.$t('base.view'))
      this.pageTitle.title = this.$t('base.loading')
      this.$store.dispatch('getClient', this.$route.params.id).then(() => {
        this.searchClient = `${this.Client.client.first_name} ${this.Client.client.last_name}`
        this.pageTitle.title = this.searchClient
      })
    } else {
      return ''
    }
  }
}
</script>
