import { Coordinate } from 'ol/coordinate'
import { Feature } from 'ol'
import { Geometry } from 'ol/geom'

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

export const baseGeoJson = () => {
  return {
    type: 'FeatureCollection',
    features: []
  }
}

export const boatFeature = (pointCoordinates: Coordinate) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: pointCoordinates
    }
  }
}

export const recordLineFeature = (lineStringCoordinates: Coordinate[]) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: lineStringCoordinates
    }
  }
}
