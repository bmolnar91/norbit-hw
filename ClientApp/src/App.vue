<template>
  <div id="frame">
    <MapContainer />
    <button id="recording-button" @click="handleRecordingButtonClick">
      {{ isRecording ? 'Stop recording' : 'Start recording' }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Socket } from 'vue-socket.io-extended'
import axios from 'axios'
import MapContainer from '@/components/MapContainer/MapContainer.vue'

import { namespace } from 'vuex-class'
import { Position } from '@/common/position'
const positionData = namespace('PositionData')

import {
  positionMessageParser,
  positionMessagesParser,
  PositionMessage
} from '@/util/jsonParsers'

@Component({
  name: 'App',
  components: {
    MapContainer
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
    const jsonObject: Position = positionMessageParser(msg as PositionMessage)

    if (this.isRecording) {
      this.addCurrentPosition(jsonObject)
    }
    this.setBoatPosition(jsonObject)
  }

  @Socket('recording status update')
  onRecordingStatusMessage(msg: boolean) {
    console.log('new status: ' + msg)

    this.setRecording(msg)
  }

  @Socket('current positions update')
  onRecordedPositionsMessage(msg: PositionMessage[]): void {
    const jsonObject = positionMessagesParser(msg)
    console.log(jsonObject)

    this.setCurrentPositions(jsonObject)
  }

  async handleRecordingButtonClick(): Promise<void> {
    let url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/record/`
    url += this.isRecording ? 'stop' : 'start'

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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  margin: 0;
  padding: 0;
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
