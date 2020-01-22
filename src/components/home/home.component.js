import WeatherMixin from '@/shared/mixins/weather.mixin'
import GeolocationMixin from '@/shared/mixins/geolocation.mixin'

export default {
  name: 'home',
  mixins: [
    WeatherMixin,
    GeolocationMixin
  ],
  methods: {
    async search () {
      try {
        this.$root.$emit('showLoading')
        const geolocation = await this.getGeolocation('150+Humberto+de+Campos,88036-420')
        const weatherConditions = await this.getWeatherConditions(geolocation.lat, geolocation.lon)

        // eslint-disable-next-line no-console
        console.log('res: ' + JSON.stringify(weatherConditions))
      } finally {
        this.$root.$emit('hideLoading')
      }
    }
  }
}
