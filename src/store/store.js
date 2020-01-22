import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'bt-weather-conditions',
  storage: window.localStorage
})

export const store = new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    geoLocations: [],
    weatherConditions: []
  },
  mutations: {
    addGeolocation (state, geoLocation) {
      state.geoLocations.push(geoLocation)
    },
    addWeatherConditions (state, weatherConditions) {
      state.weatherConditions.push(weatherConditions)
    },
    removeWeatherConditions (state, index) {
      state.weatherConditions.splice(index, 1)
    }
  },
  actions: {
    addGeolocation: (context, geolocation) => {
      context.commit('addGeolocation', geolocation)
    },
    addWeatherConditions: (context, weatherConditions) => {
      context.commit('addWeatherConditions', weatherConditions)
    },
    removeWeatherConditions: (context, index) => {
      context.commit('removeWeatherConditions', index)
    }
  }
})
