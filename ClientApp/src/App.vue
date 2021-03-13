<template>
  <MapContainer />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { io } from "socket.io-client";
import { positionMessageParser } from "@/util/jsonParsers";
import MapContainer from "@/components/MapContainer/MapContainer.vue";

const socket = io(process.env.VUE_APP_SERVER_DOMAIN);

@Component({
  components: {
    MapContainer
  }
})
export default class App extends Vue {
  data() {
    return {
      message: "bob"
    };
  }

  created() {
    socket.on("position message", (msg: string) => {
      this.$data.message = msg;
      this.$store.dispatch("addPositionRecord", positionMessageParser(msg));
    });
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
