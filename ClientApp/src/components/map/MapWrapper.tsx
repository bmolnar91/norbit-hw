import React, { useState, useRef } from "react";

const MapWrapper = (props: string) => {
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const [selectedCoord, setSelectedCoord] = useState();

  const mapElement = useRef(null);

  return <div ref={mapElement} className="map-container"></div>;
};

export default MapWrapper;
