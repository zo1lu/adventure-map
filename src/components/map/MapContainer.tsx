"use client"
import { usePathname } from 'next/navigation'
import React, { useRef, useState, useEffect} from 'react';
import MapContext from '@/context/MapContext';
//module
import { v4 as uuid } from 'uuid';
//Component
import MapHead from './InfoComponent/MapHead';
import SpotInfo from './InfoComponent/SpotInfo';
import RouteInfo from './InfoComponent/RouteInfo';
import GeometryInfo from './InfoComponent/GeometryInfo';
import BottomToolBox from './toolComponent/BottomToolBox';
import ToolBox from './toolComponent/ToolBox';
import TopToolBox from './toolComponent/TopToolBox';
////type
import { Coordinate} from 'openlayers';
////ol
import Map from 'ol/Map.js';
import { Zoom, ScaleLine }  from "ol/control";
import { DragPan, MouseWheelZoom, defaults as defaultInteraction } from "ol/interaction";
import { Select, Translate, Link } from 'ol/interaction.js';
import { Style, Fill, Stroke, Icon } from "ol/style.js";
import {Point, LineString, Polygon, Circle} from "ol/geom";
import { toLonLat, fromLonLat } from 'ol/proj';
////my module
import view from '@/utils/map/view';
import { tileLayer, vectorSource, vectorLayer, markLayer, markSource, routeLayer, routeSource, selectedLayer, selectedSource } from '@/utils/map/layer';
import { createGeometryStyle, createRouteStyle, addSpotFeature, spotStyle } from '@/utils/map/feature';
import { removeDrawAndSnapInteractions, addDrawAndSnapInteractions, toggleHandMapInteraction, setFeatureSelectedById, setSelectedFeatureBoundary } from '@/utils/map/Interaction';
import { getMapGeoData, renderGeoData } from '@/utils/geoData';
import { geoDataType } from '@/data/infoType';
////Not in use
import GeoJSON from 'ol/format/GeoJSON.js';
import { JsonValue } from '@prisma/client/runtime/library';
// const data = require('../../../fake_data/test_geo_data.json');

type mapGeoInfoOutputType = {
  center: number[],
  zoom: number,
  geoData: geoDataType
}
interface MapProps {
  mapGeoInfo: mapGeoInfoOutputType 
}
//{mapGeoInfo}:MapProps
const MapContainer = ({mapGeoInfo}:MapProps) => {
  const {center, zoom, geoData} = mapGeoInfo
  const mapId = usePathname().split("/")[2]
  const mapBoxRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef(null)
  // const scaleBarRef = useRef<HTMLDivElement>(null)
  // const zoomControlRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | undefined>()
  const colorRef = useRef("#ffcc33")
  const strokeRef = useRef(5)
  const routeRef = useRef<routeType>("walk")
  const [routeEdgeLocation, setRouteEdgeLocation] = useState<edgeLocationType>([[0,0],[0,0]]) 
  const [spotLocation, setSpotLocation] = useState<spotLocationType>([0,0])
  const [drawMode, setDrawMode] = useState<drawModeType>("cursor")
  const [currentItem, setCurrentItem] = useState<currentItemObject>({
    status:"none",
    id:"",
    type:"none",
  })
  

  const changeColorRef = (newColor:string) =>{
    colorRef.current = newColor
    if(drawMode=="LineString" || drawMode=="Polygon"  || drawMode=="Circle" ){
      removeDrawAndSnapInteractions(map);
      addDrawAndSnapInteractions(map, drawMode, newColor, strokeRef.current)
    }
  }
  const changeStrokeRef = (newStroke:number) =>{
    strokeRef.current = newStroke;
    if(drawMode=="LineString" || drawMode=="Polygon"  || drawMode=="Circle" ){
      removeDrawAndSnapInteractions(map);
      addDrawAndSnapInteractions(map, drawMode, colorRef.current, newStroke)
    }
  }
  
  const changeRouteRef = (routeType:routeType) =>{
    routeRef.current = routeType
  }

  const changeDrawMode = (drawMode:drawModeType) => {
    setDrawMode(()=>drawMode)
  }

  const changeCurrentItem = (newItem:currentItemObject) => {
    setCurrentItem((current)=>{
      return {...current, ...newItem}
    })
  }
  const changeEdgeLocation = (newEdgeLocation:edgeLocationType) => {
    setRouteEdgeLocation(()=>newEdgeLocation)
  }
  const changeSpotLocation = (newSpotLocation:spotLocationType) => {
    setSpotLocation(()=>newSpotLocation)
  }
  const saveMapData = (map:Map) => {
    const centerCoor = map.getView().getCenter()
    const center = centerCoor? toLonLat(centerCoor):[120,24]
    const zoom = map.getView().getZoom()
    const geoData = getMapGeoData()
    const body = {
      mapId: mapId,
      mapData: {
        zoom: zoom,
        center: center,
        geo_data:geoData
      }
    }
    console.log(body)
    fetch("/api/map?type=geo",{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(res=>console.log(res))
    .catch((e)=>console.log(e))
  }
  useEffect(() => {
      // const zoom = new Zoom({
      //   className:'w-10 h-5 flex m-5 p-3'
      // });
      console.log("Map loaded")
      const scaleLine = new ScaleLine({
          bar:true,
          text:true,
          minWidth:200,
          maxWidth:300,
          className:'text-xs absolute bottom-0 left-10'
      })
      
      const select = new Select({
        layers: [vectorLayer, markLayer, routeLayer],
        hitTolerance:20,
        style:function(feature){
          const type = feature.get('type')
          if(type=="spot"){
            return new Style({
              image: new Icon({
                anchor: [0.5, 0.9],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                scale: 0.7,
                src: "/icons/location-56-selected.png",
              })
            })
          }else if(type=="route"){
            return createRouteStyle(feature.get("route_type"))
          }else{
            return createGeometryStyle(feature.get("color"),feature.get("stroke"))
          }
        }
      });
      const translate = new Translate({
        features: select.getFeatures()
      })
      
      
      

      select.setActive(false)
      translate.setActive(false)
      view.setCenter(fromLonLat(center))
      view.setZoom(zoom)
      const map = new Map({
          layers: [
              tileLayer, 
              vectorLayer, 
              markLayer,
              routeLayer,
              selectedLayer],
          controls:[scaleLine],
          interactions:[new DragPan, new MouseWheelZoom, select, translate],
          view: view,
      });
      map.setTarget(mapBoxRef.current || "")
      setMap(map)
      if(geoData){
        console.log(geoData)
        renderGeoData(geoData)
      }
      //set feature style and id when add feature into source
      vectorSource.on("addfeature",(e)=>{
        const style = createGeometryStyle(colorRef.current, strokeRef.current)
        const color = colorRef.current
        const stroke = strokeRef.current
        const feature = e.feature
        if(feature?.getGeometry() instanceof LineString){
          feature.setProperties({
            "type":"linestring",
            "color":color,
            "stroke":stroke
          })
        }else if(feature?.getGeometry() instanceof Polygon){
          feature.setProperties({
            "type":"polygon",
            "color":color,
            "stroke":stroke
          })
        }else if(feature?.getGeometry() instanceof Circle){
          const center = feature?.getGeometry().getCenter()
          const radius = feature?.getGeometry().getRadius()
          feature.setProperties({
            "type":"circle",
            "color":color,
            "stroke":stroke,
            "center":center,
            "radius":radius
          })
        }
        
        e.feature?.setStyle(style)
        const id = uuid()
        e.feature?.setId(id)
        setCurrentItem((current)=>{
          return {...current, status:"new", id:id}
        })
        removeDrawAndSnapInteractions(map)
        setDrawMode("cursor")
        console.log("add geometry")
        console.log(e.feature?.getProperties())
      });
      routeSource.on("addfeature",(e)=>{
        const coordinates = e.feature?.getGeometry().flatCoordinates
        const coorLength = coordinates.length
        const departCoor = toLonLat([coordinates[0],coordinates[1]])
        const destinationCoor = toLonLat([coordinates[coorLength-2],coordinates[coorLength-1]])
        const routeStyle = createRouteStyle(routeRef.current)
        e.feature?.setProperties({
          "type":"route",
          "route_type":routeRef.current,
          "depart":departCoor,
          "destination":destinationCoor})
        e.feature?.setStyle(routeStyle)
        const id = uuid()
        e.feature?.setId(id)
        setCurrentItem((current)=>{
          return {...current, status:"new", id:id}
        })
        setRouteEdgeLocation(()=>{
          return [departCoor, destinationCoor]})
        removeDrawAndSnapInteractions(map)
        setDrawMode("cursor")
        console.log(e.feature?.getProperties())
        console.log(e.feature?.getRevision())
      })
      markSource.on("addfeature",(e)=>{
        const feature = e.feature
        const id = uuid()
        feature.setId(id)
        feature.setStyle(spotStyle)
        setCurrentItem((current)=>{
          return {...current, status:"new", id:id}
        })
        map.un("click",addSpotFeature)
        setDrawMode("cursor")
        console.log("add mark")
      });
      //Select Interaction
      select.on('select',(e)=>{
        if(e.selected.length>0){
          const id = e.selected[0].getId()
          const type = e.selected[0].getProperties().type
          console.log(id)
          console.log(e.selected[0].getProperties())
          setCurrentItem((current)=>{
            return {...current, status:"old", id:id, type:type}
          })

          //add squere to current shape
          if (type!="spot"){
            const extent = e.selected[0].getGeometry()?.getExtent()
            setSelectedFeatureBoundary(extent)
          }
        }else{
          selectedSource.clear()
        }
        console.log("SELECT")
      });
      translate.on("translating",(e)=>{
        const type = e.features.item(0).getProperties().type
        if(type!="spot"){
          const extent = e.features.item(0).getGeometry()?.getExtent()
          setSelectedFeatureBoundary(extent)
        }
        

      });
      translate.on("translateend",(e)=>{
        const feature = e.features.item(0)
        const type = feature.get("type")
        const currentProperties = feature.getProperties()
        if (type == "route"){
          const coordinates = feature.getGeometry().flatCoordinates
          const length = coordinates.length
          const departCoor = toLonLat([coordinates[0],coordinates[1]])
          const destinationCoor = toLonLat([coordinates[length-2],coordinates[length-1]])
          feature.setProperties({...currentProperties, depart:departCoor, destination:destinationCoor})
          setRouteEdgeLocation(()=>{
            return [departCoor, destinationCoor]})
        }else if (type == "spot"){
          const currentCoordinates = feature.getGeometry().flatCoordinates
          feature.setProperties({...currentProperties,location:currentCoordinates})
          setSpotLocation(()=>{
            return toLonLat(currentCoordinates)
          })
        }
      });
      // const deleteSelectedFeature = (e) =>{
      //   if(e.code == "Delete" || e.code == "Backspace"){
      //     console.log("delete feature")
      //     vectorSource.removeFeature(select.getFeatures().item(0))
      //     markSource.removeFeature(select.getFeatures().item(0))
      //     routeSource.removeFeature(select.getFeatures().item(0))
      //   }
      // }
      // document.addEventListener("keydown",deleteSelectedFeature)
      
      return ()=>{
        
        //update map geo data
        // const centerCoor = map.getView().getCenter()
        // const center = centerCoor? toLonLat(centerCoor):[120,24]
        // const zoom = map.getView().getZoom()
        // const geoData = getMapGeoData(map)
        // const body = {
        //   mapId: mapId,
        //   mapData: {
        //     zoom: zoom,
        //     center: center,
        //     geo_data:geoData
        //   }
        // }
        // console.log(body)
        // fetch("/api/map?type=geo",{
        //   method:"PATCH",
        //   headers:{
        //     "Content-Type":"application/json"
        //   },
        //   body:JSON.stringify(body)
        // })
        // .then(res=>res.json())
        // .then(res=>console.log(res))
        // .catch((e)=>console.log(e))
        map.setTarget("")
        console.log("Map Unload")
        // document.removeEventListener("keydown",deleteSelectedFeature)
      }
  },[])


  return (
    <MapContext.Provider value={map}>
        <div className='h-screen w-screen relative'>
            <div ref={mapBoxRef} className='h-screen w-full relative'></div>
            <MapHead />
            <ToolBox drawMode={drawMode} changeDrawMode={changeDrawMode} changeCurrentItem={changeCurrentItem} color={colorRef.current} stroke={strokeRef.current}/>
            <TopToolBox save={saveMapData}/>
            {currentItem.status!="none" && (
              currentItem?.type=="spot"?<SpotInfo item={currentItem} spotLocation={spotLocation} changeSpotLocation={changeSpotLocation}/>:
              currentItem?.type=="route"?<RouteInfo item={currentItem} changeRouteRefHandler={changeRouteRef} edgeLocation={routeEdgeLocation} changeRouteEdgeLocation={changeEdgeLocation}/>:
              currentItem?.type=="linestring" || currentItem?.type=="polygon" || currentItem?.type=="circle"?<GeometryInfo item={currentItem} color={colorRef.current} stroke={strokeRef.current} changeColorRefHandler={changeColorRef} changeStrokeRefHandler={changeStrokeRef}/>:
              <></>
            )
            }
            {/* <button className='w-fit h-10 bg-white absolute bottom-3 left-3' onClick={()=>{getMapGeoData()}}>show geo data</button> */}

            {/* {sideInfoStatus=="palette"?
            <DrawSetting colorChangeHandler={colorChangeHandler} strokeChangeHandler={strokeChangeHandler} defaultColor={colorRef.current} defaultStroke={strokeRef.current.toString()}/>:
            sideInfoStatus=="spot"?<SpotInfo />:
            sideInfoStatus=="route"?<RouteInfo />:<GeometrySetting geometry={"Circle"} />} */}
            {/* <button className='w-fit h-10 bg-white absolute bottom-3 left-3' onClick={()=>{setSideInfoStatus("palette")}}>Pallete</button>
            <button className='w-fit h-10 bg-white absolute bottom-3 left-20' onClick={()=>{setSideInfoStatus("route")}}>route</button>
            <button className='w-fit h-10 bg-white absolute bottom-3 left-40' onClick={()=>{setSideInfoStatus("spot")}}>spot</button> */}
            {/* <div id="scale_bar" className='absolute left-10 bottom-10 w-fit text-xs bg-white'></div> */}
            {/* <div ref={zoomControlRef} className='w-10 h-5 absolute right-10 bottom-10'></div> */}
            <BottomToolBox />
            
        </div>
    </MapContext.Provider>
  )
}

export default MapContainer