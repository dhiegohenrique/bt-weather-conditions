import { mask } from 'vue-the-mask'
import SelectSearch from '@/components/select-search/index'
import StateMixin from '@/shared/mixins/state.mixin'
import GeolocationMixin from '@/shared/mixins/geolocation.mixin'
import AddressMixin from '@/shared/mixins/address.mixin'

export default {
  name: 'address-form',
  directives: {
    mask
  },
  mixins: [
    StateMixin,
    GeolocationMixin,
    AddressMixin
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
      stateAcronyms: [],
      hasGeolocation: true,
      streetHistory: [],
      numberHistory: [],
      neighborhoodHistory: [],
      cepHistory: [],
      cityHistory: []
    }
  },
  mounted () {
    this.stateAcronyms = this.getStateAcronyms()
    this.hasGeolocation = navigator.geolocation !== null
    this.streetHistory = this.getStreetHistory()
    this.numberHistory = this.getNumberHistory()
    this.neighborhoodHistory = this.getNeighborhoodHistory()
    this.cepHistory = this.getCepHistory()
    this.cityHistory = this.getCityHistory()
  },
  methods: {
    selectState (state) {
      this.state = state.toUpperCase()
    },
    searchLocation () {
      this.$root.$emit('showLoading')
      navigator.geolocation.getCurrentPosition((position) => {
        const geolocation = getLocation(position)
        this.$emit('setGeolocation', geolocation)
      })
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

        const geolocation = await this.getGeolocation(address)
        if (!geolocation) {
          this.$root.$emit('showToast', 'Não foi encontrada uma localização com os dados informados.')
        } else {
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

const getLocation = (position) => {
  const { latitude: lat, longitude: lon } = position.coords
  return {
    lat,
    lon
  }
}
