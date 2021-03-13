<template>
  <div class="map-root" ref="mapRoot"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

import { PositionRecord } from "@/store";
import { boatStyle } from "@/components/MapContainer/boatStyles";
import { getBoatGeoJson } from "@/components/MapContainer/boatGeoJson";

@Component
export default class MapContainer extends Vue {
  $refs!: {
    mapRoot: HTMLDivElement;
    bob: HTMLInputElement;
  };

  data() {
    return {
      map: null,
      vectorLayer: null
    };
  }

  updateSource(geoJson: object): void {
    const source = this.$data.vectorLayer?.getSource();
    const features = new GeoJSON().readFeatures(geoJson);

    source?.clear();
    source?.addFeatures(features);

    const boatStyleTemp = this.$data.vectorLayer?.getStyle();
    if (boatStyleTemp instanceof Style) {
      boatStyleTemp
        .getImage()
        .setRotation(
          (Math.PI / 180) *
            this.$store.state.positionData[
              this.$store.state.positionData.length - 1
            ]?.heading
        );
    }
  }

  created() {
    this.$store.subscribe((mutation, state) => {
      const lineStringCoordinates = state.positionData.map(
        (record: PositionRecord) => {
          return fromLonLat([record.lon, record.lat]);
        }
      );
      const boatCoordinate = fromLonLat([
        state.positionData[state.positionData.length - 1].lon,
        state.positionData[state.positionData.length - 1].lat
      ]);
      const geoJson = getBoatGeoJson(lineStringCoordinates, boatCoordinate);

      this.updateSource(geoJson);
    });
  }

  mounted() {
    this.$data.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: []
      }),
      style: boatStyle
    });

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
    });
  }
}
</script>

<style>
.map-root {
  width: 100vw;
  height: 100vh;
}
</style>
