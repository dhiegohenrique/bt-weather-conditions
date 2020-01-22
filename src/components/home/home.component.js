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
        // eslint-disable-next-line no-console
        console.log('maria: ' + JSON.stringify(geolocation))
        const res = await this.getWeather('-27.589344', '-48.520679')

        // eslint-disable-next-line no-console
        console.log('res: ' + JSON.stringify(res.data))
      } finally {
        this.$root.$emit('hideLoading')
      }
    }
  }
}
