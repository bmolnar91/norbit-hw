<template>
  <div class="map-root" ref="mapRoot"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { Feature } from 'ol'
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import { Geometry, LineString, Point } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Style from 'ol/style/Style'
import 'ol/ol.css'

import { Position } from '@/common/position'
import {
  dynamicLayerStyle,
  staticLayerStyle
} from '@/components/MapContainer/vectorLayerStyles'

const positionData = namespace('PositionData')

@Component({
  name: 'map-container'
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
      dynamicVectorLayer: null,
      staticVectorLayer: null
    }
  }

  handleStoreMutation() {
    this.updateDynamicLayerSource()
    this.updateStaticLayerSource()
  }

  updateDynamicLayerSource(): void {
    const source = this.$data.dynamicVectorLayer?.getSource()
    const features = [] as Feature<Geometry>[]

    if (this.boatPosition) {
      const boatCoordinate = fromLonLat([
        this.boatPosition.lon,
        this.boatPosition.lat
      ])

      features.push(
        new Feature({
          geometry: new Point(boatCoordinate)
        })
      )

      const boatStyleTemp = this.$data.dynamicVectorLayer?.getStyle()
      if (boatStyleTemp instanceof Style) {
        boatStyleTemp
          .getImage()
          .setRotation((Math.PI / 180) * this.boatPosition.heading)
      }
    }

    if (this.currentPositions.length > 0 && this.isRecording) {
      const lineStringCoordinates = this.currentPositions.map(
        (record: Position) => {
          return fromLonLat([record.lon, record.lat])
        }
      )

      features.push(
        new Feature({
          geometry: new LineString(lineStringCoordinates)
        })
      )
    }

    source?.clear()
    source?.addFeatures(features)
  }

  updateStaticLayerSource(): void {
    const source = this.$data.staticVectorLayer?.getSource()
    const features = [] as Feature<Geometry>[]

    if (this.selectedPositions.length > 0) {
      const lineStringCoordinates = this.selectedPositions.map(
        (record: Position) => {
          return fromLonLat([record.lon, record.lat])
        }
      )

      features.push(
        new Feature({
          geometry: new LineString(lineStringCoordinates)
        })
      )
    }

    source?.clear()
    source?.addFeatures(features)
  }

  initMap() {
    const tileLayer = new TileLayer({
      source: new OSM()
    })

    this.$data.dynamicVectorLayer = new VectorLayer({
      source: new VectorSource({
        features: []
      }),
      style: dynamicLayerStyle
    })

    this.$data.staticVectorLayer = new VectorLayer({
      source: new VectorSource({
        features: []
      }),
      style: staticLayerStyle
    })

    this.$data.map = new Map({
      target: this.$refs.mapRoot,
      layers: [
        tileLayer,
        this.$data.dynamicVectorLayer,
        this.$data.staticVectorLayer
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
