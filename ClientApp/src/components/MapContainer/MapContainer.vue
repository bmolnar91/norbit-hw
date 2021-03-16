<template>
  <div class="map-root" ref="mapRoot"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { namespace } from 'vuex-class'
const positionData = namespace('PositionData')
import { Position } from '@/common/position'

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

import { boatStyle } from '@/components/MapContainer/boatStyles'
import {
  getLineAndBoatGeoJson,
  getBoatGeoJson
} from '@/components/MapContainer/boatGeoJson'

@Component({
  name: 'MapContainer'
})
export default class MapContainer extends Vue {
  @positionData.State
  public positionRecords!: Position[]

  @positionData.State
  public boatPosition!: Position

  @positionData.State
  public isRecording!: boolean

  $refs!: {
    mapRoot: HTMLDivElement
  }

  data() {
    return {
      map: null,
      vectorLayer: null
    }
  }

  updateSource(geoJson: object): void {
    const source = this.$data.vectorLayer?.getSource()
    const features = new GeoJSON().readFeatures(geoJson)

    source?.clear()
    source?.addFeatures(features)

    const boatStyleTemp = this.$data.vectorLayer?.getStyle()
    if (boatStyleTemp instanceof Style) {
      boatStyleTemp
        .getImage()
        .setRotation((Math.PI / 180) * this.boatPosition.heading)
    }
  }

  created() {
    this.$store.subscribe(() => {
      let geoJson = null

      if (this.boatPosition) {
        const boatCoordinate = fromLonLat([
          this.boatPosition.lon,
          this.boatPosition.lat
        ])

        if (this.positionRecords.length > 0 && this.isRecording) {
          const lineStringCoordinates = this.positionRecords.map(
            (record: Position) => {
              return fromLonLat([record.lon, record.lat])
            }
          )
          geoJson = getLineAndBoatGeoJson(lineStringCoordinates, boatCoordinate)
        } else {
          geoJson = getBoatGeoJson(boatCoordinate)
        }
        this.updateSource(geoJson)
      }
    })
  }

  mounted() {
    this.$data.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: []
      }),
      style: boatStyle
    })

    this.$data.map = new Map({
      target: this.$refs.mapRoot,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.$data.vectorLayer
      ],
      view: new View({
        zoom: 18,
        center: fromLonLat([20.73998593, 48.21339894]),
        constrainResolution: true
      })
    })
  }
}
</script>

<style>
.map-root {
  width: 100vw;
  height: 100vh;
}
</style>
