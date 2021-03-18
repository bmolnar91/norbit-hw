<template>
  <div class="track-details-modal" v-if="!this.$data.isLoading">
    <div
      class="position-item"
      v-for="position in this.$data.positions"
      :key="position.id"
    >
      <p>ID: {{ position.id }}</p>
      <p>Actual time: {{ position.actual_time }}</p>
      <p>Longitude: {{ position.longitude }}</p>
      <p>Latitude: {{ position.latitude }}</p>
      <p>Heading: {{ position.heading }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import axios from 'axios'
import { Position } from '@/common/position'

const positionData = namespace('PositionData')

@Component({
  name: 'TrackDetailsModal'
})
export default class TrackDetailsModal extends Vue {
  @positionData.Action
  public setSelectedPositions!: (positions: Position[]) => void

  @Prop(String)
  public trackId!: string

  data() {
    return {
      isOpen: false,
      isLoading: true,
      positions: []
    }
  }

  async getPositionsByTrackId(trackId: string): Promise<void> {
    const url = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/tracks/${trackId}`
    const res = await axios.get(url)

    return res.data.positions
  }

  mounted() {
    this.getPositionsByTrackId(this.$props.trackId).then(res => {
      this.$data.positions = res
      this.$data.isLoading = false

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
}
</script>

<style>
.track-details-modal {
}
.position-item {
  display: flex;
}
</style>
