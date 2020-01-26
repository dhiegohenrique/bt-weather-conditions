import { mask as maskDirective } from 'vue-the-mask'
import ClickOutside from 'vue-click-outside'

export default {
  name: 'select-search',
  directives: {
    ClickOutside,
    mask: (element, maskOptions) => {
      if (!maskOptions.value) {
        return
      }

      maskDirective(element, maskOptions)
    }
  },
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
    minCharSearch: {
      type: Number,
      default: 3
    },
    hasValidateItem: {
      type: Boolean,
      default: false
    },
    maskPattern: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      showPopup: false,
      searchValue: '',
      filteredItems: [],
      listenerFocusOut: null
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
      this.emit()
      if (!this.searchValue || this.searchValue.length < this.minCharSearch) {
        this.filteredItems = []
        return
      }

      this.filteredItems = this.searchItem()
      this.showPopup = this.filteredItems.length
    },
    selectItem (item) {
      this.searchValue = item
      this.emit()
    },
    emit () {
      if (this.showPopup) {
        this.showPopup = false
      }

      this.$emit('selectItem', this.searchValue)
    },
    clear () {
      this.searchValue = ''
      this.showPopup = false
    },
    clickOutside () {
      if (!this.showPopup) {
        return
      }

      this.showPopup = false
    },
    search () {
      this.showPopup = false
      this.$emit('search')
    },
    closePopup (event) {
      if (event.relatedTarget && !event.relatedTarget.className.includes('v-list-item')) {
        this.showPopup = false
      }

      if (!this.hasValidateItem) {
        return
      }

      const search = this.normalizeItem(this.searchValue)
      const item = this.items.find((item) => {
        return search === this.normalizeItem(item)
      })

      if (item) {
        this.searchValue = item
      } else {
        this.searchValue = ''
      }

      this.emit()
    },
    onClickOutside () {
      this.showPopup = false
    }
  }
}
