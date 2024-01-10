"use client"
import { usePathname } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react';
import MapContext from '@/context/MapContext';
//module
import { v4 as uuid } from 'uuid';
import { JsonValue } from '@prisma/client/runtime/library';
//Component
import MapHead from './InfoComponent/MapHead';
import SpotInfo from './InfoComponent/SpotInfo';
import RouteInfo from './InfoComponent/RouteInfo';
import GeometryInfo from './InfoComponent/GeometryInfo';
import BottomToolBox from './toolComponent/BottomToolBox';
import ToolBox from './toolComponent/ToolBox';
import TopToolBox from './toolComponent/TopToolBox';
import OptionToolBox from './toolComponent/optionToolBox';
import ImagePreview from '../image/ImagePreview';
////ol
import Map from 'ol/Map.js';
import { ScaleLine }  from "ol/control";
import { DragPan, MouseWheelZoom } from "ol/interaction";
import { Select, Translate } from 'ol/interaction.js';
import { Style, Icon } from "ol/style.js";
import { LineString, Polygon, Circle} from "ol/geom";
import { toLonLat, fromLonLat } from 'ol/proj';
////my module
import view from '@/utils/map/view';
import { tileLayer, vectorSource, vectorLayer, markLayer, markSource, routeLayer, routeSource, selectedLayer, selectedSource, userLayer, searchLayer } from '@/utils/map/layer';
import { createGeometryStyle, createRouteStyle, addSpotFeature, spotStyle, addStyleToPreSelectedFeature } from '@/utils/map/feature';
import { removeDrawAndSnapInteractions, addDrawAndSnapInteractions, setSelectedFeatureBoundary, addDrawRouteAndSnapInteractions } from '@/utils/map/Interaction';
import { renderGeoDataCollections } from '@/utils/geoData';
import { userLayerStyle } from '@/utils/map/style';
import AlertBox_M from '../message/AlertBox_M';
import SuccessBox from '../message/SuccessBox';
import FailBox from '../message/FailBox';
import ProcessBox from '../message/ProcessBox';

type mapGeoInfoOutputType = {
  center: number[],
  zoom: number,
  isPublic: boolean,
  spots: { geoData: JsonValue; }[],
  routes: { geoData: JsonValue; }[],
  geometrys: { geoData: JsonValue; }[],
}
interface MapProps {
  data: mapGeoInfoOutputType 
}
const MapContainer = ({data}:MapProps) => {
  const mapId = usePathname().split("/")[2]
  const mapBoxRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | undefined>()
  const [mapStatus, setMapStatus] = useState(false)
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
  const [isimagePreviewOpen, setIsImagePreviewOpen] = useState<Boolean>(false)
  const currentImageTargetRef = useRef<curretnImageTargetType>({type:"", id:"", isNew:true})
  const [message, setMessage] = useState({type:"",content:""})

  const [currentId, setCurrentId] = useState<string>("")
  const [currentStatus, setCurrentStatus] = useState<currentStatusType>("none")
  const [currentItemType, setCurrentItemType] = useState<currentItemType>("none")
  const [isSeleted, setIsSelected] = useState(false)
  const [mapImage, setMapImage] = useState({id:"",url:""})
  const [spotImage, setSpotImage] = useState({id:"",url:""})
  const [routeImage, setRouteImage] = useState({id:"",url:""})

  const changeColorRef = (newColor:string) =>{
    colorRef.current = newColor
    if(drawMode=="LineString" || drawMode=="Polygon"  || drawMode=="Circle" ){
        removeDrawAndSnapInteractions(map)
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
  const setCurrentMessage = (type:string, content:string) => {
    setMessage(()=>{
      return {
        type: type,
        content: content,
      }
    })
  }
  const closeMessageBox = () => {
    setMessage(()=>{
      return {
        type:"",
        content:""
      }
    })
  }
  const toggleMapStatus = (goPublic:boolean) => {
    setMapStatus(()=>goPublic)
  }
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
  const openImagePreview = (type:ImageTargetType, id:string, isNew:Boolean) => {
    setIsImagePreviewOpen(()=>true)
    currentImageTargetRef.current = {type:type, id:id, isNew:isNew} 
  } 
  const closeImagePreview = () => {
    setIsImagePreviewOpen(()=>false)
    currentImageTargetRef.current = {type:"", id:"", isNew:true}
  }
  const resetIsGeometryMoved =() => {
    setIsGeometryMoved(()=>false)
  }
  const saveMapData = (map:Map) => {
    setMessage(()=>{
      return {type:"process",content:"Saving the current view..."}
      })
    const center = map.getView().getCenter()
    const lnglatCenter = center?toLonLat(center):[120,24]
    const zoom = map.getView().getZoom()
    const body = {
      mapId: mapId,
      mapData: {
        zoom: zoom,
        center: lnglatCenter,
        geo_data: null
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
    .then(result=>{
      if(result.success){
        setMessage(()=>{
        return {type:"success",content:"Successfully save the view!"}
        })
      }else{
        setMessage(()=>{
          return {type:"fail",content:"Something wrong, please try again"}
          })
      }
    })
    .catch((e)=>{
      console.log(e)
      setMessage(()=>{
        return {type:"fail",content:"Something wrong, please try again"}
        })
    })
    .finally(()=>{
      setTimeout(()=>{
        setMessage(()=>{
          return {type:"",content:""}
          })
      },2000)
    })
  }
  const setImage = (type:string, imageData:{id:string, url:string}) => {
    type=="map"?setMapImage(()=>{
      return imageData
    })
    :type=="spot"?setSpotImage(()=>{
      return imageData
    })
    :type=="route"?setRouteImage(()=>{
      return imageData
    })
    :null
  }

  useEffect(() => {
    const {center, zoom, isPublic, spots, routes, geometrys} = data
    const geoDataCollections = {
      geometrys:geometrys,
      routes:routes,
      spots:spots,
    }
    setMapStatus(()=>isPublic)
    isRenderingDataFromDBRef.current = true
    renderGeoDataCollections(geoDataCollections)
    view.setCenter(fromLonLat(center))
    view.setZoom(zoom)
    isRenderingDataFromDBRef.current = false
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
    userLayer.setStyle(userLayerStyle)
    const map = new Map({
        layers: [
            tileLayer, 
            vectorLayer, 
            markLayer,
            routeLayer,
            selectedLayer,
            userLayer,
            searchLayer
          ],
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
          return [departCoor, destinationCoor]
        })
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
        changeSpotLocation(toLonLat(feature.get("location")))
        setCurrentStatus(()=>"new")
        map.un("click", addSpotFeature)
        setDrawMode("hand")
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
        setIsGeometryMoved(()=>true)
      }
    });
    return ()=>{
      isRenderingDataFromDBRef.current = true
      map.setTarget("")
    }
  },[mapId])

  const cursorStyle = drawMode=="hand"?"grab"
                      :drawMode=="mark"||drawMode=="route"?"crosshair"
                      :"auto"
  return (
    <MapContext.Provider value={map}>
        <div className='h-screen w-screen relative' style={{cursor:cursorStyle}}>
            {message.type=="publicAlert"?<AlertBox_M message={message.content} closeMessageBox={closeMessageBox}/>
            :message.type=="success"?<SuccessBox message={message.content} />
            :message.type=="error"?<FailBox message={message.content} />
            :message.type=="process"?<ProcessBox title={"Saving view"} message={message.content} />
            :null}

            <ImagePreview target={currentImageTargetRef.current} isShow={isimagePreviewOpen} closeImagePreview={closeImagePreview} setImage={setImage}/>

            <div ref={mapBoxRef} className='h-screen w-full relative'></div>
            <MapHead openImagePreview={openImagePreview} mapImage={mapImage} setImage={setImage}/>
            <div className='w-[400px] h-[75px] absolute bottom-3 left-[calc(50%-250px)] flex items-center justify-end gap-3'>
              {currentSelectedFeatureRef.current.type!="none"?<OptionToolBox currentSelected={currentSelectedFeatureRef.current} resetCurrentSelectedFeature={resetCurrentSelectedFeature} changeCurrentItemType={changeCurrentItemType}/>:<></>}
              <ToolBox drawMode={drawMode} changeDrawMode={changeDrawMode} changeCurrentItemType={changeCurrentItemType} changeCurrentStatus={changeCurrentStatus} changeCurrentId={changeCurrentId} color={colorRef.current} stroke={strokeRef.current} preSelectedFeature={preSelectedFeatureRef.current}/>
            </div>
            
            <TopToolBox mapStatus={mapStatus} mapId={mapId} setMessage={setCurrentMessage} toggleMapStatus={toggleMapStatus} saveView={saveMapData}/>
            {currentItemType!="none" && (
              currentItemType=="spot"?<SpotInfo id={currentId} status={currentStatus} spotImage={spotImage} setImage={setImage} spotLocation={spotLocation} changeSpotLocation={changeSpotLocation} setCurrentSelectedFeature={setCurrentSelectedFeature} openImagePreview={openImagePreview} />:
              currentItemType=="route"?<RouteInfo id={currentId} status={currentStatus} routeImage={routeImage} setImage={setImage} changeRouteRefHandler={changeRouteRef} edgeLocation={routeEdgeLocation} changeRouteEdgeLocation={changeEdgeLocation} setCurrentSelectedFeature={setCurrentSelectedFeature} openImagePreview={openImagePreview} />:
              currentItemType=="linestring" || currentItemType=="polygon" || currentItemType=="circle"?<GeometryInfo id={currentId} status={currentStatus} type={currentItemType} color={colorRef.current} stroke={strokeRef.current} changeColorRefHandler={changeColorRef} changeStrokeRefHandler={changeStrokeRef} setCurrentSelectedFeature={setCurrentSelectedFeature} isMoved={isGeometryMoved} resetIsMoved={resetIsGeometryMoved}/>:
              <></>
            )
            }
            <BottomToolBox currentSelectedFeature={currentSelectedFeatureRef.current}/>
            
        </div>
    </MapContext.Provider>
  )
}

export default MapContainer