<template>
  <div>
    <p>{{ message }}</p>
    <h3>{{ positionData }}</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from "vuex"
import { io } from 'socket.io-client'

const socket = io(`${process.env.VUE_APP_SERVER_DOMAIN}`)

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore()
    store.dispatch('setPositionData', {lat: 1, lon: 1, heading: 1})

    const message = ref('')

    socket.on('position message', (msg: string) => {
      console.log(msg)
      message.value = msg
    })

    const positionData = computed(() => {
      try {
        return JSON.parse(message.value, (k, v) => {
          return (typeof v === "object" || isNaN(v)) ? v : parseFloat(v)
        })
      } catch (err) {
        if (!(err.name === 'SyntaxError')) {
          throw Error(err.message)
        }
      }
    })

    console.log(store.state.positionData)

    return { message, positionData }
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
