<template>
    <div>
        <page-title :pageTitle="pageTitle"></page-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit, reset }">
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
            <clients-form :client-info="Client"></clients-form>
            </form>
        </ValidationObserver>
    </div>
</template>

<style src="@/vendor/styles/pages/authentication.scss" lang="scss"></style>

<script>
import { mapState } from 'vuex'
import ClientsForm from './ClientsForm'

export default {
  name: 'clients-create',
  metaInfo: {
    title: 'Clients-Create'
  },
  components: {
    ClientsForm
  },
  data () {
    return {
      pageTitle: {
        parents: ['Clients'],
        title: 'Create'
      },
      spinner: true
    }
  },
  computed: {
    ...mapState(['Client'])
  },
  methods: {
    submit () {
      this.spinner = false
      this.$store.dispatch('createClient', this.Client.client)
        .then(() => {
          this.showNotification('success', 'The client was successfully created')
          this.$refs.form.reset()
        })
        .catch((error) => {
          this.showNotification('error', `The system could not create the client: ${error.response.data.message}`)
        })
      this.spinner = true
    }
  },
  created: function () {
    return this.$store.dispatch('cleanClient')
  }
}
</script>
