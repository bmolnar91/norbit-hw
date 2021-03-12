<template>
  <MapContainer />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { io } from 'socket.io-client'
import { positionMessageParser } from '@/util/jsonParsers'
import MapContainer from '@/components/MapContainer/MapContainer.vue'

const socket = io(`${process.env.VUE_APP_SERVER_DOMAIN}`)

export default defineComponent({
  name: 'App',
  components: { MapContainer },
  setup() {
    const store = useStore()

    const message = ref('')

    socket.on('position message', (msg: string) => {
      message.value = msg
      store.dispatch('addPositionRecord', positionMessageParser(msg))
    })

    return { store, message }
  }
})
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
