import WeatherMixin from '@/shared/mixins/weather.mixin'
import GeolocationMixin from '@/shared/mixins/geolocation.mixin'
import WeatherCard from '@/components/weather-card/index'
import AddressForm from '@/components/address-form/index'

export default {
  name: 'home',
  mixins: [
    WeatherMixin,
    GeolocationMixin
  ],
  components: {
    WeatherCard,
    AddressForm
  },
  data () {
    return {
      weatherConditions: null,
      currentWeather: null
    }
  },
  methods: {
    async search () {
      try {
        this.$root.$emit('showLoading')

        const address = {
          street: 'Humberto de Campos',
          number: '150',
          neighborhood: 'Trindade',
          cep: '88036420',
          city: 'Florianopolis',
          state: 'SC'
        }

        const geolocation = await this.getGeolocation(address)
        this.weatherConditions = await this.getWeatherConditions(geolocation.lat, geolocation.lon)
        this.currentWeather = this.weatherConditions[0]
        this.weatherConditions.splice(0, 1)
      } finally {
        this.$root.$emit('hideLoading')
      }
    }
  }
}
