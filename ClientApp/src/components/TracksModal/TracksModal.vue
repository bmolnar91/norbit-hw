<template>
  <div class="tracks-modal">
    All tracks:
    <div class="track-list">
      <div
        class="track-item"
        v-for="track in this.$data.tracks"
        :key="track.id"
        @click="log"
      >
        <p>{{ track.end_time }}</p>
        <button @click="deleteTrackTest($event, track.id)">delete</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import axios from 'axios'

const positionData = namespace('PositionData')

@Component({
  name: 'TracksModal'
})
export default class TracksModal extends Vue {
  @positionData.State
  public isRecording!: boolean

  data() {
    return {
      isOpen: false,
      isLoading: false,
      tracks: []
    }
  }

  async getTracksTest(): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/tracks`

    const res = await axios.get(url)

    console.log(res.data.tracks)
    return res.data.tracks
  }

  async getPositionsTest(): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/track/388d4def-820c-4f65-8b8b-02aa640b1015`

    const res = await axios.get(url)

    console.log(res.data.positions)
    return res.data.positions
  }

  deleteTrackTest(e: MouseEvent, trackId: string) {
    e.stopPropagation()
    console.log(trackId + ' deleted!')
    // this.getTracksTest().then(res => {
    //   this.$data.tracks = res
    // })
  }

  log() {
    console.log('clicky')
  }

  mounted() {
    this.getTracksTest().then(res => {
      this.$data.tracks = res
    })
  }
}
</script>

<style>
.tracks-modal {
  position: absolute;
  top: 30px;
  right: 30px;
  max-height: 20rem;

  padding: 1rem;
  border: 1px solid lightgrey;
  border-radius: 6px;
  background: white;
  overflow: auto;
}
.track-list > * {
  margin-top: 1rem;
}
.track-item {
  height: 2rem;
  padding: 0.5rem 1.5rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ghostwhite;
  border-radius: 6px;
  cursor: pointer;
}
.track-item > button {
  margin-left: 2rem;
  height: 1.75rem;
}
</style>
