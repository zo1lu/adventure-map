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
import OptionToolBox from './toolComponent/optionToolBox';
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
import { createGeometryStyle, createRouteStyle, addSpotFeature, spotStyle, addStyleToPreSelectedFeature } from '@/utils/map/feature';
import { removeDrawAndSnapInteractions, addDrawAndSnapInteractions, toggleHandMapInteraction, setFeatureSelectedById, setSelectedFeatureBoundary, addDrawRouteAndSnapInteractions } from '@/utils/map/Interaction';
import { getMapGeoData, renderGeoData, renderGeoDataCollections } from '@/utils/geoData';
import { geoDataType } from '@/data/infoType';
////Not in use
import GeoJSON from 'ol/format/GeoJSON.js';
import { JsonValue } from '@prisma/client/runtime/library';
import { UUID } from 'crypto';
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
const MapContainer = () => {
  // const {center, zoom, geoData} = mapGeoInfo
  const mapId = usePathname().split("/")[2]
  const mapBoxRef = useRef<HTMLDivElement>(null)
  // const mapRef = useRef(null)
  // const scaleBarRef = useRef<HTMLDivElement>(null)
  // const zoomControlRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | undefined>()
  const colorRef = useRef("#ffcc33")
  const strokeRef = useRef(5)
  const routeRef = useRef<routeType>("walk")
  const [routeEdgeLocation, setRouteEdgeLocation] = useState<edgeLocationType>([[0,0],[0,0]]) 
  const [spotLocation, setSpotLocation] = useState<spotLocationType>([0,0])
  const [drawMode, setDrawMode] = useState<drawModeType>("cursor")
  const preSelectedFeatureRef = useRef<selectedFeature>({type:"none", id:""})
  const currentSelectedFeatureRef = useRef<selectedFeature>({type:"none", id:""})
  const [isGeometryMoved, setIsGeometryMoved] = useState(false)
  const isRenderingDataFromDBRef = useRef(true)
  // const [currentItem, setCurrentItem] = useState<currentItemObject>({
  //   status:"none",
  //   id:"",
  //   type:"none",
  // })
  
  const [currentId, setCurrentId] = useState<string>("")
  const [currentStatus, setCurrentStatus] = useState<currentStatusType>("none")
  const [currentItemType, setCurrentItemType] = useState<currentItemType>("none")
  const [isSeleted, setIsSelected] = useState(false)

  const changeColorRef = (newColor:string) =>{
    colorRef.current = newColor
    if(drawMode=="LineString" || drawMode=="Polygon"  || drawMode=="Circle" ){
      removeDrawAndSnapInteractions(map);
      addDrawAndSnapInteractions(map, drawMode, newColor, strokeRef.current)
    }else if(drawMode == "hand"){
      const geometryStyle = createGeometryStyle(newColor, strokeRef.current)
      const currentFeature = vectorSource.getFeatureById(currentId)
      currentFeature?.setStyle(geometryStyle)
      currentFeature?.set("color", newColor)
    }
  }

  const changeStrokeRef = (newStroke:number) =>{
    strokeRef.current = newStroke;
    if(drawMode=="LineString" || drawMode=="Polygon"  || drawMode=="Circle" ){
      removeDrawAndSnapInteractions(map);
      addDrawAndSnapInteractions(map, drawMode, colorRef.current, newStroke)
    }else if(drawMode == "hand"){
      const geometryStyle = createGeometryStyle(colorRef.current, newStroke)
      const currentFeature = vectorSource.getFeatureById(currentId)
      currentFeature?.setStyle(geometryStyle)
      currentFeature?.set("stroke", newStroke)
    }
  }
  
  const changeRouteRef = (routeType:routeType) =>{
    routeRef.current = routeType
    if(drawMode=="route"){
      removeDrawAndSnapInteractions(map)
      addDrawRouteAndSnapInteractions(map, routeType)
    }else if(drawMode=="hand"){
      //only when select route feature can change route ref
      const routeStyle = createRouteStyle(routeType)
      routeSource.getFeatureById(currentId)?.setStyle(routeStyle)
      routeSource.getFeatureById(currentId)?.set("route_type",routeType)

    }
  }
  const setCurrentSelectedFeature = (type:selectedFeatureType, id:string) => {
    currentSelectedFeatureRef.current= {type:type, id:id}
    setIsSelected(()=>true)
  }
  // const setPreSelectedFeature = (type:selectedFeatureType, id:string) => {
  //   preSelectedFeatureRef.current= {type:type, id:id}
  // }
  const resetCurrentSelectedFeature = () => {
    currentSelectedFeatureRef.current= {type:"none", id:""}
    setIsSelected(()=>false)
  }
  const changeDrawMode = (drawMode:drawModeType) => {
    setDrawMode(()=>drawMode)
  }
  const changeCurrentStatus = (newStatus:currentStatusType) => {
    setCurrentStatus(()=>newStatus)
  }
  const changeCurrentId = (newId:string) => {
    setCurrentId(newId)
  }
  const changeCurrentItemType = (newItemType:currentItemType) => {
    setCurrentItemType(()=>newItemType)
  }
  const changeEdgeLocation = (newEdgeLocation:edgeLocationType) => {
    setRouteEdgeLocation(()=>newEdgeLocation)
  }
  const changeSpotLocation = (newSpotLocation:spotLocationType) => {
    setSpotLocation(()=>newSpotLocation)
  }
  const resetIsGeometryMoved =() => {
    setIsGeometryMoved(()=>false)
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
  // useEffect(()=>{
  //   console.log(currentSelectedFeatureRef.current)
  //   addStyleToPreSelectedFeature(preSelectedFeatureRef.current)
  //   currentSelectedFeatureRef.current={type:"none", id:""}
  //   console.log("hi")
  // },[currentItemType])
 
  useEffect(() => {
      // const zoom = new Zoom({
      //   className:'w-10 h-5 flex m-5 p-3'
      // });
      console.log("Map loaded")
      fetch(`/api/map/${mapId}?type=geodatacollections`)
      .then((res)=>res.json())
      .then((data)=>{
        console.log(data)
        const {center, zoom, spots, routes, geometrys} = data
        const geoDataCollections = {
          geometrys:geometrys,
          routes:routes,
          spots:spots,
        }
        renderGeoDataCollections(geoDataCollections)
        view.setCenter(fromLonLat(center))
        view.setZoom(zoom)
        isRenderingDataFromDBRef.current = false
      })
      .catch((e)=>console.log(e))
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
    //set feature style and id when add feature into source
    vectorSource.on("addfeature",(e)=>{
      if(!isRenderingDataFromDBRef.current){
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
        setCurrentId(()=>id)
        setCurrentStatus(()=>"new")
        removeDrawAndSnapInteractions(map)
        setDrawMode("hand")
      }
      
    });
    routeSource.on("addfeature",(e)=>{
      if(!isRenderingDataFromDBRef.current){
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
        setCurrentId(()=>id)
        setCurrentStatus(()=>"new")
        setRouteEdgeLocation(()=>{
          return [departCoor, destinationCoor]})
        removeDrawAndSnapInteractions(map)
        setDrawMode("hand")
      }
    })
    markSource.on("addfeature",(e)=>{
      if(!isRenderingDataFromDBRef.current){
        const feature = e.feature
        const id = uuid()
        feature.setId(id)
        feature.setStyle(spotStyle)
        setCurrentId(()=>id)
        console.log(feature?.get("location"))
        changeSpotLocation(toLonLat(feature.get("location")))
        setCurrentStatus(()=>"new")
        map.un("click", addSpotFeature)
        setDrawMode("hand")
        console.log("add mark")
      }
    });
    //Select Interaction
    select.on('select',(e)=>{
      if(e.selected.length>0){
        const id = e.selected[0].getId()
        const type = e.selected[0].getProperties().type
        preSelectedFeatureRef.current={type:type, id:id}
        currentSelectedFeatureRef.current={type:type, id:id}
        setIsSelected(()=>true)
        setCurrentId(()=>id)
        console.log(currentSelectedFeatureRef.current)
        setCurrentStatus(()=>"old")
        setCurrentItemType(()=>type)
        //add squere to current shape
        if (type!="spot"){
          const extent = e.selected[0].getGeometry()?.getExtent()
          setSelectedFeatureBoundary(extent)
        }else{
          selectedSource.clear()
        }
      }else{
        selectedSource.clear()
        changeCurrentItemType("none")
        addStyleToPreSelectedFeature(preSelectedFeatureRef.current)
        addStyleToPreSelectedFeature(currentSelectedFeatureRef.current)
        currentSelectedFeatureRef.current={type:"none", id:""}
        setIsSelected(()=>false)
      }
      console.log("SELECT")
    });
    translate.on("translating",(e)=>{
      const feature = e.features.item(0)
      const type = e.features.item(0).getProperties().type
      if(type!="spot"){
        const extent = e.features.item(0).getGeometry()?.getExtent()
        setSelectedFeatureBoundary(extent)
      }else{
        changeSpotLocation(toLonLat(feature.get("location")))
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
      }else{
        //geometry
        setIsGeometryMoved(()=>true)
      }
    });
      return ()=>{
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
            <div className='w-[400px] h-[75px] absolute bottom-3 left-[calc(50%-250px)] flex items-center justify-end gap-3'>
              {currentSelectedFeatureRef.current.type!="none"?<OptionToolBox currentSelected={currentSelectedFeatureRef.current} resetCurrentSelectedFeature={resetCurrentSelectedFeature} changeCurrentItemType={changeCurrentItemType}/>:<></>}
              <ToolBox drawMode={drawMode} changeDrawMode={changeDrawMode} changeCurrentItemType={changeCurrentItemType} changeCurrentStatus={changeCurrentStatus} changeCurrentId={changeCurrentId} color={colorRef.current} stroke={strokeRef.current} preSelectedFeature={preSelectedFeatureRef.current}
              resetCurrentSelectedFeature={resetCurrentSelectedFeature}/>
            </div>
            
            <TopToolBox save={saveMapData}/>
            {currentItemType!="none" && (
              currentItemType=="spot"?<SpotInfo id={currentId} status={currentStatus} spotLocation={spotLocation} changeSpotLocation={changeSpotLocation} setCurrentSelectedFeature={setCurrentSelectedFeature}/>:
              currentItemType=="route"?<RouteInfo id={currentId} status={currentStatus} currentMode={drawMode} changeRouteRefHandler={changeRouteRef} edgeLocation={routeEdgeLocation} changeRouteEdgeLocation={changeEdgeLocation} setCurrentSelectedFeature={setCurrentSelectedFeature} />:
              currentItemType=="linestring" || currentItemType=="polygon" || currentItemType=="circle"?<GeometryInfo id={currentId} status={currentStatus} type={currentItemType} color={colorRef.current} stroke={strokeRef.current} changeColorRefHandler={changeColorRef} changeStrokeRefHandler={changeStrokeRef} setCurrentSelectedFeature={setCurrentSelectedFeature} isMoved={isGeometryMoved} resetIsMoved={resetIsGeometryMoved}/>:
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