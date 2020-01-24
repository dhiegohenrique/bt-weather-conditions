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
      weatherConditions: [],
      currentWeather: null,
      imgRain: require('@/assets/rain.png')
    }
  },
  methods: {
    async setGeolocation (geolocation) {
      try {
        this.$root.$emit('showLoading')
        this.weatherConditions = await this.getWeatherConditions(geolocation.lat, geolocation.lon)

        // const el = this.$refs.weatherCondition0
        // eslint-disable-next-line no-debugger
        const el = document.querySelector('.weather-card')
        // eslint-disable-next-line no-debugger
        if (el) {
          el.scrollIntoView()
        }
      } finally {
        this.$root.$emit('hideLoading')
      }
    },
    clear () {
      this.currentWeather = null
      this.weatherConditions = []
    }
  }
}
