
import { markSource } from "@/utils/map/layer";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Circle, Icon } from "ol/style.js";
import { MapBrowserEvent } from "openlayers";

const generateUid = () => {
    return Date.now().toString(36);
  }

//add feature to sourece
function addSpotFeature(e:MapBrowserEvent){
    const spotFeature = createSpotFeature(e.coordinate)
    markSource.addFeature(spotFeature)
}
//Feature
const createSpotFeature = (coordinate:number[]) => {
    const feature = new Feature({
    geometry: new Point(coordinate),
    name: "Spot-Point",
    location: coordinate,
    })
    feature.setStyle(spotStyle)
    feature.setId(generateUid())
    return feature
}
//style
const spotStyle = () => new Style({
    image: new Icon({
        anchor: [0.5, 0.9],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        scale: 0.7,
        src: "/icons/location-56.png",
    }),
});

const fillStyle =  new Fill({color:'rgba(255, 255, 255, 0.2)'});

const createGeometryStyle = (color:string, stroke:number) => new Style({
    fill: fillStyle,
    stroke: new Stroke({
    width: stroke,
    color: color
    }),
    image: new Circle({
    fill: new Fill({
        color: color
    }),
    strokeStyle: new Stroke({
        color: [255,0,0],
        width: stroke,
    }),
    radius: 7,
    })
})


export {addSpotFeature, createGeometryStyle}