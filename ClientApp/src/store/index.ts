import { createStore } from 'vuex'

type PositionRecord = {
  lat: number
  lon: number
  heading: number
}

type PositionData = {
  positionData: PositionRecord[]
}

export type State = { positionData: PositionRecord[] }

const state: State = { positionData: [] }

export default createStore({
  state,
  mutations: {
    addPositionRecord(state, payload: PositionRecord) {
      state.positionData.push(payload)
    }
  },
  actions: {
    addPositionRecord({ commit }, payload: PositionData) {
      commit('addPositionRecord', payload)
    }
  },
  getters: {
  },
  modules: {
  }
})
