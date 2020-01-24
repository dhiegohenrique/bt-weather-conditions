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
        Object.keys(address).forEach((key) => {
          if (!address[key]) {
            delete address[key]
          }
        })

        if (store.state.geoLocations.length) {
          const geolocation = getGeolocationByAddress(store.state.geoLocations, address)

          if (geolocation) {
            const { lat, lon } = geolocation
            return resolve({
              lat,
              lon
            })
          }
        }

        const formattedAddress = Object.values(address).join(' ')

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

            store.dispatch('addGeolocation', geolocation)
            store.dispatch('addAddress', address)
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
