import { Fill, RegularShape, Stroke } from 'ol/style'
import Style from 'ol/style/Style'

const fillStyle = new Fill({
  color: [84, 118, 255, 1]
})

const strokeStyle = new Stroke({
  color: [255, 45, 45, 0.5],
  width: 3
})

const imageStyle = new RegularShape({
  fill: new Fill({
    color: [95, 145, 130, 1]
  }),
  stroke: new Stroke({
    color: [255, 45, 45, 0.5],
    width: 2
  }),
  points: 3,
  radius: 7
})

export const boatStyle = new Style({
  fill: fillStyle,
  stroke: strokeStyle,
  image: imageStyle
})
