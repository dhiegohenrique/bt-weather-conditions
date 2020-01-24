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
    }
  },
  data () {
    return {
      fields: [
        {
          key: 'tempMin',
          label: 'Temperatura mínima',
          value: '',
          suffix: '&deg;C'
        },
        {
          key: 'tempMax',
          label: 'Temperatura máxima',
          value: '',
          suffix: '&deg;C'
        },
        {
          key: 'wind',
          label: 'Vento',
          value: '',
          suffix: 'm/s'
        },
        {
          key: 'pressure',
          label: 'Pressão',
          value: '',
          suffix: 'hPa'
        },
        {
          key: 'humidity',
          label: 'Humidade',
          value: '',
          suffix: '%'
        },
        {
          key: 'sunrise',
          label: 'Nascer do sol',
          value: '',
          suffix: 'h'
        },
        {
          key: 'sunset',
          label: 'Pôr do sol',
          value: '',
          suffix: 'h'
        }
      ],
      currentDate: moment().tz('America/Sao_Paulo')
    }
  },
  computed: {
    currentDateHour () {
      return `<b>Hoje, </b> ${this.getFormattedDateHour(this.currentDate)}`
    },
    isCurrentDate () {
      return this.weatherConditions.date === this.getFormattedDay(this.currentDate)
    },
    formattedWeatherConditions () {
      const formatted = this._.clone(this.weatherConditions)
      formatted.date = this.getFormattedDay(this.weatherConditions.date)
      if (this.getFormattedDate(this.weatherConditions.date) === this.getFormattedDate(this.currentDate)) {
        formatted.date = `<b>Hoje, </b> ${this.getFormattedDateHour(this.currentDate)}`
      }

      formatted.sunrise = this.getFormattedHour(this.weatherConditions.sunrise)
      formatted.sunset = this.getFormattedHour(this.weatherConditions.sunset)

      this.fields.forEach((field) => {
        field.value = `${formatted[field.key]}${field.suffix}`
      })

      return formatted
    }
  }
}
