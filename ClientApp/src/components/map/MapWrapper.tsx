import React, { useState, useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { transform } from "ol/proj";
import { MapBrowserEvent } from "ol";

function MapWrapper(props: { features: any[] }) {
  const [map, setMap] = useState<Map>();
  const [featuresLayer, setFeaturesLayer] = useState<VectorLayer>();
  const [selectedCoord, setSelectedCoord] = useState<number[]>();

  const mapElement = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<Map | null | undefined>(null);
  mapRef.current = map;

  useEffect(() => {
    const initalFeaturesLayer = new VectorLayer({
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

        initalFeaturesLayer,
      ],
      view: new View({
        projection: "EPSG:3857",
        center: [0, 0],
        zoom: 2,
      }),
      controls: [],
    });

    initialMap.on("click", handleMapClick);

    setMap(initialMap);
    setFeaturesLayer(initalFeaturesLayer);
  }, []);

  useEffect(() => {
    if (props.features.length) {
      featuresLayer?.setSource(
        new VectorSource({
          features: props.features,
        })
      );

      map?.getView().fit(featuresLayer?.getSource().getExtent()!, {
        padding: [100, 100, 100, 100],
      });
    }
  }, [props.features]);

  const handleMapClick = (event: MapBrowserEvent) => {
    const clickedCoord = mapRef?.current?.getCoordinateFromPixel(event.pixel);

    // TODO: make this work
    const transformedCoord = transform(clickedCoord!, "EPSG:3857", "EPSG:4326");

    setSelectedCoord(transformedCoord);
    console.log(clickedCoord);
  };

  return <div ref={mapElement} className="map-container"></div>;
}

export default MapWrapper;
