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
                          ref="myVueDropzone" >
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
                    <h6 v-if="importErrors.length > 0">Errors:</h6>
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
  name: 'invoices-import',
  metaInfo: {
    title: 'Invoices - import'
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
            fieldTitle: 'Datum',
            required: this.$t('data.yes'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceDatumDescription')
          },
          {
            fieldTitle: 'Art',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceArtDescription')
          },
          {
            fieldTitle: 'Belegnr.',
            required: this.$t('data.yes'),
            unique: this.$t('data.yes'),
            description: this.$t('data.invoiceBelegnrDescription')
          },
          {
            fieldTitle: 'Status',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceStatusDescription')
          },
          {
            fieldTitle: 'eRechnung',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceRechnungDescription')
          },
          {
            fieldTitle: 'D',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceDDescription')
          },
          {
            fieldTitle: 'V',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceVDescription')
          },
          {
            fieldTitle: 'S',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceSDescription')
          },
          {
            fieldTitle: 'Kd-Nr',
            required: this.$t('data.yes'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceKdnrDescription')
          },
          {
            fieldTitle: 'MatchCode',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceMatchCodeDescription')
          },
          {
            fieldTitle: 'Gesamt',
            required: this.$t('data.yes'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceGesamtDescription')
          },
          {
            fieldTitle: 'Abschlag',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceAbschlagDescription')
          },
          {
            fieldTitle: 'Forderung',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceForderungDescription')
          },
          {
            fieldTitle: 'Zahldatum',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceZahldatumDescription')
          },
          {
            fieldTitle: 'OP-Betrag',
            required: this.$t('data.no'),
            unique: this.$t('data.no'),
            description: this.$t('data.invoiceBetragDescription')
          }
        ]
      },
      pageTitle: {
        parents: [this.$t('invoices.title')],
        title: this.$t('base.importCSV')
      },
      formLabels: {
        drop: this.$t('formFields.drop')
      },
      dropzoneOptions: {
        url: `${process.env.VUE_APP_URL}/api/v1/import/invoices`,
        parallelUploads: 1,
        timeout: 100000,
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
      this.showNotification('error', response.message)
      this.showLog = true
      this.importedCorrectly = response.totalImportedRecords
      this.importErrors = response.error
    },
    uploadSuccess (file, response) {
      this.showNotification('success', response.message)
      this.showLog = true
      this.importErrors = []
      this.importedCorrectly = response.totalImportedRecords
    },
    clearLog () {
      this.showLog = false
      this.importErrors = []
      this.importedCorrectly = 0
    }
  }
}
</script>
