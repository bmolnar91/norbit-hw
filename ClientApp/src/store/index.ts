import { createStore } from 'vuex'

type PositionData = {
  lat: number
  lon: number
  heading: number
}

export type State = { positionData: PositionData }

const state: State = { positionData: { lat: 0, lon: 0, heading: 0 } }

export default createStore({
  state,
  mutations: {
    setPositionData(state, payload: PositionData) {
      state.positionData.lat = payload.lat
      state.positionData.lon = payload.lon
      state.positionData.heading = payload.heading
    }
  },
  actions: {
    setPositionData({ commit }, payload: PositionData) {
      commit('setPositionData', payload)
    }
  },
  getters: {
  },
  modules: {
  }
})
