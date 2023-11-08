import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

const tileLayer = new TileLayer({
    source: new OSM(),
})

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const markSource = new VectorSource();
const markLayer = new VectorLayer({
  source: markSource,
});

// const tileLayer

export { tileLayer, vectorLayer, vectorSource, markLayer, markSource}