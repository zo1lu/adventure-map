import React, { useState, useContext, useEffect } from 'react'
import Image from 'next/image'
import { addSpotFeature } from '@/utils/map/feature';
import { addDrawAndSnapInteractions, removeDrawAndSnapInteractions, toggleHandMapInteraction, addDrawRouteAndSnapInteractions} from '@/utils/map/Interaction';
import MapContext from '@/context/MapContext';
import { selectedSource } from '@/utils/map/layer';

interface ToolBoxProps {
  color:string,
  stroke:number,
  drawMode:drawModeType,
  changeDrawMode:(drawMode:drawModeType) => void,
  changeCurrentItem:(newItem:currentItemObject) => void,
}

const ToolBox = ({color, stroke, drawMode, changeDrawMode, changeCurrentItem}:ToolBoxProps) => {
  const map = useContext(MapContext);
  //>>delete event
  const deleteFeature = (e) => {
    if(e.code == "46"){
      console.log("delete feature")
    }
  }
  //set draw mode
  const drawModeController = (drawType:drawModeType) => {
    let activeMode: drawModeType
    let activeGeometry: geometryMode
    //setDrawMode
      if(drawType == drawMode){
        changeDrawMode("cursor")
        activeMode = "cursor"
      }else{
        changeDrawMode(drawType)
        activeMode = drawType
      }
    //organize interaction
    //delete pre interaction
    if(drawMode == "mark"){
      map.un("click",addSpotFeature)
    }else if(drawMode == "hand"){
      // removeSelectAndTranslateInteractions(map)
      // removeSelectAndTranslateInteractions(map)
      toggleHandMapInteraction(map, false)
      changeCurrentItem({status:"none", id:"", type:"none"})
      selectedSource.clear()
    }else{
      removeDrawAndSnapInteractions(map)
    }
    //add new interaction
    if(activeMode == "mark"){
      map.on("click",addSpotFeature)
      changeCurrentItem({status:"queue", id:"", type:"spot"})
    }else if(activeMode == "hand"){
      // addSelectAndTranslateInteractions(map)
      toggleHandMapInteraction(map, true)
    }else if(activeMode == "route"){
      //>> what is the initial route type?
      addDrawRouteAndSnapInteractions(map, "walk")
      changeCurrentItem({status:"queue", id:"", type:"route"})
    }else if(activeMode == "brush"){
      console.log("Brush Feature coming soon")
    }else if(activeMode == "cursor"){
        console.log("Cursor")
    }else{
      activeGeometry = activeMode
      addDrawAndSnapInteractions(map, activeGeometry, color, stroke)
      changeCurrentItem({status:"queue", id:"", type:activeGeometry.toLowerCase()})
    }
  }

  useEffect(()=>{
    if(drawMode=="LineString" || drawMode=="Polygon" || drawMode=="Circle"){
      removeDrawAndSnapInteractions(map)
      addDrawAndSnapInteractions(map, drawMode, color, stroke)
    }
  },[ drawMode ])

  return (
    <div className="w-[400px] h-[75px] absolute bottom-3 left-[calc(50%-200px)] rounded-md bg-white gap-3 flex items-center justify-center p-5">
      <button className="w-10 h-10" style={
          drawMode == "hand"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("hand")}>
        <Image src="/icons/hand-50.png" width={40} height={40} alt="handBtn"  />
      </button>
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