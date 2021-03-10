<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { io } from 'socket.io-client'

const socket = io(`${process.env.VUE_APP_SERVER_DOMAIN}`)

export default defineComponent({
  name: 'App',
  setup() {
    const message = ref('')

    socket.on('position message', (msg: string) => {
      console.log(msg)
      message.value = msg
    })

    return { message }
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
