import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
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
