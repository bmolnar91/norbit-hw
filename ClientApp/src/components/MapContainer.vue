<template>
  <div class="map-root"
       ref="mapRoot">
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

import 'ol/ol.css'

export default defineComponent({
  name: "MapContainer",
  setup() {
    const mapRoot = ref(null)

    onMounted(() => {
      new Map({
        target: mapRoot.value,
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          zoom: 0,
          center: [0, 0],
          constrainResolution: true
        })
      })
    })

    return { mapRoot }
  }
})
</script>

<style>
.map-root {
  width: 100%;
  height: 100%;
}
</style>
