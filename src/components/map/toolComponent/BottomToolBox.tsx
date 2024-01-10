import React,{useContext, useRef, useState} from 'react'
import Image from 'next/image'
//context
import MapContext from '@/context/MapContext';
//my module
import { markSource, tileLayer, routeSource, vectorSource, userSource } from '@/utils/map/layer'
import { getExtendCenter } from '@/utils/map/Interaction';
//ol
import XYZ from "ol/source/XYZ";
import { OSM } from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {circular} from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';
//data
import { mapStyles } from '@/data/map';

interface BottomToolBoxProps{
  currentSelectedFeature:{
    id:string,
    type:string,
  }
}
const BottomToolBox = ({currentSelectedFeature}:BottomToolBoxProps) => {
  const map = useContext(MapContext)
  const [isMapListOpen, setIsMapListOpen] = useState(false)
  const mapStyleRef = useRef("openstreetmap")
  const apiKey = "yVmiWxcsXKCQXXHSi9xb";

  const getCurrentSelectedCenter = () => {
    const currentId = currentSelectedFeature.id
    const currentType = currentSelectedFeature.type
    if(currentId!="none"){
      if(currentType=="spot"){
        return markSource.getFeatureById(currentId)?.get("location")
      }else if(currentType=="route"){
        const extend = routeSource.getFeatureById(currentId)?.getGeometry()?.getExtent()
        if(extend!=null){
          console.log(extend)
          console.log(getExtendCenter(extend))
          return getExtendCenter(extend)
        }
      }else if(currentType=="linestring"||currentType=="polygon"){
        const extend = vectorSource.getFeatureById(currentId)?.getGeometry()?.getExtent()
        if(extend!=null){
          return getExtendCenter(extend)
        }
      }else if(currentType=="circle"){
        return vectorSource.getFeatureById(currentId)?.get("center")
      }
    }
    return null
  }
  const locateUser = () => {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        const accuracy = circular(coords, pos.coords.accuracy);
        userSource.clear(true);
        userSource.addFeatures([
          new Feature(
            accuracy.transform('EPSG:4326', map.getView().getProjection())
          ),
          new Feature(new Point(fromLonLat(coords))),
        ]);
      },
      function (error) {
        alert(`ERROR: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
      }
    );
    
    if (!userSource.isEmpty()) {
      map.getView().fit(userSource.getExtent(), {
        maxZoom: 18,
        duration: 500,
      });
    }
  }
  const zoomIn = () => {
    const center = getCurrentSelectedCenter()
    center!=null?map.getView().setCenter(center):null

    const zoom = map.getView().getZoom()
    map.getView().setZoom(zoom+1)
  }
  const zoomOut = () => {
    const center = getCurrentSelectedCenter()
    center!=null?map.getView().setCenter(center):null

    const zoom = map.getView().getZoom()
    map.getView().setZoom(zoom-1)
  }
  const setBaseMap = (style:string) => {
    mapStyleRef.current = style
    if(style=="openstreetmap"){
      tileLayer.setSource(new OSM())
    }else{
      const styleName = style=="bright"?"bright-v2"
                    :style=="outdoor"?"outdoor-v2"
                    :style=="light"?"basic-v2-light"
                    :style=="dark"?"basic-v2-dark"
                    :style=="dataviz"?"dataviz"
                    :null
      const baseUrl = `https://api.maptiler.com/maps/${styleName}/{z}/{x}/{y}.png?key=${apiKey}`
      const tileSource = new XYZ({
        url: baseUrl,
        tileSize:512,
        attributions:['<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>']
      })
      tileLayer.setSource(tileSource)
    }
    setIsMapListOpen(()=>false)
  }

  return (
    <div className='w-fit h-20 z-10 absolute bottom-3 right-8 flex gap-8 items-center'>
      <button onClick={()=>{locateUser()}}>
        <Image 
          src={'/icons/navigate-48.png'}
          width={25}
          height={25}
          alt="locate_button"
        />
      </button>
      <button onClick={()=>{zoomOut()}}>
        <Image 
          src={'/icons/subtract-60.png'}
          width={25}
          height={25}
          alt="zoom_out_button"
        />
      </button>
      <button onClick={()=>{zoomIn()}}>
        <Image 
          src={'/icons/plus-60.png'}
          width={25}
          height={25}
          alt="zoom_in_button"
        />
      </button>
      {isMapListOpen?
        <div className='w-fit h-fit flex flex-col gap-2 absolute bottom-[80px] right-[0px]'>
          {mapStyles.map((mapStyle,i)=>{
            const display = mapStyle==mapStyleRef.current?"none":"block"
            const color = mapStyle=="dark"?"white":"black"
            const displayName = mapStyle=="openstreetmap"?"OSM":mapStyle.toUpperCase()
            return <button className='w-16 h-16 rounded-md bg-transparent border-[1.5px] border-emerald-950 relative' style={{display: display}} onClick={()=>setBaseMap(mapStyle)} key={i}>
            <div className='w-16 h-16 absolute top-0 opacity-0 hover:opacity-100 transition-opacity z-10'>
              <p className='text-[10px] leading-[64px] text-center' style={{color:color}}>{displayName}</p>
            </div>
            <Image
              style={{borderRadius:"3px", zIndex:'0'}} 
              src={`/images/baseMapThumbnail/${mapStyle}.png`}
              fill
              sizes='64px'
              alt={`${mapStyle}_base`}
            />
          </button>
          })}
          
        </div>:null
      }
      
      <button className='w-16 h-16 rounded-md bg-transparent border-2 border-emerald-950 relative' onClick={()=>setIsMapListOpen(()=>!isMapListOpen)}>
        <div className='w-16 h-16 absolute top-0 opacity-0 hover:opacity-100 transition-opacity z-10'>
            <p className='text-[10px] leading-[64px] text-center'>{mapStyleRef.current=="openstreetmap"?"OSM":mapStyleRef.current.toUpperCase()}</p>
        </div>
        <Image 
            style={{borderRadius:"5px"}}
            src={`/images/baseMapThumbnail/${mapStyleRef.current}.png`}
            fill
            sizes='64px'
            alt={`${mapStyleRef.current}_base`}
            priority={true}
          />
      </button>
    </div>
  )
}

export default BottomToolBox