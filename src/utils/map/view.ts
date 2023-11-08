import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';

const view = new View({
    center: fromLonLat([120,24]),
    zoom: 8,
    minZoom: 0,
    maxZoom: 28,
});

export default view