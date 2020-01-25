import WeatherMixin from '@/shared/mixins/weather.mixin'
import GeolocationMixin from '@/shared/mixins/geolocation.mixin'
import WeatherCard from '@/components/weather-card/index'
import AddressForm from '@/components/address-form/index'
import Logo from '@/components/logo/index'
import VueScrollTo from 'vue-scrollto'

export default {
  name: 'home',
  mixins: [
    WeatherMixin,
    GeolocationMixin
  ],
  components: {
    WeatherCard,
    AddressForm,
    Logo
  },
  data () {
    return {
      weatherConditions: []
    }
  },
  methods: {
    async setGeolocation (geolocation) {
      this.weatherConditions = await this.getWeatherConditions(geolocation.lat, geolocation.lon)

      const options = {
        cancelable: false,
        onDone: () => {
          this.$root.$emit('hideLoading')
        }
      }

      const rowWeather = this.$refs['row-weather']
      VueScrollTo.scrollTo(rowWeather, 500, options)
    },
    clear () {
      this.weatherConditions = []
    }
  }
}
