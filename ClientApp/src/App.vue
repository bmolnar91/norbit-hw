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
import { positionMessageParser } from '@/util/jsonParsers'

import { namespace } from 'vuex-class'
import { PositionRecord } from '@/store/modules/positionData'
const positionData = namespace('PositionData')

@Component({
  name: 'App',
  components: {
    MapContainer
  }
})
export default class App extends Vue {
  @positionData.State
  public isRecording!: boolean

  @positionData.Action
  public updatePositionData!: (record: PositionRecord) => void

  @positionData.Action
  public updateRecording!: (newStatus: boolean) => void

  @Socket('position message')
  onPositionMessage(msg: string) {
    const jsonObject = positionMessageParser(msg)
    this.updatePositionData(jsonObject as PositionRecord)
    this.$socket.client.emit('testMessage')
  }

  async handleRecordingButtonClick(): Promise<void> {
    if (this.isRecording) {
      const res = await axios.post('http://localhost:5678/record/stop')

      if (res.status >= 200 && res.status <= 299) {
        this.updateRecording(false)
        console.log('recording status updated to: false')
      } else {
        throw new Error('A problem occurred')
      }
    } else {
      const res = await axios.post('http://localhost:5678/record/start')

      if (res.status >= 200 && res.status <= 299) {
        this.updateRecording(true)
        console.log('recording status updated to: true')
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
