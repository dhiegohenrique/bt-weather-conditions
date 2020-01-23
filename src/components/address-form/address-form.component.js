import { mask } from 'vue-the-mask'
import SelectSearch from '@/components/select-search/index'
import StateMixin from '@/shared/mixins/state.mixin'

export default {
  name: 'address',
  directives: {
    mask
  },
  mixins: [
    StateMixin
  ],
  components: {
    SelectSearch
  },
  data () {
    return {
      street: 'Humberto de Campos',
      number: '150',
      neighborhood: 'Trindade',
      cep: '88036420',
      city: 'Florianopolis',
      state: 'SC',
      stateAcronyms: []
    }
  },
  mounted () {
    this.stateAcronyms = this.getStateAcronyms()
  },
  methods: {
    selectState (state) {
      this.state = state.toUpperCase()
    }
  }
}
