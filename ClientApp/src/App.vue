<template>
  <div>
    <h3>Message: {{ message }}</h3>
    <TestComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from "vuex"
import { io } from 'socket.io-client'
import TestComponent from '@/components/TestComponent.vue'
import { positionMessageParser } from '@/util/jsonParsers.ts'

const socket = io(`${process.env.VUE_APP_SERVER_DOMAIN}`)

export default defineComponent({
  name: 'App',
  components: {TestComponent},
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
  margin-top: 60px;
}
</style>
