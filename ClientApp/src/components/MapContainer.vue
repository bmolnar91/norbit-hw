<template>
  <div class="map-root"
       ref="mapRoot">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'

import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorImage from 'ol/layer/VectorImage'
import Vector from 'ol/source/Vector'
import Style from 'ol/style/Style'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, RegularShape } from 'ol/style'
import { fromLonLat } from 'ol/proj'

import 'ol/ol.css'
import VectorSource from "ol/source/Vector";
import {useStore} from "vuex";
import {PositionRecord} from "@/store";

const sampleData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          fromLonLat([20.73998593, 48.21339894]),
          fromLonLat([20.73998763, 48.21340378]),
          fromLonLat([20.73999099, 48.21341274]),
          fromLonLat([20.73999463, 48.21342119]),
          fromLonLat([20.73999791, 48.21342834]),
          fromLonLat([20.74000108, 48.21343519]),
          fromLonLat([20.74000406, 48.21344224]),
          fromLonLat([20.7400071, 48.21344992]),
          fromLonLat([20.74000919, 48.21345775])
        ]
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: fromLonLat([20.74000919, 48.21345775])
      }
    }
  ]
}

const fillStyle = new Fill({
  color: [84, 118, 255, 1],
})

const strokeStyle = new Stroke({
  color: [255, 45, 45, 0.5],
  width: 5
})


const triangleStyle = new RegularShape({
  fill: new Fill({
    color: [95, 145, 130, 1],
  }),
  stroke: new Stroke({
    color: [255, 45, 45, 0.5],
    width: 2
  }),
  points: 3,
  radius: 20,
  rotation: Math.PI / 180 * 359.8957594,
  angle: 0
})

const vectorImageSample = new VectorImage({
  source: new Vector({
    format: new GeoJSON(),
    features: new GeoJSON().readFeatures(sampleData),
  }),
  visible: true,
  style: new Style({
    fill: fillStyle,
    stroke: strokeStyle,
    image: triangleStyle
  }),
})

export default defineComponent({
  name: 'MapContainer',
  setup() {
    const store = useStore()

    const mapRoot = ref(null)

    let map: Map | null = null
    let vectorLayer: VectorLayer | null = null

    const updateSource = (geoJson: object): void => {
      // const view = map?.getView()
      const source = vectorLayer?.getSource()

      const features = new GeoJSON().readFeatures(geoJson)

      source?.clear()
      source?.addFeatures(features)

      // if (source) {
      //   view?.fit(source.getExtent())
      // }
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
        })
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

      updateSource(sampleData)
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
