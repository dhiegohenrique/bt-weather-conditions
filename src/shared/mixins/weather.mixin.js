import BaseMixin from './base.mixin'
import { store } from '@/store/store'
import moment from 'moment-timezone'

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
        }

        if (weatherCondition) {
          // eslint-disable-next-line no-console
          console.log('tem: ' + JSON.stringify(weatherCondition))
          return resolve(weatherCondition)
        }

        let url = this.openWeatherUrl
        url = url.replace('%_lat_%', lat)
        url = url.replace('%_lon_%', lon)
        url = url.replace('%_open_weather_key_%', this.openWeatherKey)
        this.requestGet(url)
          .then((res) => {
            weatherCondition = res.data
            // eslint-disable-next-line no-console
            console.log('recebeu: ' + JSON.stringify(weatherCondition))
            const weather = weatherCondition.weather[0]

            weather.icon = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`
            weatherCondition.weather[0] = weather

            // eslint-disable-next-line no-console
            weatherCondition.expirationDate = moment.unix(weatherCondition.dt).endOf('hour')
            weatherCondition.searchDate = moment().tz('America/Sao_Paulo')
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
  const index = weatherConditions.findIndex((weatherCondition) => {
    const { search } = weatherCondition
    return search.lat === lat && search.lon === lon
  })

  if (index === -1) {
    return null
  }

  const weatherCondition = weatherConditions[index]
  const currentDate = moment.unix(moment().unix())

  if (currentDate.isAfter(weatherCondition.expirationDate)) {
    store.dispatch('removeWeatherConditions', index)
    return null
  }

  return weatherCondition
}

export default mixin
