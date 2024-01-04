import { createGeometryStyle } from '@/utils/map/feature'
import { vectorSource } from '@/utils/map/layer'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useContext, useMemo } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
import { geometryTypes as geometryTypeData } from '@/data/geometry';
import { setFeatureSelectedById, setSelectedFeatureBoundary, toggleHandMapInteraction } from '@/utils/map/Interaction';
import { getFeatureGeoData } from '@/utils/geoData';
interface GeometryInfoProps {
  id: string,
  status: currentStatusType,
  type: currentItemType,
  color: string,
  stroke: number,
  changeColorRefHandler:(newColor:string)=>void,
  changeStrokeRefHandler:(newStroke:number)=>void,
  setCurrentSelectedFeature:(type:selectedFeatureType, id:string)=>void,
  isMoved: Boolean, 
  resetIsMoved: ()=>void
}
const GeometryInfo = ({id, status, type, color, stroke, changeColorRefHandler, changeStrokeRefHandler, setCurrentSelectedFeature, isMoved, resetIsMoved}:GeometryInfoProps) => {
  const map = useContext(MapContext);
  const mapId = usePathname().split("/")[2]
  const [message, setMessage] = useState({type:"normal",content:""})
  const [isChanged, setIsChanged] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  // const geometryTitleRef = useRef<HTMLInputElement>(null)
  // const geometryDescriptionRef = useRef<HTMLTextAreaElement>(null)
  // const geometryColorRef = useRef(null)
  // const geometryStrokeRef = useRef(null)
  // const feature = vectorSource.getFeatureById(id)
  const [geometryInfo, setGeometryInfo] = useState({
      id:"",
      title:"",
      geometry_type_id:"",
      color:"#ffcc33",
      stroke:5,
      description:"",
  })
  const colorChangeHandler = (e: React.ChangeEvent<HTMLInputElement>):void =>{
    changeColorRefHandler(e.target.value)
    handleGeometryInfo("color",e.target.value)  
  }
  const strokeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>):void =>{
    changeStrokeRefHandler(parseInt(e.target.value))
    handleGeometryInfo("stroke",e.target.value)
  }
  const dataUpdateHandler = () => {
    console.log("update current data")
    // if(status!="queue" && status!="none"){
    //   console.log("update route Info to Database...")
      const geometryTypeId = geometryTypeData.filter((geo)=>geo.value==type)[0].id
      const geometryLatestInfo = {
        id: id,
        title: geometryInfo.title,
        geometry_type_id: geometryTypeId,
        color: geometryInfo.color,
        stroke: geometryInfo.stroke,
        description: geometryInfo.description,
        geo_data: getFeatureGeoData(id, "vector")
      }
      setMessage(()=>{return {type:"normal",content:"updating..."}})
      fetch("/api/geometry",{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(geometryLatestInfo)
      })
      .then(res=>res.json())
      .then(res=>{
        console.log(res)
        setMessage(()=>{return {type:"success",content:"successfully updated!"}})
      })
      .catch((e)=>{
        console.log(e)
        setMessage(()=>{return {type:"error",content:"updated failed!"}})
      })
      .finally(()=>{
        setTimeout(()=>{
          setMessage(()=>{return {type:"",content:""}})
        },3000)
        setIsChanged(()=>false)
        resetIsMoved()
      }
      )
    // }
  }
  const handleGeometryInfo = (type:string, newValue:any) => {
    switch (type){
      case "title":
        setGeometryInfo((current)=>{
          return {
            ...current,
            title: newValue
          }
        })
        break
      case "color":
        setGeometryInfo((current)=>{
          return {
            ...current,
            color: newValue
          }
        })
        break
      case "stroke":
        setGeometryInfo((current)=>{
          return {
            ...current,
            stroke: parseInt(newValue)
          }
        })
        break
      case "description":
        setGeometryInfo((current)=>{
          return {
            ...current,
            description: newValue
          }
        })
        break
    }
  }
  
  useEffect(()=>{
    if(!isInitialLoad){
      setIsChanged(()=>true)}
    else{
      setIsChanged(()=>false)
      setIsInitialLoad(()=>false)
    }
  },[geometryInfo]) 

  useEffect(()=>{
    if(isMoved){
      setIsChanged(()=>true)
    }else{
      setIsChanged(()=>false)
    }
  },[isMoved])

  useEffect(()=>{
    const geometryTypeId = geometryTypeData.filter((geo)=>geo.value==type)[0].id
    if(status=="queue"){
      //clear local data
      // geometryTitleRef.current.value = ""
      // geometryDescriptionRef.current.value = ""
      // geometryColorRef.current.value = "#ffcc33"
      // geometryStrokeRef.current.value = "5"
      setGeometryInfo((current)=>{
        return {
          ...current,
          title:"",
          geometry_type_id:"",
          color:"#ffcc33",
          stroke:5,
          description:"",
        }
      })
      changeColorRefHandler("#ffcc33")
      changeStrokeRefHandler(5)
      
    }else if(status == "new"){
      //add geometry into database
      //get geometry from database
      //set data to the geometry page
      // const feature = vectorSource.getFeatureById(id)
      // const currentColor = feature?.get("color")
      // const currentStroke = feature?.get("stroke")
      // geometryColorRef.current.value = currentColor
      // geometryStrokeRef.current.value = currentStroke.toString()
      // changeColorRefHandler(currentColor)
      // changeStrokeRefHandler(currentStroke)
      console.log(id)
      const aboutToCreateData = {
        id: id,
        title: geometryInfo.title,
        geometry_type_id: geometryTypeId,
        color: geometryInfo.color,
        stroke: geometryInfo.stroke,
        description: geometryInfo.description,
        geo_data: getFeatureGeoData(id, "vector")
      }
      console.log(aboutToCreateData)
      //if create data successfully make feature selected else remove it
      setMessage(()=>{return {type:"normal",content:"creating..."}})
      fetch("/api/geometry",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          mapId: mapId,
          geometryInfo: aboutToCreateData
        })
      })
      .then((res)=>{
        return res.json()})
      .then((data)=>{
        console.log(data)
        //do we need to reassign data? no!
        console.log("Add data into route collection")
        toggleHandMapInteraction(map, true)
        setFeatureSelectedById(map, "vector", id)
        const currentGeometryExtent = vectorSource.getFeatureById(id)?.getGeometry()?.getExtent()
        setSelectedFeatureBoundary(currentGeometryExtent)
        setCurrentSelectedFeature(type, id)
        setMessage(()=>{return {type:"success",content:"create successfully"}})
      })
      .catch((e)=>{
        console.log(e)
        // console.log("On no, something wrong when creating route")
        setMessage(()=>{return {type:"error",content:"create fail, removing..."}})
      })
      .finally(()=>{
        setTimeout(()=>{
          setMessage(()=>{return {type:"",content:""}})
        },2000)
        setIsChanged(()=>false)
      })
    }else if(status == "old"){
      //get geometry from database
      //set data to the geometry page
      // const feature = vectorSource.getFeatureById(id)
      // const currentColor = feature?.get("color")
      // const currentStroke = feature?.get("stroke")
      // geometryColorRef.current.value = currentColor
      // geometryStrokeRef.current.value = currentStroke.toString()
      // changeColorRefHandler(currentColor)
      // changeStrokeRefHandler(currentStroke)
      fetch(`/api/geometry/${id}`)
        .then((res)=>{
          return res.json()
        })
        .then((data)=>{
          console.log(data)
          const newInfo = data
          // routeTypeIdRef.current = newInfo.routeTypeId
          setGeometryInfo((current)=>{
            return {
              ...current,
              title: newInfo.title || "",
              geometry_type_id: newInfo.geometryTypeId,
              color: newInfo.color,
              stroke: newInfo.stroke,
              description: newInfo.description || "",
            }
          })
          changeColorRefHandler(newInfo.color)
          changeStrokeRefHandler(newInfo.stroke)
          setIsInitialLoad(()=>true)
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{return {type:"error",content:"no data in database, removing..."}})
        })
        .finally(()=>{
          setMessage(()=>{return {type:"normal",content:""}})
          setIsChanged(()=>false)
        })
    }
    return ()=>{
    }
  },[id, type])

  return (
    <div className="w-[260px] h-fit absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
        <div className='flex items-center justify-between'>
          <p className='w-20 text-xs'>{type} info</p>
          <div className='w-[calc(100%-80px)] flex justify-end items-center'>
            {message.content!=""?<div className='w-full flex text-xs text-end' style={message.type=="success"?{color:'green'}:message.type=="error"?{color:'red'}:{color:'black'}}>{message.content}</div>:<></>}
            {status!="queue"&&isChanged&&message.content==""?
            <div className='flex gap-3'>
              <button className='w-fit h-5 px-2 text-xs' onClick={()=>{}}>
                <Image 
                    src={'/icons/return-30.png'}
                    width={20}
                    height={20}
                    alt="return_button"
                />
              </button>
              <button className='w-fit h-5 px-2 text-xs' onClick={()=>{dataUpdateHandler()}}>
                <Image 
                    src={'/icons/save-30.png'}
                    width={20}
                    height={20}
                    alt="save_button"
                />
              </button>
            </div>:null
            }
          </div>
        </div>
        
        <hr className='border-1 my-2'/>
        <div className='overflow-y-scroll'>

        </div>
        <input value={geometryInfo.title} className="h-12 py-3 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Title' onChange={(e)=>{handleGeometryInfo("title",e.target.value)}}/>
        <div className='w-[calc(100%-20px)] flex h-10 items-center'>
          <label className='text-xs min-w-20 w-20'>Brush Width: </label>
          <input
              value={geometryInfo.stroke.toString()}
              className='w-1/2'
              type="range"
              min="1"
              max="8"
              // defaultValue="5"
              onChange={(e)=>strokeChangeHandler(e)}
          />
        </div>
        <div className='w-[calc(100%-20px)] flex h-10 items-center'>
          <label className='text-xs min-w-20 w-20'>Brush Color: </label>
          <input
              value={geometryInfo.color}
              type="color"
              // defaultValue="#ffcc33"
              onChange={(e)=>colorChangeHandler(e)}
          />
        </div>
        
        <textarea value={geometryInfo.description} className="py-3 outline-none min-h-[120px] text-xs" placeholder="description" onChange={(e)=>{handleGeometryInfo("description",e.target.value)}}></textarea>
        
    </div>
  )
}

export default GeometryInfo