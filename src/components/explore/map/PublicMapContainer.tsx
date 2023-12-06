'use client'
import React, {useState, useRef, useEffect} from 'react'
import { usePathname } from 'next/navigation'
import MapContext from '@/context/MapContext';
import { useSession } from 'next-auth/react';
//
import MapHead from './infoComponent/MapHead';
import BottomToolBox from './toolComponent/BottomToolBox';
import TopToolBox from './toolComponent/TopToolBox';
import AlertBox from '@/components/message/AlertBox';
import SuccessBox from '@/components/message/SuccessBox';
import FailBox from '@/components/message/FailBox';
////ol
import Map from 'ol/Map.js';
import { Zoom, ScaleLine }  from "ol/control";
import { DragPan, MouseWheelZoom, defaults as defaultInteraction } from "ol/interaction";
import { Select } from 'ol/interaction.js';
import { toLonLat, fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Icon } from "ol/style.js";
////my module
import view from '@/utils/map/view';
import { tileLayer, vectorSource, vectorLayer, markLayer, markSource, routeLayer, routeSource, selectedLayer, selectedSource, userLayer} from '@/utils/map/layer';
import { createGeometryStyle, createRouteStyle } from '@/utils/map/feature';
import { userLayerStyle } from '@/utils/map/style';
import { setSelectedFeatureBoundary } from '@/utils/map/Interaction';
import { renderGeoDataCollections } from '@/utils/geoData';
import SpotInfo from './infoComponent/SpotInfo';
import RouteInfo from './infoComponent/RouteInfo';
import GeometryInfo from './infoComponent/GeometryInfo';

interface PublicMapProps{
    geoData:{
        center:number[],
        zoom:number,
        spots:{ geoData: string }[],
        routes:{ geoData: string }[],
        geometrys:{ geoData: string }[],
        isLiked:boolean
    },
    mapData:mapDataType,
}
const PublicMapContainer = ({geoData, mapData}: PublicMapProps) => {
    const {data:session} = useSession()
    const userId = session?session.user.id:""
    const mapId = usePathname().split("/")[3]
    const mapBoxRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<Map | undefined>()
    const currentSelectedFeatureRef = useRef<selectedFeature>({type:"none", id:""})
    const [isLiked, setIsLiked] = useState(false)
    const [message, setMessage] = useState({type:"",content:""})

    const [currentId, setCurrentId] = useState<string>("")
    const [currentStatus, setCurrentStatus] = useState<currentStatusType>("none")
    const [currentItemType, setCurrentItemType] = useState<currentItemType>("none")
    const [isSeleted, setIsSelected] = useState(false)

    const toggleIsLiked = (like:boolean) => {
        like?setIsLiked(()=>true):setIsLiked(()=>false)
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
    const changeCurrentItemType = (newItemType:currentItemType) => {
        setCurrentItemType(()=>newItemType)
    }

    useEffect(()=>{
        console.log("Map loaded")
        // fetch(`/api/public/map/${mapId}?user=${userId}`)
        // .then((res)=>res.json())
        // .then((data)=>{
        //     console.log(data)
        //     const {center, zoom, spots, routes, geometrys, isLiked} = data
        //     const geoDataCollections = {
        //     geometrys:geometrys,
        //     routes:routes,
        //     spots:spots,
        //     }
        //     setIsLiked(()=>isLiked)
        //     renderGeoDataCollections(geoDataCollections)
        //     view.setCenter(fromLonLat(center))
        //     view.setZoom(zoom)
        // })
        // .catch((e)=>console.log(e))
        const {center, zoom, spots, routes, geometrys, isLiked} = geoData
        const geoDataCollections = {
        geometrys:geometrys,
        routes:routes,
        spots:spots,
        }
        setIsLiked(()=>isLiked)
        renderGeoDataCollections(geoDataCollections)
        view.setCenter(fromLonLat(center))
        view.setZoom(zoom)
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
        userLayer.setStyle(userLayerStyle)
        const map = new Map({
            layers: [
                tileLayer, 
                vectorLayer, 
                markLayer,
                routeLayer,
                selectedLayer,
                userLayer
            ],
            controls:[scaleLine],
            interactions:[new DragPan, new MouseWheelZoom, select],
            view: view,
        });
        select.on('select',(e)=>{
            if(e.selected.length>0){
              const id = e.selected[0].getId()
              const type = e.selected[0].getProperties().type
              //preSelectedFeatureRef.current={type:type, id:id}
              if(id){
                currentSelectedFeatureRef.current={type:type, id:id.toString()}
                setIsSelected(()=>true)
                setCurrentId(()=>id.toString())
                //console.log(currentSelectedFeatureRef.current)
                setCurrentStatus(()=>"old")
                setCurrentItemType(()=>type)
                //add squere to current shape
              }
              
              if (type!="spot"){
                const extent = e.selected[0].getGeometry()?.getExtent()
                setSelectedFeatureBoundary(extent)
              }else{
                selectedSource.clear()
              }
            }else{
              selectedSource.clear()
              changeCurrentItemType("none")
              //addStyleToPreSelectedFeature(preSelectedFeatureRef.current)
              //addStyleToPreSelectedFeature(currentSelectedFeatureRef.current)
              currentSelectedFeatureRef.current={type:"none", id:""}
              setIsSelected(()=>false)
            }
            // console.log("SELECT")
          });
        map.setTarget(mapBoxRef.current || "")
        setMap(map)
        return ()=>{
            map.setTarget("")
        }
    },[mapId])
  return (
    <MapContext.Provider value={map}>
        <div className='h-screen w-screen relative cursor-pointer'>
            {message.type=="alert"?<AlertBox message={message.content} closeMessageBox={closeMessageBox}/>
            :message.type=="success"?<SuccessBox message={message.content} />
            :message.type=="error"?<FailBox message={message.content} />
            :null}
            <div ref={mapBoxRef} className='h-screen w-full relative'></div>
            <MapHead mapData={mapData}/>
            <TopToolBox isLiked={isLiked} mapId={mapId} userId={userId} setMessage={setCurrentMessage} toggleIsLiked={toggleIsLiked}/>
            <BottomToolBox currentSelectedFeature={currentSelectedFeatureRef.current}/>

            {currentItemType!="none" && (
                currentItemType=="spot"?<SpotInfo id={currentId}/>:
                currentItemType=="route"?<RouteInfo id={currentId}/>:
                currentItemType=="linestring" || currentItemType=="polygon" || currentItemType=="circle"?<GeometryInfo id={currentId} type={currentItemType}/>:<></>
            )}
        </div>
    </MapContext.Provider>
    
  )
}

export default PublicMapContainer