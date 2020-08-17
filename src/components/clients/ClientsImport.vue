<template>
    <div>
        <page-title :pageTitle="pageTitle"></page-title>
        <b-card header="Datei-Upload" header-tag="h6" class="mb-4">
            <vue-dropzone id="dropzone"
                          :options="dropzoneOptions"
                          v-on:vdropzone-error="uploadError"
                          v-on:vdropzone-success="uploadSuccess"
                          v-on:vdropzone-file-added="clearLog"
                          v-on:vdropzone-removed-file="clearLog"
                          ref="myVueDropzone">
                <div class="dropzone-custom-content">
                    <h3 class="dropzone-custom-title">{{ formLabels.drop }}</h3>
                </div>
            </vue-dropzone>
        </b-card>
        <b-card-group deck>
            <b-card header="Info" header-tag="h6">
                <b-card-text>{{ $t('data.clientInfoDescription') }}</b-card-text>
                <b-table striped bordered :fixed="false" small :items="fileInfo.items" :fields="fileInfo.fields" head-variant="light"></b-table>
            </b-card>

            <b-card header="Log" header-tag="h6">
                <span v-if="showLog">
                    <b-list-group class="mb-4">
                        <b-list-group-item variant="success" class="d-flex justify-content-between align-items-center">
                            Import Correctly:
                            <b-badge pill variant="success">{{ importedCorrectly }}</b-badge>
                        </b-list-group-item>
                        <b-list-group-item variant="danger" class="d-flex justify-content-between align-items-center">
                            Errors:
                            <b-badge pill variant="danger">{{ importErrors.length }}</b-badge>
                        </b-list-group-item>
                    </b-list-group>
                    <h6 v-if="importErrors.length > 0">Errors</h6>
                    <b-list-group>
                        <b-list-group-item variant="danger" v-for="(error, key) in importErrors" :key="key">{{ error[0] }}</b-list-group-item>
                    </b-list-group>
                </span>
            </b-card>
        </b-card-group>
    </div>
</template>

<style src="@/vendor/libs/vue-dropzone/vue-dropzone.scss" lang="scss"></style>

<script>
import vue2Dropzone from 'vue2-dropzone'
import { mapGetters } from 'vuex'

export default {
  name: 'clients-import',
  metaInfo: {
    title: 'Clients - import'
  },
  computed: {
    ...mapGetters(['getToken'])
  },
  mounted () {
    this.$refs.myVueDropzone.setOption('headers', { Authorization: `Bearer ${this.getToken}` })
  },
  data () {
    return {
      fileInfo: {
        fields: [
          {
            key: 'fieldTitle',
            label: this.$t('tableFields.fieldTitle')
          },
          {
            key: 'required',
            label: this.$t('tableFields.requiredTitle')
          },
          {
            key: 'unique',
            label: this.$t('tableFields.uniqueTitle')
          },
          {
            key: 'description',
            label: this.$t('tableFields.descriptionTitle')
          }
        ],
        items: [
          {
            fieldTitle: 'Kd-/Lf.Nr.',
            required: this.$t('data.yes'),
            unique: this.$t('data.yes'),
            description: this.$t('data.clientNrDescription')
          },
          {
            fieldTitle: 'Matchcode',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientMCodeDescription')
          },
          {
            fieldTitle: 'Firma',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientCompDescription')
          },
          {
            fieldTitle: 'Name',
            required: this.$t('data.yes'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientLastNameDescription')
          },
          {
            fieldTitle: 'Vorname',
            required: this.$t('data.yes'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientFirstNameDescription')
          },
          {
            fieldTitle: 'Straße',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientStreetDescription')
          },
          {
            fieldTitle: 'Plz, Ort',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientPCCityDescription')
          },
          {
            fieldTitle: 'Bemerkung',
            required: this.$t('data.yes'),
            unique: this.$t('data.yes'),
            description: this.$t('data.clientCommentDescription')
          },
          {
            fieldTitle: 'Tel.',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientTelDescription')
          },
          {
            fieldTitle: 'E-Mail',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientEMailDescription')
          },
          {
            fieldTitle: 'Freifeld1\n',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.clientFreeFieldDescription')
          }
        ]
      },
      pageTitle: {
        parents: [this.$t('clients.title')],
        title: this.$t('base.importCSV')
      },
      formLabels: {
        drop: this.$t('formFields.drop')
      },
      dropzoneOptions: {
        url: `${process.env.VUE_APP_URL}/api/v1/import/clients`,
        parallelUploads: 1,
        maxFilesize: 50000,
        filesizeBase: 1000,
        addRemoveLinks: true,
        acceptedFiles: '.csv,.xls,.xlsx',
        dictDefaultMessage: this.$t('data.dropZoneMessage'),
        dictRemoveFile: this.$t('formFields.removeFileButton'),
        dictCancelUpload: this.$t('formFields.cancelUploadButton'),
        previewTemplate: `
<div class="dz-preview dz-file-preview">
  <div class="dz-details">
    <div class="dz-thumbnail">
      <img data-dz-thumbnail alt="" />
      <span class="dz-nopreview">${this.$t('data.noPreview')}</span>
      <div class="dz-success-mark"></div>
      <div class="dz-error-mark"></div>
      <div class="dz-error-message"><span data-dz-errormessage></span></div>
      <div class="progress"><div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div></div>
    </div>
    <div class="dz-filename" data-dz-name></div>
    <div class="dz-size" data-dz-size></div>
  </div>
</div>`
      },
      showLog: false,
      importedCorrectly: 0,
      importErrors: []
    }
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  methods: {
    uploadError (file, response) {
      const elements = document.querySelectorAll('.dz-error-message span')
      const lastElement = elements[elements.length - 1]
      lastElement.textContent = null
      this.showLog = true
      this.importedCorrectly = response.totalImportedRecords
      this.importErrors = response.error
      this.showNotification('error', response.message)
    },
    uploadSuccess (file, response) {
      this.showLog = true
      this.importErrors = []
      this.importedCorrectly = response.totalImportedRecords
      this.showNotification('success', response.message)
    },
    clearLog () {
      this.showLog = false
      this.importErrors = []
      this.importedCorrectly = 0
    }
  }
}
</script>
