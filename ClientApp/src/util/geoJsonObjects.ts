import GeoJSON from "ol/format/GeoJSON";
import VectorImage from "ol/layer/VectorImage";
import Vector from "ol/source/Vector";
import { Style, Fill, Stroke, Circle } from "ol/style";

const fillStyle = new Fill({
  color: [84, 118, 255, 1],
});

const strokeStyle = new Stroke({
  color: [255, 45, 45],
  width: 5,
});

const circleStyle = new Circle({
  fill: new Fill({
    color: [245, 49, 5, 1],
  }),
  radius: 7,
  stroke: strokeStyle,
});

const geoJsonPoint = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [15.556640624999998, 46.76996843356982],
  },
};

const geoJsonLine = {
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
};

const createDummyGeoJson = (): VectorImage => {
  return new VectorImage({
    source: new Vector({
      format: new GeoJSON(),
      features: new GeoJSON().readFeatures(geoJsonLine),
    }),
    visible: true,
    style: new Style({
      fill: fillStyle,
      stroke: strokeStyle,
      image: circleStyle,
    }),
  });
};

export { createDummyGeoJson };
