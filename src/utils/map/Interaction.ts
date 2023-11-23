////type module
import { Map } from 'openlayers';
import { Extent } from 'openlayers';
////ol module
import { Feature } from 'ol';
import { Draw, Select, Snap, Translate } from 'ol/interaction.js';
import { Type } from 'ol/geom/Geometry';
import { Style, Fill, Stroke, Icon } from "ol/style.js";
import { Point } from 'ol/geom';
import { fromExtent } from 'ol/geom/Polygon';
import { Source } from 'ol/source';
import VectorSource from 'ol/source/Vector';
////my module
import { createRouteStyle } from './feature';
import { vectorSource, vectorLayer, markLayer, markSource, routeLayer, routeSource, selectedLayer, selectedSource } from './layer';


// let vectorSelect: Select
// let markSelect: Select

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

const addDrawRouteAndSnapInteractions = (map: Map, route_type:routeType) => {
    const routeStyle = createRouteStyle(route_type)
    const draw = new Draw({
        source: routeSource,
        type: "LineString",
        style: routeStyle
    })
    const snap = new Snap({source:routeSource})
    map.addInteraction(snap)
    map.addInteraction(draw)
}

const setFeatureSelectedById = (map:Map, type:sourceType, id:string) => {

    
    // const feature = source.getFeatureById(id)
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof Select){
            const feature = type=="mark"?markSource.getFeatureById(id):
                    type=="vector"?vectorSource.getFeatureById(id):
                    routeSource.getFeatureById(id);
            interaction.getFeatures().push(feature)
        }
    })
}
// const addSelectAndTranslateInteractions = (map: Map) => {
//     vectorSelect = new Select({
//             layers: [vectorLayer],
//             style: new Style({
//             fill: new Fill({
//                 color: "rgba(255, 255, 255, 0.7)",
//             }),
//             stroke: new Stroke({
//                 color: "#BD7FAC",
//                 width: 2,
//             }),
//         }),
//     });

//     markSelect = new Select({
//             layers: [markLayer],
//             style: new Style({
//             image: new Icon({
//                 anchor: [0.5, 0.9],
//                 anchorXUnits: "fraction",
//                 anchorYUnits: "fraction",
//                 scale: 0.7,
//                 src: "/icons/location-56-selected.png",
//             }),
//         }),
//     });
//     const vectorTranslate = new Translate({
//         features: vectorSelect.getFeatures()
//     });
//     const markTranslate = new Translate({
//         features: markSelect.getFeatures()
//     });
//     map.addInteraction(vectorSelect)
//     map.addInteraction(markSelect)
//     map.addInteraction(vectorTranslate)
//     map.addInteraction(markTranslate)
//     // markSelect.on('select',(e)=>{
//     //     console.log(e)
//     //     console.log(e.selected[0])
//     //     console.log(e.selected[0].getId())
//     //     console.log(e.selected[0].getStyle())
//     // })
// }

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
const removeSelectedFeature = (map:Map) =>{
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof Select){
            interaction.getFeatures().clear()
        }
    })
}
const removeSelectAndTranslateInteractions = (map: Map) => {
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof Select){
            interaction.getFeatures().clear()
            map.removeInteraction(interaction)
        }
    })
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof Translate){
            map.removeInteraction(interaction)
        }
    })
}

const deleteSelectedFeature = (id:string, type:selectedFeatureType) => {
    //fetch to delete feature
    //if success remove from map
    console.log(id)
    console.log(type)
    if(type=="spot"){
        const markFeature = markSource.getFeatureById(id)
        markSource.removeFeature(markFeature)
    }else if(type=="route"){
        const routeFeature = routeSource.getFeatureById(id)
        routeSource.removeFeature(routeFeature)
    }else if(type=="linestring"||type=="polygon"||type=="circle"){
        const vectorFeature = vectorSource.getFeatureById(id)
        vectorSource.removeFeature(vectorFeature)
    }
    selectedSource.clear()
}
// delete selectedFeature
// map.getInteractions().forEach((interaction)=>{
//     if (interaction instanceof Select){
//         interaction.getFeatures().item(0).getGeometry() instanceof Point?
//         markSource.removeFeature(interaction.getFeatures().item(0)):
//         vectorSource.removeFeature(interaction.getFeatures().item(0))
//         routeSource.removeFeature(interaction.getFeatures().item(0))
//     }
// })
// const vectorSelect = new Select({
//     layers: [vectorLayer],
//     style: new Style({
//     fill: new Fill({
//         color: "rgba(255, 255, 255, 0.7)",
//     }),
//     stroke: new Stroke({
//         color: "#BD7FAC",
//         width: 2,
//     }),
// }),
// });

// const markSelect = new Select({
//     layers: [markLayer],
//     style: new Style({
//     image: new Icon({
//         anchor: [0.5, 0.9],
//         anchorXUnits: "fraction",
//         anchorYUnits: "fraction",
//         scale: 0.7,
//         src: "/icons/location-56-selected.png",
//     }),
// }),
// });
// const vectorTranslate = new Translate({
// features: vectorSelect.getFeatures()
// });
// const markTranslate = new Translate({
// features: markSelect.getFeatures()
// });

const toggleHandMapInteraction = (map:Map, isActive:boolean) => {
        map.getInteractions().forEach((interaction)=>{
            if (interaction instanceof Select){
                interaction.getFeatures().clear()
                interaction.setActive(isActive)
            }else if(interaction instanceof Translate){
                interaction.setActive(isActive)
            }
        })
}

const getOffsetExtend = (extend:Extent) => {
    let offsetExtend:Extent = [0,0,0,0]
    let xOffset = (extend[2]- extend[0])*0.03>2500?(extend[2]- extend[0])*0.03:2500
    let yOffset = (extend[3]- extend[1])*0.03>2500?(extend[3]- extend[1])*0.03:2500
    offsetExtend[0] = extend[0]-xOffset
    offsetExtend[1] = extend[1]-yOffset
    offsetExtend[2] = extend[2]+xOffset
    offsetExtend[3] = extend[3]+yOffset
    return offsetExtend
  }
  const setSelectedFeatureBoundary = (extent:Extent) => {
    const selectedStyle = new Style({
      stroke: new Stroke({
        color: "#b27c9d",
        width: 1,
      })
    })
    const squareGeometry = fromExtent(getOffsetExtend(extent))
    const newFeature = new Feature({
      geometry: squareGeometry,
    })
    newFeature.setStyle(selectedStyle)
    selectedSource.clear()
    selectedSource.addFeature(newFeature)
  }

export {addDrawAndSnapInteractions, removeDrawAndSnapInteractions, removeSelectAndTranslateInteractions,
deleteSelectedFeature, toggleHandMapInteraction, addDrawRouteAndSnapInteractions, removeSelectedFeature, setFeatureSelectedById, setSelectedFeatureBoundary}