
export default {
  name: 'login',
  metaInfo () {
    return {
      title: this.$t('login.title')
    }
  },
  components: {},
  props: [],
  data () {
    return {
      credentials: {
        email: '',
        password: ''
      },
      disableSubmit: false,
      loginFailed: false
    }
  },
  computed: {
  },
  mounted () {

  },
  created () {
  },
  methods: {
    login () {
      this.loginFailed = false
      this.disableSubmit = true
      this.$store.dispatch('login', { data: this.credentials }).then(() => {
        let pushName = this.$route.params.nextName ? this.$route.params.nextName : 'home'
        this.$router.push({ name: pushName })
      }).catch(error => {
        this.showNotification('error', error)
        this.loginFailed = true
        this.disableSubmit = false
      })
    }
  }
}
