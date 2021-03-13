import Vue from 'vue'
import Vuex from 'vuex'
import PositionData from '@/store/modules/positionData'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    PositionData
  }
})

export default store
