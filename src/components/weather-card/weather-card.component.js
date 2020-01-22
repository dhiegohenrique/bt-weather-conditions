import DateMixin from '@/shared/mixins/date.mixin'

export default {
  name: 'weather-card',
  mixins: [
    DateMixin
  ],
  props: {
    weatherConditions: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedWeatherConditions () {
      const formatted = Object.assign({}, this.weatherConditions)
      formatted.searchDate = this.getFormattedDateHour(formatted.searchDate)
      formatted.sys.sunrise = this.getFormattedHour(formatted.sys.sunrise)
      formatted.sys.sunset = this.getFormattedHour(formatted.sys.sunset)
      return formatted
    }
  },
  methods: {
  }
}
