export default {
  name: 'select-search',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    maxLength: {
      type: Number,
      default: 30
    },
    title: {
      type: String,
      default: ''
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    msgValidation: {
      type: String,
      default: ''
    },
    minCharSearch: {
      type: Number,
      default: 3
    },
    hasValidateItem: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPopup: false,
      searchValue: '',
      filteredItems: []
    }
  },
  computed: {
    style () {
      return {
        'max-height': `${45 * this.maxItems}px`
      }
    }
  },
  methods: {
    normalizeItem (item) {
      item = item.toLowerCase().trim()
      item = item.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return item
    },
    searchItem () {
      const search = this.normalizeItem(this.searchValue)
      return this.items.filter((item) => {
        const includes = this.normalizeItem(item).startsWith(search)
        return includes
      })
    },
    filterItem () {
      if (!this.searchValue || this.searchValue.length < this.minCharSearch) {
        this.filteredItems = []
        return
      }

      this.filteredItems = this.searchItem()
      this.showPopup = this.filteredItems.length
    },
    selectItem (item) {
      this.searchValue = item
      this.showPopup = false
      // eslint-disable-next-line no-console
      console.log('selecionou o item: ' + item)
      this.$emit('selectItem', item)
    },
    validateItem (event) {
      // // eslint-disable-next-line no-console
      // console.log('entrou aqui1: ' + this.hasValidateItem)
      // this.showPopup = false

      // // eslint-disable-next-line no-debugger
      // // debugger
      // if (!this.hasValidateItem || event.relatedTarget.parentElement.className.includes('v-item-group')) {
      //   return
      // }

      // // eslint-disable-next-line no-console
      // console.log('entrou aqui2')
      // // eslint-disable-next-line no-debugger
      // // debugger

      // const search = this.normalizeItem(this.searchValue)
      // const index = this.items.findIndex((item) => {
      //   return search === this.normalizeItem(item)
      // })

      // if (index === -1) {
      //   this.searchValue = ''
      // } else {
      //   this.searchValue = this.items[index]
      // }

      // this.$emit('selectItem', this.searchValue)
    },
    clear () {
      this.searchValue = ''
    }
  }
}
