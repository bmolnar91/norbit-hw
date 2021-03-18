<template>
  <div class="tracks-modal" v-if="!this.$data.isLoading">
    Recorded tracks:
    <div class="track-list">
      <div
        class="track-item"
        v-for="track in this.$data.tracks"
        :key="track.id"
        @click="selectedTrackId = track.id"
      >
        <p>{{ track.end_time }}</p>
        <button @click="deleteTrackTest($event, track.id)">delete</button>
      </div>
    </div>
    <TrackDetailsModal
      v-if="this.$data.selectedTrackId"
      :track-id="this.$data.selectedTrackId"
      :key="this.$data.selectedTrackId"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import axios from 'axios'

import TrackDetailsModal from '@/components/TrackDetailsModal/TrackDetailsModal.vue'

const positionData = namespace('PositionData')

@Component({
  name: 'TracksModal',
  components: {
    TrackDetailsModal
  }
})
export default class TracksModal extends Vue {
  @positionData.State
  public isRecording!: boolean

  data() {
    return {
      isOpen: false,
      isLoading: true,
      tracks: [],
      selectedTrackId: null
    }
  }

  async getTracksTest(): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/tracks`
    const res = await axios.get(url)

    return res.data.tracks
  }

  async deleteTrackTest(e: MouseEvent, trackId: string) {
    e.stopPropagation()

    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/tracks/${trackId}`
    const res = await axios.delete(url)

    this.$data.tracks = res.data.tracks
  }

  mounted() {
    this.getTracksTest().then(res => {
      this.$data.tracks = res
      this.$data.isLoading = false
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
