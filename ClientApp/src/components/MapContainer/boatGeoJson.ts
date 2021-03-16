import { Coordinate } from 'ol/coordinate'

export const getBoatGeoJson = (pointCoordinates: Coordinate) => {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: pointCoordinates
        }
      }
    ]
  }
}

export const getLineAndBoatGeoJson = (
  lineStringCoordinates: Coordinate[],
  pointCoordinates: Coordinate
) => {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: lineStringCoordinates
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: pointCoordinates
        }
      }
    ]
  }
}
