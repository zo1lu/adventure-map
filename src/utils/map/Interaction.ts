import { Map } from 'openlayers';
import { Draw, Select, Snap, Translate } from 'ol/interaction.js';
import { vectorSource, vectorLayer, markLayer, markSource } from './layer';
import { Type } from 'ol/geom/Geometry';
import { Style, Fill, Stroke, Icon } from "ol/style.js";

let vectorSelect: Select
let markSelect: Select

const addDrawAndSnapInteractions = (map: Map,shapeType:Type, color:string, stroke:number) => {
    const draw = new Draw({
        source: vectorSource,
        type: shapeType,
        style:{
          'circle-radius': 2,
          'circle-fill-color': color,
          'stroke-color': color,
          'stroke-width': stroke,
          'fill-color': 'rgba(255, 255, 255, 0.2)',
        }
    })
    const snap = new Snap({source:vectorSource})
    map.addInteraction(snap)
    map.addInteraction(draw)
}

const addSelectAndTranslateInteractions = (map: Map) => {
    vectorSelect = new Select({
            layers: [vectorLayer],
            style: new Style({
            fill: new Fill({
                color: "rgba(255, 255, 255, 0.7)",
            }),
            stroke: new Stroke({
                color: "#BD7FAC",
                width: 2,
            }),
        }),
    });

    markSelect = new Select({
            layers: [markLayer],
            style: new Style({
            image: new Icon({
                anchor: [0.5, 0.9],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                scale: 0.7,
                src: "/icons/location-56-selected.png",
            }),
        }),
    });
    const vectorTranslate = new Translate({
        features: vectorSelect.getFeatures()
    });
    const markTranslate = new Translate({
        features: markSelect.getFeatures()
    });
    map.addInteraction(vectorSelect)
    map.addInteraction(markSelect)
    map.addInteraction(vectorTranslate)
    map.addInteraction(markTranslate)
}

const removeDrawAndSnapInteractions = (map: Map) => {
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof Draw){
            map.removeInteraction(interaction)
        }
    })
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof Snap){
            map.removeInteraction(interaction)
        }
    })
}

const removeSelectAndTranslateInteractions = (map: Map) => {
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof Select){
            map.removeInteraction(interaction)
        }
    })
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof Translate){
            map.removeInteraction(interaction)
        }
    })
}

const deleteSelectedFeature = (e, map:Map) => {
    if(e.code == "Backspace" || e.code == "Delete" ){
        if(markSelect.getFeatures().getLength()>0){
            markSource.removeFeature(markSelect.getFeatures().item(0))
        }
        if(vectorSelect.getFeatures().getLength()>0){
            vectorSource.removeFeature(vectorSelect.getFeatures().item(0))
        }
    }
}

export {addDrawAndSnapInteractions, addSelectAndTranslateInteractions, removeDrawAndSnapInteractions, removeSelectAndTranslateInteractions,
deleteSelectedFeature}