import WeatherMixin from '@/shared/mixins/weather.mixin'
import GeolocationMixin from '@/shared/mixins/geolocation.mixin'
import WeatherCard from '@/components/weather-card/index'

export default {
  name: 'home',
  mixins: [
    WeatherMixin,
    GeolocationMixin
  ],
  components: {
    WeatherCard
  },
  data () {
    return {
      weatherConditions: null
    }
  },
  methods: {
    async search () {
      try {
        this.$root.$emit('showLoading')
        const geolocation = await this.getGeolocation('150+Humberto+de+Campos,88036-420')
        this.weatherConditions = await this.getWeatherConditions(geolocation.lat, geolocation.lon)

        // eslint-disable-next-line no-console
        console.log('res: ' + JSON.stringify(this.weatherConditions))
      } finally {
        this.$root.$emit('hideLoading')
      }
    }
  }
}
