"use client"
import React, { useRef, useState, useEffect} from 'react';
import MapContext from '@/context/MapContext';
import ToolBox from './toolComponent/ToolBox'
import TopToolBox from './toolComponent/TopToolBox'
import Map from 'ol/Map.js';
import { Zoom, ScaleLine }  from "ol/control";
import view from '@/utils/map/view';
import * as layer from '@/utils/map/layer';
import { createGeometryStyle } from '@/utils/map/feature';
import { removeDrawAndSnapInteractions, addDrawAndSnapInteractions, deleteSelectedFeature } from '@/utils/map/Interaction';
import Setting from './InfoComponent/Setting';
import MapHead from './InfoComponent/MapHead';


const MapContainer = () => {
  const mapBoxRef = useRef<HTMLDivElement>(null)
  // const scaleBarRef = useRef<HTMLDivElement>(null)
  // const zoomControlRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | undefined>()
  const colorRef = useRef("#ffcc33")
  const strokeRef = useRef(5)
  const [drawMode, setDrawMode] = useState("cursor")


  const colorChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>{
    colorRef.current = e.target.value
    if(drawMode=="LineString" || drawMode=="Polygon"  || drawMode=="Circle" ){
      removeDrawAndSnapInteractions(map);
      addDrawAndSnapInteractions(map, drawMode, e.target.value, strokeRef.current)
    }
  }
  const strokeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>{
    strokeRef.current = parseInt(e.target.value);
    if(drawMode=="LineString" || drawMode=="Polygon"  || drawMode=="Circle" ){
      removeDrawAndSnapInteractions(map);
      addDrawAndSnapInteractions(map, drawMode, colorRef.current, parseInt(e.target.value))
    }
  }

  useEffect(() => {
      // const zoom = new Zoom({
      //   className:'w-10 h-5 flex m-5 p-3'
      // });
      const scaleLine = new ScaleLine({
          bar:true,
          text:true,
          minWidth:200,
          maxWidth:300,
          className:'text-xs absolute bottom-0 left-10'
      })
      const map = new Map({
          layers: [
              layer.tileLayer, 
              layer.vectorLayer, 
              layer.markLayer],
          controls:[scaleLine],
          view: view,
      });
      map.setTarget(mapBoxRef.current || "")
      setMap(map)
      layer.vectorSource.on("addfeature",(e)=>{
        const style = createGeometryStyle(colorRef.current, strokeRef.current)
        e.feature?.setStyle(style)
      })
      // document.addEventListener("keydown",deleteSelectedFeature)

      return ()=>{
        map.setTarget("")
        // document.removeEventListener("keydown",deleteSelectedFeature)
      }
  },[])


  return (
    <MapContext.Provider value={map}>
        <div className='h-screen w-screen relative'>
            <div ref={mapBoxRef} className='h-screen w-full relative'></div>
            <MapHead />
            <ToolBox drawMode={drawMode} setDrawMode={setDrawMode} color={colorRef.current} stroke={strokeRef.current}/>
            <TopToolBox />
            <Setting colorChangeHandler={colorChangeHandler} strokeChangeHandler={strokeChangeHandler} defaultColor={colorRef.current} defaultStroke={strokeRef.current.toString()}/>
            {/* <div id="scale_bar" className='absolute left-10 bottom-10 w-fit text-xs bg-white'></div> */}
            {/* <div ref={zoomControlRef} className='w-10 h-5 absolute right-10 bottom-10'></div> */}
        </div>
    </MapContext.Provider>
  )
}

export default MapContainer