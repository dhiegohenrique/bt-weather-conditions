import { store } from '@/store/store'

const mixin = {
  methods: {
    getStreetHistory () {
      return getFilteredByField('street')
    },
    getNumberHistory () {
      return getFilteredByField('number')
    },
    getNeighborhoodHistory () {
      return getFilteredByField('neighborhood')
    },
    getCepHistory () {
      return getFilteredByField('cep')
    },
    getCityHistory () {
      return getFilteredByField('city')
    }
  }
}

const getFilteredByField = (field) => {
  const array = store.state.address
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
