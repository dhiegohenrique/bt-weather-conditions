import { mask } from 'vue-the-mask'
import SelectSearch from '@/components/select-search/index'
import StateMixin from '@/shared/mixins/state.mixin'
import GeolocationMixin from '@/shared/mixins/geolocation.mixin'

export default {
  name: 'address-form',
  directives: {
    mask
  },
  mixins: [
    StateMixin,
    GeolocationMixin
  ],
  components: {
    SelectSearch
  },
  data () {
    return {
      street: '',
      number: '',
      neighborhood: '',
      cep: '',
      city: '',
      state: '',
      stateAcronyms: []
    }
  },
  mounted () {
    this.stateAcronyms = this.getStateAcronyms()
  },
  methods: {
    selectState (state) {
      this.state = state.toUpperCase()
    },
    getLocation () {
      // eslint-disable-next-line no-console
      console.log('obter localização')
    },
    async search () {
      try {
        this.$root.$emit('showLoading')

        const address = {
          street: this.street,
          number: this.number,
          neighborhood: this.neighborhood,
          cep: this.cep,
          city: this.city,
          state: this.state
        }

        // eslint-disable-next-line no-console
        console.log('buscar: ' + JSON.stringify(address))

        const geolocation = await this.getGeolocation(address)
        if (!geolocation) {
          this.$root.$emit('showToast', 'Não foi encontrada uma localização com os dados informados.')
        } else {
          // eslint-disable-next-line no-console
          console.log('geolocation: ' + JSON.stringify(geolocation))
          this.$emit('setGeolocation', geolocation)
        }
      } finally {
        this.$root.$emit('hideLoading')
      }
    },
    clear () {
      this.street = ''
      this.number = ''
      this.neighborhood = ''
      this.cep = ''
      this.city = ''
      this.state = ''
      this.$refs['select-state'].clear()
      this.$emit('clear')
    }
  }
}
