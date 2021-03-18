<template>
  <div id="frame">
    <MapContainer />
    <button id="recording-button" @click="handleRecordingButtonClick">
      {{ isRecording ? 'Stop recording' : 'Start recording' }}
    </button>
    <ModalContainer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Socket } from 'vue-socket.io-extended'

import axios from 'axios'

import { Position } from '@/common/position'
import {
  positionMessageParser,
  positionMessagesParser,
  PositionMessage
} from '@/util/jsonParsers'

import MapContainer from '@/components/MapContainer/MapContainer.vue'
import ModalContainer from '@/components/ModalContainer/ModalContainer.vue'

const positionData = namespace('PositionData')

@Component({
  name: 'App',
  components: {
    MapContainer,
    ModalContainer
  }
})
export default class App extends Vue {
  @positionData.State
  public isRecording!: boolean | null

  @positionData.Action
  public addCurrentPosition!: (position: Position) => void

  @positionData.Action
  public setCurrentPositions!: (positions: Position[]) => void

  @positionData.Action
  public setBoatPosition!: (position: Position) => void

  @positionData.Action
  public setRecording!: (status: boolean) => void

  @Socket('position message')
  onPositionMessage(msg: object) {
    const position: Position = positionMessageParser(msg as PositionMessage)

    if (this.isRecording) {
      this.addCurrentPosition(position)
    }
    this.setBoatPosition(position)
  }

  @Socket('recording status update')
  onRecordingStatusMessage(msg: boolean) {
    console.log('new status: ' + msg)

    this.setRecording(msg)
  }

  @Socket('current positions update')
  onRecordedPositionsMessage(msg: PositionMessage[]): void {
    const positions = positionMessagesParser(msg)
    console.log(positions)

    this.setCurrentPositions(positions)
  }

  async handleRecordingButtonClick(): Promise<void> {
    let url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/record`
    url += this.isRecording ? '/stop' : '/start'

    const res = await axios.post(url)

    if (res.status >= 200 && res.status <= 299) {
      console.log('status successfully set to: ' + this.isRecording)
    } else {
      throw new Error('A problem occurred')
    }
  }
}
</script>

<style>
*,
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#frame {
  position: relative;
}
#recording-button {
  position: absolute;
  right: 5rem;
  bottom: 5rem;
}
</style>
