<template>
  <MapContainer />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Socket } from 'vue-socket.io-extended'
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
    this.updateRecording(true)
    this.$socket.client.emit('testMessage')
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
</style>
