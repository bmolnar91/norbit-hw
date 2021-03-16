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
import { PositionRecord } from '@/common/positionRecord'
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
  public updatePositionData!: (record: PositionRecord) => void

  @positionData.Action
  public updatePositionRecords!: (records: PositionRecord[]) => void

  @positionData.Action
  public updateRecording!: (newStatus: boolean) => void

  @Socket('position message')
  onPositionMessage(msg: object) {
    const jsonObject = positionMessageParser(msg as PositionMessage)
    this.updatePositionData(jsonObject as PositionRecord)
    // this.$socket.client.emit('testMessage')
  }

  @Socket('recordingStatusMessage')
  onRecordingStatusMessage(msg: boolean) {
    console.log(msg)

    this.updateRecording(msg)
  }

  @Socket('recordedPositionsMessage')
  onRecordedPositionsMessage(msg: PositionMessage[]): void {
    const jsonObject = positionMessagesParser(msg)
    console.log(jsonObject)

    this.updatePositionRecords(jsonObject)
  }

  async handleRecordingButtonClick(e: MouseEvent): Promise<void> {
    console.log(e.target)

    if (this.isRecording) {
      const res = await axios.post(
        `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/record/stop`
      )

      if (res.status >= 200 && res.status <= 299) {
        this.updateRecording(false)
        console.log('recording status updated to: FALSE')
      } else {
        throw new Error('A problem occurred')
      }
    } else {
      const res = await axios.post(
        `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/record/start`
      )

      if (res.status >= 200 && res.status <= 299) {
        this.updateRecording(true)
        console.log('recording status updated to: TRUE')
      } else {
        throw new Error('A problem occurred')
      }
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
