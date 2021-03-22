<template>
  <v-card
    max-width="600"
    max-height="400"
    class="mx-auto overflow-y-auto"
    style="position:absolute;top:5rem;right:5rem;"
  >
    <v-toolbar color="rgb(0,60,136,0.5)" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Recorded tracks</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon @click="$emit('closeModal')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list dense>
      <v-subheader inset>Tracks</v-subheader>
      <v-list-item-group v-model="selectedListItem" color="rgb(0,60,136,0.5)">
        <v-list-item
          v-for="track in this.$data.tracks"
          :key="track.id"
          @click="listItemClickHandler(track.id)"
        >
          <v-list-item-avatar>
            <v-icon class="grey lighten-1" dark>
              mdi-folder
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="track.endTime"></v-list-item-title>

            <!--          <v-list-item-subtitle v-text="track.id"></v-list-item-subtitle>-->
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click.stop="deleteButtonClickHandler(track.id)">
              <v-icon color="grey lighten-1">mdi-delete-alert</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import axios from 'axios'
import { format } from 'date-fns'
import { Position } from '@/common/position'

const positionData = namespace('PositionData')

@Component({
  name: 'ModalVuetify'
})
export default class ModalVuetify extends Vue {
  @positionData.State
  public isRecording!: boolean

  @positionData.Action
  public setSelectedPositions!: (positions: Position[]) => void

  data() {
    return {
      tracks: [],
      selectedTrackId: null,
      selectedListItem: null
    }
  }

  listItemClickHandler(trackId: string): void {
    if (trackId === this.$data.selectedTrackId) {
      this.$data.selectedTrackId = null
      this.setSelectedPositions([])
    } else {
      this.$data.selectedTrackId = trackId
      this.showSelectedPositions(trackId)
    }
  }

  deleteButtonClickHandler(trackId: string) {
    if (trackId === this.$data.selectedTrackId) {
      this.$data.selectedTrackId = null
      this.setSelectedPositions([])
    }

    this.deleteTrackById(trackId)
  }

  getFinishedTracks(tracks: []) {
    if (this.isRecording) {
      tracks.shift()
    }
    return tracks
  }

  getFormattedTracks(tracks: []) {
    return tracks.map(
      (track: { id: string; start_time: string; end_time: string }) => {
        const dateTime = new Date(track.end_time)
        return new Object({
          id: track.id,
          endTime: `${format(dateTime, 'yyyy-MM-dd-HH_mm_ss')}`
        })
      }
    )
  }

  async fetchTracks(): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/tracks`
    const res = await axios.get(url)
    const finishedTracks = this.getFinishedTracks(res.data.tracks)

    this.$data.tracks = this.getFormattedTracks(finishedTracks)
  }

  async deleteTrackById(trackId: string): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/tracks/${trackId}`
    const res = await axios.delete(url)
    const finishedTracks = this.getFinishedTracks(res.data.tracks)

    this.$data.tracks = this.getFormattedTracks(finishedTracks)
  }

  async getPositionsByTrackId(trackId: string): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/tracks/${trackId}`
    const res = await axios.get(url)

    return res.data.positions
  }

  showSelectedPositions(trackId: string): void {
    this.getPositionsByTrackId(trackId).then(res => {
      this.$data.positions = res

      const positionObjects: Position[] = this.$data.positions.map(
        (position: any) => {
          return new Object({
            lat: position.latitude,
            lon: position.longitude,
            heading: position.heading
          }) as Position
        }
      )

      this.setSelectedPositions(positionObjects)
    })
  }

  @Watch('isRecording')
  onRecordingChanged() {
    if (!this.isRecording) {
      this.fetchTracks()
    }
  }

  mounted() {
    this.fetchTracks()
  }
}
</script>
