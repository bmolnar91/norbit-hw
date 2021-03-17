import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { Position } from '@/common/position'

@Module({ namespaced: true })
class PositionData extends VuexModule {
  public currentPositions: Position[] = []
  public boatPosition: Position | null = null
  public isRecording: boolean | null = null

  @Mutation
  public ADD_CURRENT_POSITION(position: Position) {
    this.currentPositions.push(position)
  }

  @Mutation
  public SET_CURRENT_POSITIONS(positions: Position[]) {
    this.currentPositions = positions
  }

  @Mutation
  public SET_BOAT_POSITION(position: Position) {
    this.boatPosition = position
  }

  @Mutation
  public SET_RECORDING(status: boolean) {
    this.isRecording = status
  }

  @Action({ rawError: true })
  public addCurrentPosition(position: Position) {
    this.context.commit('ADD_CURRENT_POSITION', position)
  }

  @Action({ rawError: true })
  public setCurrentPositions(positions: Position[]) {
    this.context.commit('SET_CURRENT_POSITIONS', positions)
  }

  @Action({ rawError: true })
  public setBoatPosition(position: Position) {
    this.context.commit('SET_BOAT_POSITION', position)
  }

  @Action({ rawError: true })
  public setRecording(status: boolean) {
    this.context.commit('SET_RECORDING', status)
  }
}

export default PositionData
