<template>
  <div class="map-root"
       ref="mapRoot">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import GeoJSON from 'ol/format/GeoJSON'
import { fromLonLat } from 'ol/proj'
import 'ol/ol.css'

import { PositionRecord } from '@/store'
import { boatStyle } from '@/components/MapContainer/boatStyles'


export default defineComponent({
  name: 'MapContainer',
  setup() {
    const store = useStore()

    const mapRoot = ref<HTMLDivElement | null>(null)

    let map: Map | null = null
    let vectorLayer: VectorLayer | null = null

    const updateSource = (geoJson: object): void => {
      const source = vectorLayer?.getSource()
      const features = new GeoJSON().readFeatures(geoJson)

      source?.clear()
      source?.addFeatures(features)

      const boatStyleTemp = vectorLayer?.getStyle()
      if (boatStyleTemp instanceof Style) {
        boatStyleTemp.getImage().setRotation(Math.PI / 180 * store.state.positionData[store.state.positionData.length - 1]?.heading)
      }
    }

    watch(store.state.positionData, () => {
      console.log('source updated')

      updateSource({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates:
                store.state.positionData.map((record: PositionRecord) => {
                  return fromLonLat([record.lon, record.lat])
                })
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: fromLonLat(
                [
                  store.state.positionData[store.state.positionData.length - 1].lon,
                  store.state.positionData[store.state.positionData.length - 1].lat
                ]
              )
            }
          }
        ]
      })
    })

    onMounted(() => {
      vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: []
        }),
        style: boatStyle
      })

      map = new Map({
        target: mapRoot.value || undefined,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          zoom: 23,
          center: fromLonLat([20.73998593, 48.21339894]),
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
  width: 100vw;
  height: 100vh;
}
</style>
