import BaseMixin from './base.mixin'
import { store } from '@/store/store'
import moment from 'moment-timezone'
import Vue from 'vue'

const mixin = {
  mixins: [
    BaseMixin
  ],
  data () {
    return {
      openWeatherKey: process.env.VUE_APP_OPEN_WEATHER_KEY,
      openWeatherUrl: 'http://api.openweathermap.org/data/2.5/forecast?lat=%_lat_%&lon=%_lon_%&APPID=%_open_weather_key_%&units=metric&lang=pt'
    }
  },
  methods: {
    getWeatherConditions (lat, lon) {
      return new Promise((resolve, reject) => {
        let weatherConditions
        if (store.state.weatherConditions.length) {
          weatherConditions = getWeatherByGeolocation(store.state.weatherConditions, lat, lon)
          if (weatherConditions) {
            return resolve(Vue._.cloneDeep(weatherConditions))
          }
        }

        let url = this.openWeatherUrl
        url = url.replace('%_lat_%', lat)
        url = url.replace('%_lon_%', lon)
        url = url.replace('%_open_weather_key_%', this.openWeatherKey)
        this.requestGet(url)
          .then((res) => {
            weatherConditions = res.data

            let { list: items } = weatherConditions
            items = getWeatherByDays(items)

            const { city: { name, sunrise, sunset } } = weatherConditions

            weatherConditions = items.map((item) => {
              const { dt, main: { temp, temp_min: tempMin, temp_max: tempMax, pressure, humidity }, wind: { speed: wind } } = item
              const weather = item.weather[0]
              const { description, icon } = weather

              item = {
                name,
                sunrise,
                sunset,
                date: moment.unix(dt),
                search: {
                  lat,
                  lon
                },
                expirationDate: moment.unix(dt).endOf('hour'),
                temp,
                tempMin,
                tempMax,
                pressure,
                humidity,
                wind,
                description,
                icon: require(`@/assets/icons/${icon}@2x.png`)
              }
              return item
            })

            const item = {
              search: {
                lat,
                lon
              },
              items: weatherConditions
            }

            store.dispatch('addWeatherConditions', item)
            resolve(weatherConditions)
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
  const firstItem = weatherCondition.items[0]
  const currentDate = moment.unix(moment().unix())

  const expirationDate = firstItem.expirationDate
  if (currentDate.isAfter(expirationDate)) {
    store.dispatch('removeWeatherConditions', index)
    return null
  }

  return weatherCondition.items
}

const getWeatherByDays = (items) => {
  const dates = []
  const weatherByDays = []
  const maxDays = 6

  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const { dt } = item
    const date = moment.unix(dt).startOf('day').unix()

    if (!dates.includes(date)) {
      dates.push(date)
    }

    if (dates.length === maxDays) {
      break
    }
  }

  dates.forEach((date) => {
    const item = items.find((item) => {
      const { dt } = item
      return moment.unix(dt).isSameOrAfter(moment.unix(date))
    })

    weatherByDays.push(item)
  })

  return weatherByDays
}

export default mixin
