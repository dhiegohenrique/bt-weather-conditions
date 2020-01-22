import BaseMixin from './base.mixin'

const mixin = {
  mixins: [
    BaseMixin
  ],
  data () {
    return {
      openWeatherKey: process.env.VUE_APP_OPEN_WEATHER_KEY,
      openWeatherUrl: 'http://api.openweathermap.org/data/2.5/weather?lat=%_lat_%&lon=%_lon_%&APPID=%_open_weather_key_%&units=metric&lang=pt'
    }
  },
  methods: {
    getWeather (lat, lon) {
      let url = this.openWeatherUrl
      url = url.replace('%_lat_%', lat)
      url = url.replace('%_lon_%', lon)
      url = url.replace('%_open_weather_key_%', this.openWeatherKey)
      return this.requestGet(url)
    }
  }
}

export default mixin
