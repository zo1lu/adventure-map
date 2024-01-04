
import { markSource, vectorSource, routeSource } from "@/utils/map/layer";
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
    name: "Spot",
    type:"spot",
    location: coordinate,
    })
    feature.setStyle(spotStyle)
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

const selectedSpotStyle = () => new Style({
    image: new Icon({
        anchor: [0.5, 0.9],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        scale: 0.7,
        src: "/icons/location-56-selected.png",
    }),
})

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
        stroke: new Stroke({
            color: [255,0,0],
            width: stroke,
        }),
        radius: 7,
    })
})

// const createRouteStyle = () => new Style({
//     stroke: new Stroke({
//         color: '#6b91fa',
//         width: 5,
//         lineDash: [10, 10]
//     }),
// })

const createRouteStyle = (route_type:routeType) => {
    switch (route_type){
        case "walk":
            return new Style({
                        stroke: new Stroke({
                        color: '#080808',
                        width: 2,
                        lineDash: [5, 10]
                        }),
                    });
        case "bike":
            return new Style({
                        stroke: new Stroke({
                        color: '#468a48',
                        width: 2,
                        lineDash: [10, 10]
                        }),
                    });
        case "car":
            return new Style({
                        stroke: new Stroke({
                        color: '#080808',
                        width: 10,
                        lineDash: [2, 10],
                        lineCap: 'butt',
                        lineJoin: 'bevel'
                        }),
                    });
        case "bus":
            return new Style({
                        stroke: new Stroke({
                        color: '#468a48',
                        width: 10,
                        lineDash: [2, 10],
                        lineCap: 'butt',
                        lineJoin: 'bevel'
                        }),
                    });
        case "tram":
            return new Style({
                        stroke: new Stroke({
                        color: '#f52825',
                        width: 20,
                        lineDash: [3, 10],
                        lineCap: 'butt',
                        lineJoin: 'bevel'
                        }),
                    });
        case "train":
            return new Style({
                        stroke: new Stroke({
                        color: '#fcba1e',
                        width: 20,
                        lineDash: [3, 10],
                        lineCap: 'butt',
                        lineJoin: 'bevel'
                        }),
                    });
        case "ferry":
            return new Style({
                        stroke: new Stroke({
                        color: '#2b7cff',
                        width: 5,
                        lineDash: [5, 15]
                        }),
                    });
        case "plane":
            return new Style({
                        stroke: new Stroke({
                        color: '#a2bde8',
                        width: 5,
                        lineDash: [5, 15]
                        }),
                    });
        default:
            return new Style({
                stroke: new Stroke({
                color: '#080808',
                width: 2,
                lineDash: [5, 10]
                }),
            });
        }
        
}

const addStyleToPreSelectedFeature = (preSelectedFeature:preSelectedFeatureType) => {
    const type = preSelectedFeature.type
    const id = preSelectedFeature.id
    if(type=="route"){
      const routeFeature = routeSource.getFeatureById(id)
      const routeType = routeFeature?.get("route_type")
      routeFeature?.setStyle(createRouteStyle(routeType))
    }else if(type=="linestring" || type=="polygon" || type=="circle" ){
      const geometryFeature = vectorSource.getFeatureById(id)
      const color = geometryFeature?.get("color")
      const stroke = geometryFeature?.get("stroke")
      geometryFeature?.setStyle(createGeometryStyle(color, stroke))
    }
  }

export {addSpotFeature, createGeometryStyle, createRouteStyle ,generateUid, spotStyle, addStyleToPreSelectedFeature}