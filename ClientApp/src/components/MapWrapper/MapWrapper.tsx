import React, { useState, useEffect, useRef } from "react";
import { MapBrowserEvent } from "ol";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import GeoJSON from "ol/format/GeoJSON";
import { createDummyGeoJson } from "../../util/geoJsonObjects";

function MapWrapper(props: { incomingCoord: number[] | undefined }) {
  const [map, setMap] = useState<Map>();
  const [featuresLayer, setFeaturesLayer] = useState<VectorLayer>();

  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null | undefined>(null);
  mapRef.current = map;

  useEffect(() => {
    const initialFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
    });

    const initialMap = new Map({
      target: mapElement.current ?? undefined,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}",
          }),
          visible: true,
        }),

        new TileLayer({
          source: new XYZ({
            url:
              "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
          }),
          visible: false,
        }),

        initialFeaturesLayer,
      ],
      view: new View({
        projection: "EPSG:3857",
        center: props.incomingCoord
          ? [props.incomingCoord[0], props.incomingCoord[1]]
          : [0, 0],
        zoom: 5,
      }),
      controls: [],
    });

    const vector = createDummyGeoJson();
    initialMap.addLayer(vector);

    // Manual testing with dummy data
    initialFeaturesLayer.getSource().clear();
    const format = new GeoJSON();
    initialFeaturesLayer.getSource().addFeatures(
      format.readFeatures({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [17.138671875, 47.78363463526376],
            [16.5234375, 47.87214396888731],
            [16.5234375, 47.30903424774781],
            [16.1279296875, 46.92025531537451],
            [15.556640624999998, 46.76996843356982],
          ],
        },
      })
    );

    initialFeaturesLayer.getSource().addFeatures(
      format.readFeatures({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [14.7216796875, 46.5286346952717],
            [13.9306640625, 46.5286346952717],
            [12.963867187499998, 46.619261036171515],
            [12.2607421875, 47.040182144806664],
            [11.557617187499998, 47.010225655683485],
            [10.8544921875, 46.830133640447386],
            [10.5029296875, 46.98025235521883],
            [9.9755859375, 46.89023157359399],
            [9.667968749999998, 47.517200697839414],
          ],
        },
      })
    );

    initialMap.on("click", handleMapClick);
    setMap(initialMap);
  }, []);

  useEffect(() => {
    handleMessage();
  }, [props.incomingCoord]);

  const handleMapClick = (event: MapBrowserEvent) => {
    const clickedCoord = mapRef?.current?.getCoordinateFromPixel(event.pixel);

    mapRef?.current?.getView().setCenter([clickedCoord![0], clickedCoord![1]]);
    console.log(mapRef?.current?.getView().getCenter());
    featuresLayer?.getSource().changed();
  };

  const handleMessage = () => {
    if (props.incomingCoord) {
      mapRef?.current
        ?.getView()
        .setCenter([props.incomingCoord![0], props.incomingCoord![1]]);
      console.log(mapRef?.current?.getView().getCenter());
      featuresLayer?.getSource().changed();
    }
  };

  return <div ref={mapElement} className="map-container"></div>;
}

export default MapWrapper;
