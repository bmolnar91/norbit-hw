import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true })
class PositionData extends VuexModule {
  public positionRecords: PositionRecord[] = []
  public isRecording = false

  @Mutation
  public addPositionRecord(record: PositionRecord) {
    this.positionRecords.push(record)
  }

  @Mutation
  public setRecording(newStatus: boolean) {
    this.isRecording = newStatus
  }

  @Action({ rawError: true })
  public updatePositionData(record: PositionRecord) {
    this.context.commit('addPositionRecord', record)
  }

  @Action
  public updateRecording(newStatus: boolean) {
    this.context.commit('setRecording', newStatus)
  }
}

export type PositionRecord = {
  lat: number
  lon: number
  heading: number
}

export default PositionData
