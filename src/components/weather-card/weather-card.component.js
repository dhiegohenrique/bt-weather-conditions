import DateMixin from '@/shared/mixins/date.mixin'
import moment from 'moment'

export default {
  name: 'weather-card',
  mixins: [
    DateMixin
  ],
  props: {
    weatherConditions: {
      type: Object,
      required: true
    },
    showCurrentDateHour: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedWeatherConditions () {
      const formatted = Object.assign({}, this.weatherConditions)
      formatted.date = this.getFormattedDay(formatted.date)
      formatted.sunrise = this.getFormattedHour(formatted.sunrise)
      formatted.sunset = this.getFormattedHour(formatted.sunset)
      return formatted
    },
    currentDateHour () {
      return `<b>Hoje, </b> ${this.getFormattedDateHour(moment().tz('America/Sao_Paulo'))}`
    }
  },
  mounted () {
    const el = document.querySelector('.weather-card')
    if (el) {
      el.scrollIntoView()
    }
  }
}
