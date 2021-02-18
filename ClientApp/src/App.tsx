import React, { useState, useEffect } from "react";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import "./App.css";
import MapWrapper from "./components/map/MapWrapper";

function App() {
  // const [features, setFeatures] = useState<Feature<Geometry>[]>([]);

  // useEffect(() => {
  //   fetch("/mock-geojson-api.json")
  //     .then((response) => response.json())
  //     .then((fetchedFeatures) => {
  //       const wktOptions = {
  //         dataProjection: "EPSG:4326",
  //         featureProjection: "EPSG:3857",
  //       };
  //       const parsedFeatures = new GeoJSON().readFeatures(
  //         fetchedFeatures,
  //         wktOptions
  //       );

  //       setFeatures(parsedFeatures);
  //     });
  // }, []);

  return (
    <div className="App">
      <div className="app-label">
        <p>React Functional Components with OpenLayers</p>
        <p>Click the map to reveal location coordinate via React State</p>
      </div>

      {/* <MapWrapper features={features} /> */}
      <MapWrapper features={[]} />
    </div>
  );
}

export default App;
