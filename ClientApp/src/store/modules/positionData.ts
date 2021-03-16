import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { PositionRecord } from '@/common/positionRecord'

@Module({ namespaced: true })
class PositionData extends VuexModule {
  public positionRecords: PositionRecord[] = []
  public isRecording: boolean | null = null

  @Mutation
  public addPositionRecord(record: PositionRecord) {
    this.positionRecords.push(record)
  }

  @Mutation
  public setPositionRecords(records: PositionRecord[]) {
    this.positionRecords = records
  }

  @Mutation
  public setRecording(newStatus: boolean) {
    this.isRecording = newStatus
  }

  @Action({ rawError: true })
  public updatePositionData(record: PositionRecord) {
    this.context.commit('addPositionRecord', record)
  }

  @Action({ rawError: true })
  public updatePositionRecords(records: PositionRecord[]) {
    this.context.commit('setPositionRecords', records)
  }

  @Action({ rawError: true })
  public updateRecording(newStatus: boolean) {
    this.context.commit('setRecording', newStatus)
  }
}

export default PositionData
