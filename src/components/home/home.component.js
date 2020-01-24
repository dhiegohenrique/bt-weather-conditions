import WeatherMixin from '@/shared/mixins/weather.mixin'
import GeolocationMixin from '@/shared/mixins/geolocation.mixin'
import WeatherCard from '@/components/weather-card/index'
import AddressForm from '@/components/address-form/index'
import VueScrollTo from 'vue-scrollto'

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
      weatherConditions: [],
      currentWeather: null,
      imgRain: require('@/assets/rain.png')
    }
  },
  methods: {
    async setGeolocation (geolocation) {
      this.weatherConditions = await this.getWeatherConditions(geolocation.lat, geolocation.lon)

      const rowWeather = this.$refs['row-weather']
      VueScrollTo.scrollTo(rowWeather)
      this.$root.$emit('hideLoading')
    },
    clear () {
      this.currentWeather = null
      this.weatherConditions = []
    }
  }
}
