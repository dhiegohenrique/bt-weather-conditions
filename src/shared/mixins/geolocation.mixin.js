import BaseMixin from './base.mixin'

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
        const filteredKeys = Object.keys(address).filter((key) => {
          return address[key]
        })

        let formattedAddress = ''
        filteredKeys.forEach((key) => {
          formattedAddress += ` ${address[key]}`
        })

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

export default mixin
