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
        const res = await this.getWeatherConditions(geolocation.lat, geolocation.lon)
        this.weatherConditions = this._.cloneDeep(res)
        this.currentWeather = this.weatherConditions[0]
        this.weatherConditions.splice(0, 1)

        const weatherCards = this.$el.getElementsByClassName('weather-card')
        if (weatherCards && weatherCards.length) {
          weatherCards[0].scrollIntoView()
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
