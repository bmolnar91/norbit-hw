<template>
  <div class="map-root" ref="mapRoot"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import Style from 'ol/style/Style'
import 'ol/ol.css'

import { Position } from '@/common/position'
import {
  getLineAndBoatGeoJson,
  getBoatGeoJson,
  baseGeoJson
} from '@/components/MapContainer/boatGeoJson'
import { boatStyle } from '@/components/MapContainer/boatStyles'

const positionData = namespace('PositionData')

@Component({
  name: 'MapContainer'
})
export default class MapContainer extends Vue {
  @positionData.State
  public currentPositions!: Position[]

  @positionData.State
  public boatPosition!: Position

  @positionData.State
  public isRecording!: boolean

  @positionData.State
  public selectedPositions!: Position[]

  $refs!: {
    mapRoot: HTMLDivElement
  }

  data() {
    return {
      map: null,
      vectorLayer: null,
      theOtherVectorLayer: null
    }
  }

  handleStoreMutation() {
    let geoJson = null
    let theOtherGeoJson = null

    if (this.boatPosition) {
      const boatCoordinate = fromLonLat([
        this.boatPosition.lon,
        this.boatPosition.lat
      ])

      if (this.currentPositions.length > 0 && this.isRecording) {
        const lineStringCoordinates = this.currentPositions.map(
          (record: Position) => {
            return fromLonLat([record.lon, record.lat])
          }
        )
        geoJson = getLineAndBoatGeoJson(lineStringCoordinates, boatCoordinate)
      } else {
        geoJson = getBoatGeoJson(boatCoordinate)
      }

      console.log(this.selectedPositions.length)

      if (this.selectedPositions.length > 0) {
        const lineStringCoordinates = this.selectedPositions.map(
          (record: Position) => {
            console.log(fromLonLat([record.lon, record.lat]))
            return fromLonLat([record.lon, record.lat])
          }
        )
        theOtherGeoJson = getLineAndBoatGeoJson(
          lineStringCoordinates,
          boatCoordinate
        )
        this.updateTheOtherSource(theOtherGeoJson)
      }

      this.updateSource(geoJson)
    }
  }

  // handleStoreMutation() {
  //   const geoJson = baseGeoJson()
  //   this.updateSource(geoJson)
  // }

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

  updateTheOtherSource(geoJson: object): void {
    const source = this.$data.theOtherVectorLayer?.getSource()
    const features = new GeoJSON().readFeatures(geoJson)

    source?.clear()
    source?.addFeatures(features)

    const boatStyleTemp = this.$data.theOtherVectorLayer?.getStyle()
    if (boatStyleTemp instanceof Style) {
      boatStyleTemp
        .getImage()
        .setRotation((Math.PI / 180) * this.boatPosition.heading)
    }
  }

  initMap() {
    this.$data.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: []
      }),
      style: boatStyle
    })

    this.$data.theOtherVectorLayer = new VectorLayer({
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
        this.$data.vectorLayer,
        this.$data.theOtherVectorLayer
      ],
      view: new View({
        zoom: 18,
        center: fromLonLat([20.73998593, 48.21339894]),
        constrainResolution: true
      })
    })
  }

  mounted() {
    this.$store.subscribe(() => {
      this.handleStoreMutation()
    })

    this.initMap()
  }
}
</script>

<style>
.map-root {
  width: 100vw;
  height: 100vh;
}
</style>
