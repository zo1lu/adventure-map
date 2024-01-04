import { Style } from 'ol/style';
import { Fill, Stroke, Circle } from 'ol/style';

const rangeFill = new Fill({
    color: 'rgba(255,255,255,0.4)',
  });
const rangeStroke = new Stroke({
color: '#071833',
width: 2,
});

const pointFill = new Fill({
    color: '#071833',
});
const pointStroke = new Stroke({
color: '#071833',
width: 3,
});

const userLayerStyle = new Style({
image: new Circle({
    fill: pointFill,
    stroke: pointStroke,
    radius: 2,
}),
fill: rangeFill,
stroke: rangeStroke,
})

  export {userLayerStyle}