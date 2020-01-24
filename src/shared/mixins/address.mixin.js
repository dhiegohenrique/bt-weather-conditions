import { store } from '@/store/store'

const mixin = {
  methods: {
    getStreetHistory () {
      return getFilteredByField(store.state.address, 'street')
    },
    getNumberHistory () {
      return getFilteredByField(store.state.address, 'number')
    },
    getNeighborhoodHistory () {
      return getFilteredByField(store.state.address, 'neighborhood')
    },
    getCepHistory () {
      return getFilteredByField(store.state.address, 'cep')
    },
    getCityHistory () {
      return getFilteredByField(store.state.address, 'city')
    }
  }
}

const getFilteredByField = (array, field) => {
  if (!array.length) {
    return []
  }

  const filtered = array.filter((item) => {
    return item[field]
  })

  return filtered.map((address) => {
    return address[field]
  })
}

export default mixin
