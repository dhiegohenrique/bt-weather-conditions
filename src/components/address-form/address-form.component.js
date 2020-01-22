import { mask } from 'vue-the-mask'

export default {
  name: 'address',
  directives: {
    mask
  },
  data () {
    return {
      street: 'Humberto de Campos',
      number: '150',
      neighborhood: 'Trindade',
      cep: '88036420',
      city: 'Florianopolis',
      state: 'SC'
    }
  }
}
