import React, { useContext, useEffect } from 'react'
import Image from 'next/image'
import { addSpotFeature, addStyleToPreSelectedFeature } from '@/utils/map/feature';
import { addDrawAndSnapInteractions, removeDrawAndSnapInteractions, toggleHandMapInteraction, addDrawRouteAndSnapInteractions } from '@/utils/map/Interaction';
import MapContext from '@/context/MapContext';
import { selectedSource } from '@/utils/map/layer';

interface ToolBoxProps {
  color:string,
  stroke:number,
  drawMode:drawModeType,
  changeDrawMode:(drawMode:drawModeType) => void,
  changeCurrentItemType:(newItem:currentItemType) => void,
  changeCurrentStatus:(newStatus:currentStatusType) => void,
  changeCurrentId:(newId:string) => void,
  preSelectedFeature: selectedFeature
}

const ToolBox = ({color, stroke, drawMode, changeDrawMode, changeCurrentItemType, changeCurrentStatus, changeCurrentId, preSelectedFeature }:ToolBoxProps) => {
  const map = useContext(MapContext);

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
    ///delete pre interaction
    changeCurrentId("")
    changeCurrentItemType("none")
    if(drawMode == "mark"){
      map.un("click",addSpotFeature)
    }else if(drawMode == "hand"){
      toggleHandMapInteraction(map, false)
      changeCurrentItemType("none")
      addStyleToPreSelectedFeature(preSelectedFeature)
      selectedSource.clear()
    }else{
      removeDrawAndSnapInteractions(map)
    }
    ///add new interaction
    if(activeMode == "mark"){
      map.on("click",addSpotFeature)
      changeCurrentItemType("spot")
      changeCurrentStatus("queue")
    }else if(activeMode == "hand"){
      toggleHandMapInteraction(map, true)
      changeCurrentStatus("none")
    }else if(activeMode == "route"){
      addDrawRouteAndSnapInteractions(map, "walk")
      changeCurrentItemType("route")
      changeCurrentStatus("queue")
    }else if(activeMode == "brush"){
    }else if(activeMode == "cursor"){
        changeCurrentStatus("none")
    }else{
      activeGeometry = activeMode
      addDrawAndSnapInteractions(map, activeGeometry, color, stroke)
      changeCurrentItemType(activeGeometry.toLowerCase())
      changeCurrentStatus("queue")
    }
  }

  useEffect(()=>{
    if(drawMode=="LineString" || drawMode=="Polygon" || drawMode=="Circle"){
      removeDrawAndSnapInteractions(map)
      addDrawAndSnapInteractions(map, drawMode, color, stroke)
    }
  },[ drawMode ])

  return (
    <div className="w-[400px] h-[75px] rounded-md bg-white gap-3 flex items-center justify-center p-5 relative">
      <button className="w-10 h-10" style={
          drawMode == "hand"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("hand")}>
        <Image src="/icons/hand-50.png" width={40} height={40} alt="handBtn"  />
        <div className='w-10 h-24 bg-trasparent absolute bottom-0 opacity-0 hover:opacity-100' style={{paddingTop:drawMode=="hand"?"32px":"0"}}>
          <p className='w-10 h-fit text-xs text-center bg-white'>Select</p>
        </div>
      </button>
      <button className="w-10 h-10" style={
          drawMode == "mark"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("mark")}>
        <Image src="/icons/010-location-2.png" width={40} height={40} alt="markBtn"  />
        <div className='w-10 h-24 bg-trasparent absolute bottom-0 opacity-0 hover:opacity-100' style={{paddingTop:drawMode=="mark"?"32px":"0"}}>
          <p className='w-10 h-fit text-xs text-center bg-white'>Spot</p>
        </div>
      </button>
      <button className="w-10 h-10" style={
          drawMode == "route"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("route")}>
        <Image src="/icons/route.png" width={30} height={30} alt="routeBtn" />
        <div className='w-10 h-24 bg-trasparent absolute bottom-0 opacity-0 hover:opacity-100' style={{paddingTop:drawMode=="route"?"32px":"0"}}>
          <p className='w-10 h-fit text-xs text-center bg-white'>Route</p>
        </div>
      </button>
      <button className="w-10 h-10" style={
          drawMode == "LineString"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("LineString")}>
        <Image src="/icons/line.png" width={30} height={30} alt="lineBtn" />
        <div className='w-10 h-24 bg-trasparent absolute bottom-0 opacity-0 hover:opacity-100' style={{paddingTop:drawMode=="LineString"?"32px":"0"}}>
          <p className='w-10 h-fit text-xs text-center bg-white'>Line</p>
        </div>
      </button>
      <button className="w-10 h-10" style={
          drawMode == "Polygon"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("Polygon")}>
        <Image src="/icons/polyline.png" width={30} height={30} alt="polygonBtn"/>
        <div className='w-12 h-24 bg-trasparent absolute bottom-0 opacity-0 hover:opacity-100' style={{paddingTop:drawMode=="Polygon"?"32px":"0"}}>
          <p className='w-12 h-fit text-xs text-center bg-white'>Polygon</p>
        </div>
      </button>
      <button className="w-10 h-10" style={
          drawMode == "Circle"
            ? { transform: "translateY(-10px)", scale: "1.1" }
            : {}
        } onClick={()=>drawModeController("Circle")}>
        <Image src="/icons/circle.png" width={30} height={30} alt="circleBtn"/>
        <div className='w-10 h-24 bg-trasparent absolute bottom-0 opacity-0 hover:opacity-100' style={{paddingTop:drawMode=="Circle"?"32px":"0"}}>
          <p className='w-10 h-fit text-xs text-center bg-white'>Circle</p>
        </div>
      </button>
    </div>
  )
}

export default ToolBox