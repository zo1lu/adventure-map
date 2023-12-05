import { usePathname } from 'next/navigation'
import Image from 'next/image'
import React, {useEffect, useState, useContext, useRef, useMemo} from 'react'
import { routeTypes } from '@/data/route'
import { timeZoneArray } from '@/data/dateAndTime'
import { routeSource } from '@/utils/map/layer'
import MapContext from '@/context/MapContext';
import { setFeatureSelectedById, setSelectedFeatureBoundary, toggleHandMapInteraction } from '@/utils/map/Interaction';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';
import { getFeatureGeoData } from '@/utils/geoData';

interface RouteInfoProps {
  id: string,
}

const RouteInfo = ({id}:RouteInfoProps) => {
    const map = useContext(MapContext);
    const mapId = usePathname().split("/")[2]
    const [message, setMessage] = useState({type:"normal",content:""})
    //const [isChanged, setIsChanged] = useState(false)
    //const [isInitialLoad, setIsInitialLoad] = useState(true)
    // const routeTitleRef = useRef("")
    // const routeEdgeLocationRef = useRef([[0,0],[0,0]])
    //const routeTypeIdRef = useRef("RT01")
    // const routeDescriptionRef = useRef("")
    // const routeStartDateRef = useRef("")
    // const routeStartTimeZoneRef = useRef("")
    // const routeEndDateRef = useRef("")
    // const routeEndTimeZoneRef = useRef("")
    // const routeDurationRef = useRef(0)
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
    const [routeImg, setRouteImg] = useState({
      id:"",
      url:""
    })
    //const [routeDuration, setRouteDuration] = useState(0)
    const [routeTypeId, setRouteTypeId] = useState("RT01")
    //const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false)

    // const routeTypeChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {

    //     let type = e.target.value
    //     let typeId = e.target.id
    //     //?
    //     //routeTypeIdRef.current = typeId
    //     setRouteTypeId(()=>typeId)       
    //     //set routeType
    //     changeRouteRefHandler(type)
    // }
    // const dataUpdateHandler = () => {
    //   console.log("update current data")
    //   // if(status!="queue" && status!="none"){
    //   //   console.log("update route Info to Database...")
    //     const routeLatestInfo = {
    //       id: id,
    //       title: routeInfo.title,
    //       depart: edgeLocation[0],
    //       destination: edgeLocation[1],
    //       route_type_id: routeTypeId,
    //       start_time: routeInfo.start_date,
    //       start_time_zone: routeInfo.start_time_zone,
    //       end_time: routeInfo.end_date,
    //       end_time_zone: routeInfo.end_time_zone,
    //       duration: routeDuration,
    //       description: routeInfo.description,
    //       geo_data: getFeatureGeoData(id, "route")
    //     }
    //     setMessage(()=>{return {type:"normal",content:"updating..."}})
    //     fetch("/api/route",{
    //       method:"PATCH",
    //       headers:{
    //         "Content-Type":"application/json"
    //       },
    //       body:JSON.stringify(routeLatestInfo)
    //     })
    //     .then(res=>res.json())
    //     .then(res=>{
    //       console.log(res)
    //       setMessage(()=>{return {type:"success",content:"successfully updated!"}})
    //     })
    //     .catch((e)=>{
    //       console.log(e)
    //       setMessage(()=>{return {type:"error",content:"updated failed!"}})
    //     })
    //     .finally(()=>{
    //       setTimeout(()=>{
    //         setMessage(()=>{return {type:"",content:""}})
    //       },3000)
    //       setIsChanged(()=>false)
    //     }
    //     )
    //   // }
    // }
    // const handleRouteState = (type:string, newValue:any) => {
    //   switch(type){
    //     case "title":
    //         setRouteInfo((current)=>{
    //             return {...current, title:newValue}
    //         })
    //         // routeTitleRef.current=newValue
    //         return
    //     case "description":
    //         setRouteInfo((current)=>{
    //             return {...current, description:newValue}
    //         })
    //         // routeDescriptionRef.current=newValue
    //         return
    //     case "startDate":
    //         setRouteInfo((current)=>{
    //             return {...current, start_date:newValue}
    //         })
    //         // routeStartDateRef.current=newValue
    //         return
    //     case "startTimeZone":
    //         setRouteInfo((current)=>{
    //             return {...current, start_time_zone:newValue}
    //         })
    //         // routeStartTimeZoneRef.current=newValue
    //         return
    //     case "endDate":
    //         setRouteInfo((current)=>{
    //             return {...current, end_date:newValue}
    //         })
    //         // routeEndDateRef.current=newValue
    //         return
    //     case "endTimeZone":
    //         setRouteInfo((current)=>{
    //             return {...current, end_time_zone:newValue}
    //         })
    //         // routeEndTimeZoneRef.current=newValue
    //         return
    //   }
    // }
    // const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    //   const name = e.target.name
    //   const dateTimeValue = e.target.value
    //   switch(name){
    //     case "start-date":
    //       const durationFromStartTimeChange = getDurationInHour(dateTimeValue, routeInfo.end_date, routeInfo.start_time_zone, routeInfo.end_time_zone)
    //       setRouteDuration(()=>durationFromStartTimeChange);
    //       // routeDurationRef.current = durationFromStartTimeChange;
    //       handleRouteState("startDate", dateTimeValue)
    //       break
    //     case "end-date":
    //       const durationFromEndTimeChange = getDurationInHour(routeInfo.start_date, dateTimeValue, routeInfo.start_time_zone, routeInfo.end_time_zone)
    //       setRouteDuration(()=>durationFromEndTimeChange);
    //       // routeDurationRef.current = durationFromEndTimeChange
    //       handleRouteState("endDate", dateTimeValue)
    //       break
    //   };
    // };
    // const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    //   const name = e.target.name
    //   const timeZoneValue = e.target.value
    //   switch(name){
    //     case "start-time-zone":
    //       const durationFromStartTimeZoneChange = getDurationInHour(routeInfo.start_date, routeInfo.end_date, timeZoneValue, routeInfo.end_time_zone)
    //       setRouteDuration(()=> durationFromStartTimeZoneChange);
    //       // routeDurationRef.current = durationFromStartTimeZoneChange
    //       handleRouteState("startTimeZone", timeZoneValue)
    //       break
    //     case "end-time-zone":
    //       const durationFromEndTimeZoneChange = getDurationInHour(routeInfo.start_date, routeInfo.end_date, routeInfo.start_time_zone, timeZoneValue)
    //       setRouteDuration(()=> durationFromEndTimeZoneChange);
    //       // routeDurationRef.current = durationFromEndTimeZoneChange
    //       handleRouteState("endTimeZone", timeZoneValue)
    //       break
    //   }
    // }
    // const deleteImage = () => {
    //   return new Promise((resolve, reject)=>{
    //       fetch(`/api/image/${routeImg.id}?type=route`,{
    //           method:"DELETE"
    //       })
    //       .then((res)=>res.json())
    //       .then((result)=>{
    //           return result.success?resolve(result):reject(result)
    //       })
    //       .catch((e)=>reject({"error":true, "message":e}))
    //   })
    // }
    // const updateRouteImage = () => {
    //   setIsDeleteBoxOpen(false)
    //   openImagePreview("route", routeImg.id, false)
    // }
    // const deleteRouteImage = async() => {
    //   setIsDeleteBoxOpen(false)
    //   try{
    //         //process message
    //         await deleteImage()
    //         setRouteImg(()=>{
    //             return {
    //                 id:"",
    //                 url:""
    //             }
    //         })
    //     }catch(e){
    //         //error message
    //     }
    // }

    // useEffect(()=>{
    //   if(!isInitialLoad){
    //     setIsChanged(()=>true)}
    //   else{
    //     setIsChanged(()=>false)
    //     setIsInitialLoad(()=>false)
    //   }
    // },[routeInfo, routeDuration, routeTypeId, edgeLocation]) 



    // useEffect(()=>{
    //   //>>get data from database or create route data
    //   //>>if id not in route collection create new one
    //   console.log("route page reload")
    //   console.log("current state", status)
    //   if(status=="queue"){
    //     //just show this type page not create any feature in the map
    //     console.log(`About to create route feature`)
    //     //setup the blank route page
    //     // routeTitleRef.current = ""
    //     // routeStartDateRef.current = getLocalDateTime()
    //     // routeEndDateRef.current = getLocalDateTime()
    //     // routeStartTimeZoneRef.current = getLocalTimeZone()
    //     // routeEndTimeZoneRef.current = getLocalTimeZone()
    //     // routeDescriptionRef.current = ""
    //     //???
    //     //routeTypeIdRef.current = "walk" or "RT01"
    //     //routeEdgeLocationRef.current = ([[0,0],[0,0]])
    //     changeRouteRefHandler("walk")
    //     changeRouteEdgeLocation([[0,0],[0,0]])
    //     setRouteImg(()=>{
    //       return {
    //         id:"",
    //         url:""
    //       }
    //     })
    //     setRouteDuration(()=>0)
    //     setRouteTypeId(()=>"RT01")
    //     setRouteInfo(()=>{
    //       return {
    //         id:"",
    //         title:"",
    //         depart:[0,0],
    //         destination:[0,0],
    //         description:"",
    //         start_date:getLocalDateTime(),
    //         start_time_zone:getLocalTimeZone(),
    //         end_date:getLocalDateTime(),
    //         end_time_zone:getLocalTimeZone(),
    //         duration:0,
    //       }
    //     })
    //     setIsChanged(()=>false)
    //   }else if (status == "new"){
    //     //create data into database
    //     //save id, route_type, dpt, dst, geoJson into database
    //     const aboutToCreateData = {
    //       id: id,
    //       title: routeInfo.title,
    //       depart: edgeLocation[0],
    //       destination: edgeLocation[1],
    //       route_type_id: routeTypeId,
    //       start_time: routeInfo.start_date,
    //       start_time_zone: routeInfo.start_time_zone,
    //       end_time: routeInfo.end_date,
    //       end_time_zone: routeInfo.end_time_zone,
    //       duration: routeDuration,
    //       description: routeInfo.description,
    //       geo_data: getFeatureGeoData(id, "route")
    //     }
    //     console.log(aboutToCreateData)
    //     //if create data successfully make feature selected else remove it
    //     setMessage(()=>{return {type:"normal",content:"creating..."}})
    //     fetch("/api/route",{
    //       method:"POST",
    //       headers:{
    //         "Content-Type":"application/json"
    //       },
    //       body:JSON.stringify({
    //         mapId: mapId,
    //         routeInfo: aboutToCreateData
    //       })
    //     })
    //     .then((res)=>{
    //       return res.json()})
    //     .then((data)=>{
    //       console.log(data)
    //       //do we need to reassign data? no!
    //       console.log("Add data into route collection")
    //       toggleHandMapInteraction(map, true)
    //       setFeatureSelectedById(map, "route", id)
    //       const currentRouteExtent = routeSource.getFeatureById(id)?.getGeometry()?.getExtent()
    //       setSelectedFeatureBoundary(currentRouteExtent)
    //       setCurrentSelectedFeature("route", id)
    //       setMessage(()=>{return {type:"success",content:"create successfully"}})
    //     })
    //     .catch((e)=>{
    //       console.log(e)
    //       // console.log("On no, something wrong when creating route")
    //       setMessage(()=>{return {type:"error",content:"create fail, removing..."}})
    //     })
    //     .finally(()=>{
    //       setTimeout(()=>{
    //         setMessage(()=>{return {type:"",content:""}})
    //       },2000)
    //       setIsChanged(()=>false)
    //     })
    //     }else if (status == "old"){
    //     //get data from database and set route info state
    //     console.log("Get route Info from db")
    //     console.log("current Id >>>",id)
    //     fetch(`/api/route/${id}`)
    //     .then((res)=>{
    //       return res.json()
    //     })
    //     .then((data)=>{
    //       console.log(data)
    //       const newInfo = data
    //       // routeTypeIdRef.current = newInfo.routeTypeId
    //       changeRouteEdgeLocation([newInfo.depart || [0,0],newInfo.destination || [0,0]])
    //       setRouteImg(()=>{
    //         return newInfo.routeImage?{
    //           id:newInfo.routeImage.id,
    //           url:newInfo.routeImage.url
    //         }:{
    //           id:"",
    //           url:""
    //       }
    //       })
    //       setRouteDuration(()=>(newInfo.duration || 0))
    //       setRouteTypeId(()=>(newInfo.routeTypeId))
    //       setRouteInfo((current)=>{
    //         return {
    //           ...current,
    //           title:newInfo.title || "",
    //           depart:newInfo.depart || [0,0],
    //           destination:newInfo.destination || [0,0],
    //           description: newInfo.description || "",
    //           start_date: newInfo.startTime || getLocalDateTime(),
    //           start_time_zone: newInfo.startTimeZone || getLocalTimeZone(),
    //           end_date: newInfo.endTime || getLocalDateTime(),
    //           end_time_zone: newInfo.endTimeZone || getLocalTimeZone(),
    //           duration: newInfo.duration || 0,
    //         }
            
    //       })
    //       setIsInitialLoad(()=>true)
    //     })
    //     .catch((e)=>{
    //       console.log(e)
    //       setMessage(()=>{return {type:"error",content:"no data in database, removing..."}})
    //     })
    //     .finally(()=>{
    //       setMessage(()=>{return {type:"normal",content:""}})
    //       setIsChanged(()=>false)
    //     })
    //   }
        
    //     return ()=>{
    //       console.log(id)
          
    //     }
    // },[id])
    useEffect(()=>{
      fetch(`/api/route/${id}`)
        .then((res)=>{
          return res.json()
        })
        .then((data)=>{
          console.log(data)
          const newInfo = data
          // routeTypeIdRef.current = newInfo.routeTypeId
          //changeRouteEdgeLocation([newInfo.depart || [0,0],newInfo.destination || [0,0]])
          setRouteImg(()=>{
            return newInfo.routeImage?{
              id:newInfo.routeImage.id,
              url:newInfo.routeImage.url
            }:{
              id:"",
              url:""
          }
          })
          //setRouteDuration(()=>(newInfo.duration || 0))
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
          //setIsInitialLoad(()=>true)
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{return {type:"error",content:"no data in database, removing..."}})
        })
        .finally(()=>{
          setMessage(()=>{return {type:"normal",content:""}})
          //setIsChanged(()=>false)
        })
    },[id])

    
  return (
    <div className="w-[360px] h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
      <div className='flex items-center justify-between'>
        <p className='w-20 text-xs'>Route Info</p>
        <div className='w-[calc(100%-80px)] flex justify-end items-center'>
          {message.content!=""?<div className='w-full text-xs text-end' style={message.type=="success"?{color:'green'}:message.type=="error"?{color:'red'}:{color:'black'}}>{message.content}</div>:null}
          
        </div>
      </div>
      
      <hr className='border-1 my-2'/>
      <div className='overflow-y-scroll'>
        <div className='w-full flex mb-2 justify-between'>
          <input className="h-8 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Title' value={routeInfo.title} />
        </div>
        <div className='flex items-center gap-3 mb-2'>
          <p className='w-[32px] text-xs '>Departure:<span className='pl-3'>long_{routeInfo.depart[0].toFixed(3)},&nbsp;&nbsp;lat_{routeInfo.depart[1].toFixed(3)}</span></p>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-xs'>&harr;</span>
          <p className='w-[32px] text-xs'>Destination:<span className='pl-3'>long_{routeInfo.destination[0].toFixed(3)},&nbsp;&nbsp;lat_{routeInfo.destination[1].toFixed(3)}</span></p>
        </div>
        {id&&routeImg.id?<div className='w-full h-[240px] min-h-[240px] overflow-hidden relative'>
                      <Image 
                          src={routeImg.url}
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
                      <input id={routeType.id} value={routeType.value} type='radio' name='routeType' className='hidden' checked={routeTypeId=== routeType.id}/>
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
              // defaultValue={getLocalDateTime()}
              min="2020-06-30T00:00"
              max="2050-06-30T00:00"
              readOnly
          />
          <select className='h-full w-[80px] px-1 text-xs outline-1 outline-gray-100' value={routeInfo.start_time_zone} name='start-time-zone' >
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
              // defaultValue={getLocalDateTime()}
              min="2020-06-30T00:00"
              max="2050-06-30T00:00"
              readOnly
          />
          <select className='h-full w-[80px] px-1 text-xs outline-1 outline-gray-100' value={routeInfo.end_time_zone} name='end-time-zone' >
              <option className='text-xs' value={"0"}>Time Zone</option>
              {timeZoneArray.map(((timeZone,i)=>{
                  return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}</option>
              }))}
          </select>
        </div>
        <div className='h-8 w-full flex'>
          <p className='h-full w-16 text-xs font-bold leading-8'>Duration:</p>
          <p className='h-full w-10 leading-8 text-xs'><span>{routeInfo.duration}             
          </span>hour</p>
        </div>
        <textarea value={routeInfo.description} className="w-full py-3 outline-none min-h-[120px] text-xs" placeholder="How's the trip?" readOnly></textarea>
      </div>
    </div>
  )
}

export default RouteInfo