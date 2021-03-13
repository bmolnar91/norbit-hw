import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true })
class PositionData extends VuexModule {
  public positionRecords: PositionRecord[] = []

  @Mutation
  public addPositionRecord(record: PositionRecord) {
    this.positionRecords.push(record)
  }

  @Action({ rawError: true })
  public updatePositionData(record: PositionRecord) {
    this.context.commit('addPositionRecord', record)
  }
}

export type PositionRecord = {
  lat: number
  lon: number
  heading: number
}

export default PositionData
