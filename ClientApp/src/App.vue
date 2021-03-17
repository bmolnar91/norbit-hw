<template>
  <div id="frame">
    <MapContainer />
    <button id="recording-button" @click="handleRecordingButtonClick">
      {{ isRecording ? 'Stop recording' : 'Start recording' }}
    </button>
    <button id="getTracksTest" @click="getTracksTest">Get Tracks</button>
    <button id="getPositionsTest" @click="getPositionsTest">
      Get Positions
    </button>
    <TracksModal />
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
import TracksModal from '@/components/TracksModal/TracksModal.vue'

const positionData = namespace('PositionData')

@Component({
  name: 'App',
  components: {
    MapContainer,
    TracksModal
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

  async getTracksTest(): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/tracks`

    const res = await axios.get(url)

    console.log(res.data.tracks)
  }

  async getPositionsTest(): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/track/388d4def-820c-4f65-8b8b-02aa640b1015`

    const res = await axios.get(url)

    console.log(res.data.positions)
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
#getTracksTest {
  position: absolute;
  right: 5rem;
  bottom: 10rem;
}
#getPositionsTest {
  position: absolute;
  right: 5rem;
  bottom: 15rem;
}
</style>
