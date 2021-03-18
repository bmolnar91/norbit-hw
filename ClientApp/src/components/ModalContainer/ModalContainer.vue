<template>
  <div>
    <button
      class="modal-button"
      @click="isTracksModalOpen = !isTracksModalOpen"
    >
      {{ isTracksModalOpen ? 'Close modal' : 'Open modal' }}
    </button>
    <TracksModal v-if="isTracksModalOpen" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import TracksModal from '@/components/TracksModal/TracksModal.vue'

const positionData = namespace('PositionData')

@Component({
  name: 'ModalContainer',
  components: {
    TracksModal
  }
})
export default class ModalContainer extends Vue {
  @positionData.State
  public isRecording!: boolean

  data() {
    return {
      isTracksModalOpen: false,
      isLoading: false,
      tracks: []
    }
  }
}
</script>

<style>
.modal-button {
  position: absolute;
  bottom: 100px;
  right: 100px;
}
</style>
