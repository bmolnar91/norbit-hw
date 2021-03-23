<template>
  <v-app>
    <v-main>
      <map-container />
      <v-btn
        :disabled="this.$data.isRecordingButtonDisabled"
        icon
        color="rgb(220,20,60)"
        x-large
        outlined
        elevation="2"
        style="position:absolute;bottom:5rem;right:5rem;"
        @click="handleRecordingButtonClick"
      >
        <v-icon>
          {{ isRecording ? 'mdi-stop' : 'mdi-record' }}
        </v-icon>
      </v-btn>
      <v-btn
        icon
        tile
        v-if="!this.$data.isModalOpen"
        elevation="2"
        style="position:absolute;top:5rem;right:5rem;"
        @click="handleModalButtonClick"
      >
        <v-icon>mdi-view-module</v-icon>
      </v-btn>
      <modal
        @closeModal="closeModal"
        v-if="isRecording !== null && this.$data.isModalOpen"
      />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
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
import Modal from '@/components/Modal/Modal.vue'

const positionData = namespace('PositionData')

@Component({
  name: 'app',
  components: {
    MapContainer,
    Modal
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

  data() {
    return {
      isModalOpen: false,
      isRecordingButtonDisabled: true
    }
  }

  closeModal() {
    this.$data.isModalOpen = false
  }

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
    this.setRecording(msg)
  }

  @Socket('current positions update')
  onRecordedPositionsMessage(msg: PositionMessage[]): void {
    const positions = positionMessagesParser(msg)
    this.setCurrentPositions(positions)
  }

  async handleRecordingButtonClick(): Promise<void> {
    let url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/record`
    url += this.isRecording ? '/stop' : '/start'

    try {
      await axios.post(url)
    } catch (err) {
      console.log(err)
    }

    // if (res.status >= 200 && res.status <= 299) {
    //   console.log('recording status successfully set to: ' + this.isRecording)
    // } else {
    //   throw new Error('A problem occurred')
    // }
  }

  handleModalButtonClick(): void {
    this.$data.isModalOpen = true
  }

  @Watch('isRecording')
  onRecordingChanged() {
    this.$data.isRecordingButtonDisabled = true
    new Promise(resolve => setTimeout(resolve, 500)).then(
      () => (this.$data.isRecordingButtonDisabled = false)
    )
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
</style>
