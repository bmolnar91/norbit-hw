import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export type PositionRecord = {
  lat: number
  lon: number
  heading: number
}

export type PositionData = {
  positionData: PositionRecord[]
}

export type State = { positionData: PositionRecord[] }

const state: State = { positionData: [] }

export default new Vuex.Store({
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
