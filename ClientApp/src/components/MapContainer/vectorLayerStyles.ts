import { Fill, RegularShape, Stroke } from 'ol/style'
import Style from 'ol/style/Style'

export const dynamicLayerStyle = new Style({
  stroke: new Stroke({
    color: [220, 20, 60, 0.5],
    width: 3
  }),
  image: new RegularShape({
    fill: new Fill({
      color: [44, 62, 80, 1]
    }),
    stroke: new Stroke({
      color: [220, 20, 60, 1],
      width: 3
    }),
    points: 3,
    radius: 7
  })
})

export const staticLayerStyle = new Style({
  stroke: new Stroke({
    color: [0, 0, 0, 0.3],
    width: 7
  })
})
