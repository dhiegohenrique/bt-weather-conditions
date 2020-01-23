import BaseMixin from './base.mixin'
import { store } from '@/store/store'
import Vue from 'vue'

const mixin = {
  mixins: [
    BaseMixin
  ],
  data () {
    return {
      googleKey: process.env.VUE_APP_GOOGLE_KEY,
      geolocationUrl: 'https://maps.googleapis.com/maps/api/geocode/json?address=%_address_%&key=%_google_key_%'
    }
  },
  methods: {
    getGeolocation (address) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-console
        console.log('entrou aqui1: ' + JSON.stringify(address))
        Object.keys(address).forEach((key) => {
          if (!address[key]) {
            delete address[key]
          }
        })

        // eslint-disable-next-line no-console
        console.log('entrou aqui2: ' + JSON.stringify(address))

        if (store.state.geoLocations.length) {
          const geolocation = getGeolocationByAddress(store.state.geoLocations, address)

          if (geolocation) {
            // eslint-disable-next-line no-console
            console.log('tem geolocation: ' + JSON.stringify(geolocation))
            const { lat, lon } = geolocation
            return resolve({
              lat,
              lon
            })
          }
        }

        const formattedAddress = Object.values(address).join(' ')
        // eslint-disable-next-line no-console
        console.log('formattedAddress: ' + formattedAddress)

        let url = this.geolocationUrl
        url = url.replace('%_address_%', formattedAddress)
        url = url.replace('%_google_key_%', this.googleKey)

        this.requestGet(url)
          .then((res) => {
            res = res.data
            const { results } = res
            if (!results.length) {
              return resolve()
            }

            const { geometry } = results[0]
            const { location: { lat, lng: lon } } = geometry

            const geolocation = {
              address,
              lat,
              lon
            }

            // eslint-disable-next-line no-console
            console.log('não tem geolocation: ' + JSON.stringify(geolocation))

            store.dispatch('addGeolocation', geolocation)
            resolve({
              lat,
              lon
            })
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
}

const getGeolocationByAddress = (geolocations, address) => {
  const geolocation = geolocations.find((geolocation) => {
    const { address: geolocationAddress } = geolocation
    return Vue._.isEqual(geolocationAddress, address)
  })

  return geolocation
}

export default mixin
