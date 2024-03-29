import { usePathname } from 'next/navigation'
import Image from 'next/image'
import React, {useEffect, useState, useContext} from 'react'
import { routeTypes } from '@/data/route'
import { timeZoneArray } from '@/data/dateAndTime'
import { routeSource } from '@/utils/map/layer'
import MapContext from '@/context/MapContext';
import { setFeatureSelectedById, setSelectedFeatureBoundary, toggleHandMapInteraction } from '@/utils/map/Interaction';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';
import { getFeatureGeoData } from '@/utils/geoData';

interface RouteInfoProps {
  id: string,
  status: currentStatusType,
  routeImage: {id:string, url:string},
  setImage:(type:string,imageData:{id:string, url:string})=>void,
  changeRouteRefHandler: (routeType: routeType)=> void,
  edgeLocation: number[][],
  changeRouteEdgeLocation: (edgeLocation:edgeLocationType)=>void
  setCurrentSelectedFeature:(type:selectedFeatureType, id:string)=>void
  openImagePreview:(type:ImageTargetType, id:string, isNew:Boolean)=>void
}

const RouteInfo = ({id, status, routeImage, setImage, changeRouteRefHandler, edgeLocation, changeRouteEdgeLocation, setCurrentSelectedFeature, openImagePreview}:RouteInfoProps) => {
    const map = useContext(MapContext);
    const mapId = usePathname().split("/")[2]
    const [message, setMessage] = useState({type:"normal",content:""})
    const [isChanged, setIsChanged] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [routeInfo, setRouteInfo] = useState({
        id:"",
        title:"",
        depart:[0,0],
        destination:[0,0],
        description:"",
        start_date:"",
        start_time_zone:"",
        end_date:"",
        end_time_zone:"",
        duration:0,
    })
    const [routeDuration, setRouteDuration] = useState(0)
    const [routeTypeId, setRouteTypeId] = useState("RT01")
    const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false)

    const routeTypeChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {

        let type = e.target.value
        let typeId = e.target.id
        setRouteTypeId(()=>typeId)       
        changeRouteRefHandler(type)
    }
    const dataUpdateHandler = () => {
        const routeLatestInfo = {
          id: id,
          title: routeInfo.title,
          depart: edgeLocation[0],
          destination: edgeLocation[1],
          route_type_id: routeTypeId,
          start_time: routeInfo.start_date,
          start_time_zone: routeInfo.start_time_zone,
          end_time: routeInfo.end_date,
          end_time_zone: routeInfo.end_time_zone,
          duration: routeDuration,
          description: routeInfo.description,
          geo_data: getFeatureGeoData(id, "route")
        }
        setMessage(()=>{return {type:"normal",content:"updating..."}})
        fetch("/api/route",{
          method:"PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(routeLatestInfo)
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
        }
        )
    }
    const handleRouteState = (type:string, newValue:any) => {
      switch(type){
        case "title":
            setRouteInfo((current)=>{
                return {...current, title:newValue}
            })
            return
        case "description":
            setRouteInfo((current)=>{
                return {...current, description:newValue}
            })
            return
        case "startDate":
            setRouteInfo((current)=>{
                return {...current, start_date:newValue}
            })
            return
        case "startTimeZone":
            setRouteInfo((current)=>{
                return {...current, start_time_zone:newValue}
            })
            return
        case "endDate":
            setRouteInfo((current)=>{
                return {...current, end_date:newValue}
            })
            return
        case "endTimeZone":
            setRouteInfo((current)=>{
                return {...current, end_time_zone:newValue}
            })
            return
      }
    }
    const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name
      const dateTimeValue = e.target.value
      switch(name){
        case "start-date":
          const durationFromStartTimeChange = getDurationInHour(dateTimeValue, routeInfo.end_date, routeInfo.start_time_zone, routeInfo.end_time_zone)
          setRouteDuration(()=>durationFromStartTimeChange);
          handleRouteState("startDate", dateTimeValue)
          break
        case "end-date":
          const durationFromEndTimeChange = getDurationInHour(routeInfo.start_date, dateTimeValue, routeInfo.start_time_zone, routeInfo.end_time_zone)
          setRouteDuration(()=>durationFromEndTimeChange);
          handleRouteState("endDate", dateTimeValue)
          break
      };
    };
    const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
      const name = e.target.name
      const timeZoneValue = e.target.value
      switch(name){
        case "start-time-zone":
          const durationFromStartTimeZoneChange = getDurationInHour(routeInfo.start_date, routeInfo.end_date, timeZoneValue, routeInfo.end_time_zone)
          setRouteDuration(()=> durationFromStartTimeZoneChange);
          handleRouteState("startTimeZone", timeZoneValue)
          break
        case "end-time-zone":
          const durationFromEndTimeZoneChange = getDurationInHour(routeInfo.start_date, routeInfo.end_date, routeInfo.start_time_zone, timeZoneValue)
          setRouteDuration(()=> durationFromEndTimeZoneChange);
          handleRouteState("endTimeZone", timeZoneValue)
          break
      }
    }
    const deleteImage = () => {
      return new Promise((resolve, reject)=>{
          fetch(`/api/image/${routeImage.id}?type=route`,{
              method:"DELETE"
          })
          .then((res)=>res.json())
          .then((result)=>{
              return result.success?resolve(result):reject(result)
          })
          .catch((e)=>reject({"error":true, "message":e}))
      })
    }
    const updateRouteImage = () => {
      setIsDeleteBoxOpen(false)
      openImagePreview("route", routeImage.id, false)
    }
    const deleteRouteImage = async() => {
      setIsDeleteBoxOpen(false)
      try{
            await deleteImage()
            setImage("route",{id:"",url:""})
        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
      if(!isInitialLoad){
        setIsChanged(()=>true)}
      else{
        setIsChanged(()=>false)
        setIsInitialLoad(()=>false)
      }
    },[routeInfo, routeDuration, routeTypeId, edgeLocation]) 



    useEffect(()=>{
      if(status=="queue"){
        //just show this type page not create any feature in the map
        changeRouteRefHandler("walk")
        changeRouteEdgeLocation([[0,0],[0,0]])
        setImage("route",{id:"",url:""})
        setRouteDuration(()=>0)
        setRouteTypeId(()=>"RT01")
        setRouteInfo(()=>{
          return {
            id:"",
            title:"",
            depart:[0,0],
            destination:[0,0],
            description:"",
            start_date:getLocalDateTime(),
            start_time_zone:getLocalTimeZone(),
            end_date:getLocalDateTime(),
            end_time_zone:getLocalTimeZone(),
            duration:0,
          }
        })
        setIsChanged(()=>false)
      }else if (status == "new"){
        const aboutToCreateData = {
          id: id,
          title: routeInfo.title,
          depart: edgeLocation[0],
          destination: edgeLocation[1],
          route_type_id: routeTypeId,
          start_time: routeInfo.start_date,
          start_time_zone: routeInfo.start_time_zone,
          end_time: routeInfo.end_date,
          end_time_zone: routeInfo.end_time_zone,
          duration: routeDuration,
          description: routeInfo.description,
          geo_data: getFeatureGeoData(id, "route")
        }
        setMessage(()=>{return {type:"normal",content:"Creating..."}})
        fetch("/api/route",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            mapId: mapId,
            routeInfo: aboutToCreateData
          })
        })
        .then((res)=>{
          return res.json()})
        .then((data)=>{
          toggleHandMapInteraction(map, true)
          setFeatureSelectedById(map, "route", id)
          const currentRouteExtent = routeSource.getFeatureById(id)?.getGeometry()?.getExtent()
          setSelectedFeatureBoundary(currentRouteExtent)
          setCurrentSelectedFeature("route", id)
          setMessage(()=>{return {type:"success",content:"Create successfully"}})
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{return {type:"error",content:"Create fail, removing..."}})
        })
        .finally(()=>{
          setTimeout(()=>{
            setMessage(()=>{return {type:"",content:""}})
          },2000)
          setIsChanged(()=>false)
        })
        }else if (status == "old"){
        //get data from database and set route info state
        fetch(`/api/route/${id}`)
        .then((res)=>{
          return res.json()
        })
        .then((data)=>{
          const newInfo = data
          changeRouteEdgeLocation([newInfo.depart || [0,0],newInfo.destination || [0,0]])
          const newImageData = newInfo.routeImage?{
                                  id:newInfo.routeImage.id,
                                  url:newInfo.routeImage.url
                                }:{
                                  id:"",
                                  url:""
                              }
          setImage("route", newImageData)
          setRouteDuration(()=>(newInfo.duration || 0))
          setRouteTypeId(()=>(newInfo.routeTypeId))
          setRouteInfo((current)=>{
            return {
              ...current,
              title:newInfo.title || "",
              depart:newInfo.depart || [0,0],
              destination:newInfo.destination || [0,0],
              description: newInfo.description || "",
              start_date: newInfo.startTime || getLocalDateTime(),
              start_time_zone: newInfo.startTimeZone || getLocalTimeZone(),
              end_date: newInfo.endTime || getLocalDateTime(),
              end_time_zone: newInfo.endTimeZone || getLocalTimeZone(),
              duration: newInfo.duration || 0,
            }
            
          })
          setIsInitialLoad(()=>true)
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{return {type:"error",content:"No data in database, removing..."}})
        })
        .finally(()=>{
          setMessage(()=>{return {type:"normal",content:""}})
          setIsChanged(()=>false)
        })
      }
    },[id])


    
  return (
    <div className="w-[360px] h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
      <div className='flex items-center justify-between'>
        <p className='w-20 text-xs'>Route Info</p>
        <div className='w-[calc(100%-80px)] flex justify-end items-center'>
          {message.content!=""?<div className='w-full text-xs text-end' style={message.type=="success"?{color:'green'}:message.type=="error"?{color:'red'}:{color:'black'}}>{message.content}</div>:null}

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
        <div className='w-full flex mb-2 justify-between'>
          <input className="h-8 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Title' value={routeInfo.title} onChange={e=>handleRouteState("title",e.target.value)}/>
          {id&&routeImage.id==""?
              <button className='w-fit h-8 text-xs' onClick={()=>{openImagePreview("route", id, true)}}>
                <Image 
                    src={'/icons/camera-30.png'}
                    width={25}
                    height={25}
                    alt="camera_button"
                />
              </button>:null
            }
        </div>
        <div className='flex items-center gap-3 mb-2'>
          <p className='w-[32px] text-xs '>Departure:<span className='pl-3'>long_{edgeLocation[0][0].toFixed(3)},&nbsp;&nbsp;lat_{edgeLocation[0][1].toFixed(3)}</span></p>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-xs'>&harr;</span>
          <p className='w-[32px] text-xs'>Destination:<span className='pl-3'>long_{edgeLocation[1][0].toFixed(3)},&nbsp;&nbsp;lat_{edgeLocation[1][1].toFixed(3)}</span></p>
        </div>
        {id&&routeImage.id?<div className='w-full h-[240px] min-h-[240px] overflow-hidden relative'>
                      {isDeleteBoxOpen?
                      <div className='absolute top-3 right-10 w-20 h-20 py-3 bg-white z-10'>
                          <p className="hover:font-bold text-center" onClick={()=>{deleteRouteImage()}}>Delete</p>
                          <p className="hover:font-bold text-center" onClick={()=>{updateRouteImage()}}>Update</p>
                      </div>:
                      <></>}
                      <button className='w-6 h-6 absolute top-3 right-2 rounded-md z-10' onClick={()=>{setIsDeleteBoxOpen(!isDeleteBoxOpen)}}>
                          <Image 
                              src={'/icons/three-dots-vw-50.png'}
                              width={20}
                              height={20}
                              alt="edit_button"
                          />
                      </button>
                      <Image 
                          src={routeImage.url}
                          width={300}
                          height={240}
                          quality={100}
                          alt="route_image"
                          className='w-[500px] h-[360px] object-cover'
                      />
                  </div>
        :null}
        <div className='h-fit w-fit py-3 flex gap-1 flex-wrap'>
          {routeTypes.map((routeType, i)=>{
          return <div className='flex gap-3 items-center h-8 w-fit px-3 rounded-md' style={routeTypeId=== routeType.id?{border:'solid 2px #052e16'}:{border:'solid 1px #10b981'}} key={i}>
                      <input id={routeType.id} value={routeType.value} type='radio' name='routeType' className='hidden' checked={routeTypeId=== routeType.id} onChange={(e)=>routeTypeChangeHandler(e)}/>
                      <label className="text-xs cursor-pointer" htmlFor={routeType.id} >{routeType.name}</label>
                  </div>
          })}
        </div>
        {/* start time */}
        <div className='h-8 w-full flex'>
          <p className='h-full w-14 text-xs font-bold leading-8'>From: &#8614;</p>
          <input
              value={routeInfo.start_date}
              className='h-full w-1/3 py-3 px-3 text-xs outline-1 outline-gray-100 flex-grow'
              type="datetime-local"
              name="start-date"
              min="2020-06-30T00:00"
              max="2050-06-30T00:00"
              onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
          />
          <select className='h-full w-[80px] px-1 text-xs outline-1 outline-gray-100' value={routeInfo.start_time_zone} name='start-time-zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
              <option className='text-xs' defaultValue={"0"}>Time Zone</option>
              {timeZoneArray.map(((timeZone,i)=>{
                  return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}</option>
              }))}
          </select>
        </div>
        {/* end time */}
        <div className='h-8 w-full flex'>
          <p className='h-full w-14 text-xs font-bold leading-8'>&#8612; To:</p>
          <input
              value={routeInfo.end_date}
              className='h-full w-1/3 py-3 px-3 text-xs outline-1 outline-gray-100 flex-grow'
              type="datetime-local"
              name="end-date"
              min="2020-06-30T00:00"
              max="2050-06-30T00:00"
              onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
          />
          <select className='h-full w-[80px] px-1 text-xs outline-1 outline-gray-100' value={routeInfo.end_time_zone} name='end-time-zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
              <option className='text-xs' value={"0"}>Time Zone</option>
              {timeZoneArray.map(((timeZone,i)=>{
                  return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}</option>
              }))}
          </select>
        </div>
        <div className='h-8 w-full flex'>
          <p className='h-full w-16 text-xs font-bold leading-8'>Duration:</p>
          <p className='h-full w-10 leading-8 text-xs'><span>{routeDuration}             
          </span>hour</p>
        </div>
        <textarea value={routeInfo.description} className="w-full py-3 outline-none min-h-[120px] text-xs" placeholder="How's the trip?"  onChange={(e)=>handleRouteState("description",e.target.value)}></textarea>
      </div>
    </div>
  )
}

export default RouteInfo