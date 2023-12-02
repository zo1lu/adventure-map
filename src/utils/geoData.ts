import GeoJSON from 'ol/format/GeoJSON.js';
import { markSource, vectorSource, routeSource } from "./map/layer";
import { createGeometryStyle, createRouteStyle, spotStyle } from "./map/feature";
import { Circle } from 'ol/geom';
import { geoDataCollectionName, geoDataCollectionType, geoDataType } from '@/data/infoType';
//vectorlayer for geometry
//markLyaer
//routelayer
//geojson data and iterate it!
//if type spot? route? linstring? polygon? circle?
//create feature
//add to different source


const renderGeoData = (geoData: geoDataType) => {
    // markSource.refresh()
    // routeSource.refresh()
    // vectorSource.refresh()
    
    const format = new GeoJSON({featureProjection: 'EPSG:3857'});
    const markFeatures = JSON.parse(geoData.markFeatures)["features"]
    if(markFeatures.length>0){
        markFeatures.forEach((feature)=>{
            const mark = format.readFeature(feature)
            mark.setStyle(spotStyle())
            markSource.addFeature(mark)
        })
    }
    const routeFeatures = JSON.parse(geoData.routeFeatures)["features"]
    if(routeFeatures.length>0){
        routeFeatures.forEach((feature)=>{
            const route = format.readFeature(feature)
            const routeType = route.get("route_type")
            const routeStyle = createRouteStyle(routeType)
            route.setStyle(routeStyle)
            routeSource.addFeature(route)
        })
    }
    const vectorFeatures = JSON.parse(geoData.vectorFeatures)["features"]
    if(vectorFeatures.length>0){
        vectorFeatures.forEach((feature)=>{
            const geometry = format.readFeature(feature)
            const geoType = geometry.get("type")
            if(geoType=="circle"){
                const center = geometry.get("center")
                const radius = geometry.get("radius")
                const circleGeometry = new Circle(center, radius)
                geometry.setGeometry(circleGeometry)
            }
            const geoColor = geometry.get("color")
            const geoStroke = geometry.get("stroke")
            const geoStyle = createGeometryStyle(geoColor, geoStroke)
            geometry.setStyle(geoStyle)
            vectorSource.addFeature(geometry)
        })
    }
}
const renderGeoDataCollections = (geoDataColleactions:geoDataCollectionType) => {
    vectorSource.clear()
    routeSource.clear()
    markSource.clear()
    const format = new GeoJSON({featureProjection: 'EPSG:3857'});
    if (geoDataColleactions.geometrys.length>0){
        geoDataColleactions.geometrys.forEach((featureObject)=>{
            const feature = JSON.parse(featureObject.geoData)
            const geometry = format.readFeature(feature)
            const geoType = geometry.get("type")
            if(geoType=="circle"){
                const center = geometry.get("center")
                const radius = geometry.get("radius")
                const circleGeometry = new Circle(center, radius)
                geometry.setGeometry(circleGeometry)
            }
            const geoColor = geometry.get("color")
            const geoStroke = geometry.get("stroke")
            const geoStyle = createGeometryStyle(geoColor, geoStroke)
            geometry.setStyle(geoStyle)
            vectorSource.addFeature(geometry)
        })
    }
    if(geoDataColleactions.routes.length>0){
        geoDataColleactions.routes.forEach((featureObject)=>{
            const feature = JSON.parse(featureObject.geoData)
            const route = format.readFeature(feature)
            const routeType = route.get("route_type")
            const routeStyle = createRouteStyle(routeType)
            route.setStyle(routeStyle)
            routeSource.addFeature(route)
        })
    }
    if(geoDataColleactions.spots.length>0){
        geoDataColleactions.spots.forEach((featureObject)=>{
            const feature = JSON.parse(featureObject.geoData)
            const spot = format.readFeature(feature)
            spot.setStyle(spotStyle())
            markSource.addFeature(spot)
        })
    }
}

const getMapGeoData = () => {
    const format = new GeoJSON({featureProjection: 'EPSG:3857'});
    const markFeatures = markSource.getFeatures()
    const markJson = format.writeFeatures(markFeatures)
    const routeFeatures = routeSource.getFeatures()
    const routeJson = format.writeFeatures(routeFeatures)
    const vectorFeatures = vectorSource.getFeatures()
    const vectorJson = format.writeFeatures(vectorFeatures)

    const featuresJson = {
        "markFeatures":markJson,
        "routeFeatures":routeJson,
        "vectorFeatures":vectorJson
    }
    return featuresJson

    // const format = new GeoJSON({featureProjection: 'EPSG:3857'});
    // const markFeatures = markSource.getFeatures()
    // const markJson = format.writeFeaturesObject(markFeatures)
    // const routeFeatures = routeSource.getFeatures()
    // const routeJson = format.writeFeaturesObject(routeFeatures)
    // const vectorFeatures = vectorSource.getFeatures()
    // const vectorJson = format.writeFeaturesObject(vectorFeatures)
    // console.log(markJson)
    // console.log(routeJson)
    // console.log(vectorJson)
    // const featuresJson = {
    //     "markFeatures":markJson,
    //     "routeFeatures":routeJson,
    //     "vectorFeatures":vectorJson
    // }
    // console.log(featuresJson)
    // return featuresJson
}

const getFeatureGeoData = (featureId:string, type:sourceType) => {
    const format = new GeoJSON({featureProjection: 'EPSG:3857'});
    if(type=="mark"){
        const markFeature = markSource.getFeatureById(featureId)
        const markJson = markFeature ? format.writeFeature(markFeature): null
        return markJson ? markJson : null 
    }else if(type=="route"){
        const routeFeature = routeSource.getFeatureById(featureId)
        const routeJson = routeFeature ? format.writeFeature(routeFeature): null
        return routeJson ? routeJson : null 
    }else if(type == "vector"){
        const vectorFeature = vectorSource.getFeatureById(featureId)
        const vectorJson = vectorFeature ? format.writeFeature(vectorFeature): null
        return vectorJson ? vectorJson : null 
    }
}
export {getMapGeoData, renderGeoData, getFeatureGeoData, renderGeoDataCollections}

//markJson
// {"type":"FeatureCollection",
// "features":[
//     {
//         "type":"Feature",
//         "geometry":{
//             "type":"Point",
//             "coordinates":
//                 [120.42297363281251,23.451854411389277]
//             },
//             "properties":{
//                 "name":"Spot",
//                 "type":"spot",
//                 "location":[13405424.104616499,2686755.0207003043]},"id":"4afe9c92-59dc-42f8-8e88-15ce43f491aa"
//     }]}

//vectorJson
