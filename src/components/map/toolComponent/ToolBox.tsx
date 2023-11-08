import React, { useState, useContext, useEffect } from 'react'
import Image from 'next/image'
import { addSpotFeature } from '@/utils/map/feature';
import { addDrawAndSnapInteractions, addSelectAndTranslateInteractions, removeDrawAndSnapInteractions, removeSelectAndTranslateInteractions} from '@/utils/map/Interaction';
import MapContext from '@/context/MapContext';

const ToolBox = ({color, stroke, drawMode, setDrawMode}) => {
  const map = useContext(MapContext);

  const drawModeController = (drawType:string) => {
    let activeMode
    //setDrawMode
      if(drawType == drawMode){
        setDrawMode("cursor")
        activeMode = "cursor"
      }else{
        setDrawMode(drawType)
        activeMode = drawType
      }
    //organize interaction
    //delete pre interaction
    if(drawMode == "mark"){
      map.un("click",addSpotFeature)
    }else if(drawMode == "cursor"){
      removeSelectAndTranslateInteractions(map)
      removeSelectAndTranslateInteractions(map)
    }else{
      removeDrawAndSnapInteractions(map)
    }
    //add new interaction
    if(activeMode == "mark"){
      map.on("click",addSpotFeature)
    }else if(activeMode == "cursor"){
      addSelectAndTranslateInteractions(map)
    }else if(activeMode == "route" || activeMode == "brush"){
      console.log("Feature coming soon")
    }else{
      addDrawAndSnapInteractions(map, activeMode, color,stroke)
    }
  }

  useEffect(()=>{
    if(drawMode=="LineString" || drawMode=="Polygon" || drawMode=="Circle"){
      removeDrawAndSnapInteractions(map)
      addDrawAndSnapInteractions(map, drawMode, color, stroke)
    }
  },[ drawMode ])

  return (
    <div className="w-[400px] h-[80px] absolute bottom-0 left-[calc(50%-200px)] bg-white gap-3 flex items-center justify-center p-5">
      <button className="w-10 h-10" style={
          drawMode == "mark"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("mark")}>
        <Image src="/icons/010-location-2.png" width={40} height={40} alt="markBtn"  />
      </button>
      <button className="w-10 h-10" style={
          drawMode == "route"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("route")}>
        <Image src="/icons/route.png" width={30} height={30} alt="routeBtn" />
      </button>
      <button className="w-10 h-10" style={
          drawMode == "LineString"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("LineString")}>
        <Image src="/icons/line.png" width={30} height={30} alt="lineBtn" />
      </button>
      <button className="w-10 h-10" style={
          drawMode == "Polygon"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("Polygon")}>
        <Image src="/icons/polyline.png" width={30} height={30} alt="polygonBtn"/>
      </button>
      <button className="w-10 h-10" style={
          drawMode == "Circle"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("Circle")}>
        <Image src="/icons/circle.png" width={30} height={30} alt="circleBtn"/>
      </button>
      <button className="w-10 h-10" style={
          drawMode == "brush"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("brush")}>
        <Image src="/icons/brush.png" width={30} height={30} alt="brushBtn" />
      </button>
    </div>
  )
}

export default ToolBox