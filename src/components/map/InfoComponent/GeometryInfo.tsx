import { createGeometryStyle } from '@/utils/map/feature'
import { vectorSource } from '@/utils/map/layer'
import React, { useEffect, useRef } from 'react'
interface GeometryInfoProps {
  item:currentItemObject,
  color:string,
  stroke:number,
  changeColorRefHandler:(newColor:string)=>void,
  changeStrokeRefHandler:(newStroke:number)=>void
}
const GeometryInfo = ({item, color, stroke, changeColorRefHandler, changeStrokeRefHandler}:GeometryInfoProps) => {
  const id = item.id
  const type = item.type
  const status = item.status
  const geometryTitleRef = useRef<HTMLInputElement>(null)
  const geometryDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const geometryColorRef = useRef(null)
  const geometryStrokeRef = useRef(null)
  // const feature = vectorSource.getFeatureById(id)
  const colorChangeHandler = (e: React.ChangeEvent<HTMLInputElement>):void =>{
    if(status=="queue"){
      //the feature not been drawn
      changeColorRefHandler(e.target.value)

    }else{
      //the feature was created in database
      //get feature info from database
      changeColorRefHandler(e.target.value)
      const feature = vectorSource.getFeatureById(id)
      feature?.set("color", e.target.value)
      const newStyle = createGeometryStyle(e.target.value, feature?.get("stroke"))
      feature?.setStyle(newStyle)
      console.log(feature?.getProperties())
    }
    
  }
  const strokeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>):void =>{
    if(status=="queue"){
      //the feature not been drawn
      changeStrokeRefHandler(parseInt(e.target.value))

    }else{
      //the feature was created in database
      //get feature info from database
      changeStrokeRefHandler(parseInt(e.target.value))
      const feature = vectorSource.getFeatureById(id)
      
      feature?.set("stroke", parseInt(e.target.value))
      const newStyle = createGeometryStyle(feature?.get("color"), parseInt(e.target.value))
      feature?.setStyle(newStyle)
      console.log(feature?.getProperties())
    }
  }

  useEffect(()=>{
    if(status=="queue"){
      //clear local data
      geometryTitleRef.current.value = ""
      geometryDescriptionRef.current.value = ""
      geometryColorRef.current.value = "#ffcc33"
      geometryStrokeRef.current.value = "5"
      changeColorRefHandler("#ffcc33")
      changeStrokeRefHandler(5)
      
    }else if(status == "new"){
      //add geometry into database
      //get geometry from database
      //set data to the geometry page
      const feature = vectorSource.getFeatureById(id)
      const currentColor = feature?.get("color")
      const currentStroke = feature?.get("stroke")
      geometryColorRef.current.value = currentColor
      geometryStrokeRef.current.value = currentStroke.toString()
      changeColorRefHandler(currentColor)
      changeStrokeRefHandler(currentStroke)
    }else if(status == "old"){
      //get geometry from database
      //set data to the geometry page
      const feature = vectorSource.getFeatureById(id)
      const currentColor = feature?.get("color")
      const currentStroke = feature?.get("stroke")
      geometryColorRef.current.value = currentColor
      geometryStrokeRef.current.value = currentStroke.toString()
      changeColorRefHandler(currentColor)
      changeStrokeRefHandler(currentStroke)
    }
    return ()=>{
      if(status!="queue"){
        console.log("update geometry data into database")
      }
    }
  },[id, type, status])

  return (
    <div className="w-[220px] h-[320px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
        <p className='text-xs mb-1'>{type} info {id}</p>
        <hr className='border-1 mb-2'/>
        <input ref={geometryTitleRef} className="h-12 py-3 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Title'/>
        <div className='w-[calc(100%-20px)] flex h-10 items-center'>
          <label className='text-xs min-w-20 w-20'>Brush Width: </label>
          <input
              ref={geometryStrokeRef}
              className='w-1/2'
              type="range"
              min="1"
              max="8"
              defaultValue="5"
              onChange={(e)=>strokeChangeHandler(e)}
          />
        </div>
        <div className='w-[calc(100%-20px)] flex h-10 items-center'>
          <label className='text-xs min-w-20 w-20'>Brush Color: </label>
          <input
              ref={geometryColorRef}
              type="color"
              defaultValue="#ffcc33"
              onChange={(e)=>colorChangeHandler(e)}
          />
        </div>
        
        <textarea ref={geometryDescriptionRef} className="py-3 outline-none min-h-[120px] text-xs" placeholder="description"></textarea>
    </div>
  )
}

export default GeometryInfo