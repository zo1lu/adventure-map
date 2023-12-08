import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

const tileLayer = new TileLayer({
  source: new OSM()
})

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const markSource = new VectorSource();
const markLayer = new VectorLayer({
  source: markSource,
});

const routeSource = new VectorSource();
const routeLayer = new VectorLayer({
  source: routeSource,
});

const selectedSource = new VectorSource();
const selectedLayer = new VectorLayer({
  source: selectedSource,
});

const userSource = new VectorSource();
const userLayer = new VectorLayer({
  source:userSource
})

const searchSource = new VectorSource();
const searchLayer = new VectorLayer({
  source:searchSource
})

export { tileLayer, vectorLayer, vectorSource, markLayer, markSource , routeLayer, routeSource, selectedLayer, selectedSource , userSource, userLayer, searchSource, searchLayer}