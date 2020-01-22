import BaseMixin from './base.mixin'
import { store } from '@/store/store'

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
    getWeatherConditions (lat, lon) {
      return new Promise((resolve, reject) => {
        let weatherCondition
        if (store.state.weatherConditions.length) {
          weatherCondition = getWeatherByGeolocation(store.state.weatherConditions, lat, lon)
          // eslint-disable-next-line no-console
          console.log('tem: ' + JSON.stringify(weatherCondition))
        }

        if (weatherCondition) {
          return resolve(weatherCondition)
        }

        let url = this.openWeatherUrl
        url = url.replace('%_lat_%', lat)
        url = url.replace('%_lon_%', lon)
        url = url.replace('%_open_weather_key_%', this.openWeatherKey)
        this.requestGet(url)
          .then((res) => {
            weatherCondition = res.data
            weatherCondition.search = {
              lat,
              lon
            }

            // eslint-disable-next-line no-console
            console.log('não tem, vai salvar: ' + JSON.stringify(weatherCondition))
            store.dispatch('addWeatherConditions', weatherCondition)
            resolve(weatherCondition)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
}

const getWeatherByGeolocation = (weatherConditions, lat, lon) => {
  return weatherConditions.find((weatherCondition) => {
    const { search } = weatherCondition
    return search.lat === lat && search.lon === lon
  })
}

export default mixin
