import { usePathname } from 'next/navigation'
import React, {useEffect, useState, useContext, useRef, useMemo} from 'react'
import { routeTypes } from '@/data/route'
import { timeZoneArray } from '@/data/dateAndTime'
import { routeSource } from '@/utils/map/layer'
import MapContext from '@/context/MapContext';
import { setFeatureSelectedById, setSelectedFeatureBoundary, toggleHandMapInteraction } from '@/utils/map/Interaction';
import { routeInfo_fake } from '../../../../deprecate/fake_data';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';
import { getFeatureGeoData } from '@/utils/geoData';

interface RouteInfoProps {
  id: string,
  status: currentStatusType,
  currentMode: drawModeType,
  changeRouteRefHandler: (routeType: routeType)=> void,
  edgeLocation: number[][],
  changeRouteEdgeLocation: (edgeLocation:edgeLocationType)=>void
  setCurrentSelectedFeature:(type:selectedFeatureType, id:string)=>void
}

const RouteInfo = ({id, status, currentMode, changeRouteRefHandler, edgeLocation, changeRouteEdgeLocation, setCurrentSelectedFeature}:RouteInfoProps) => {
    const map = useContext(MapContext);
    const mapId = usePathname().split("/")[2]
    const [message, setMessage] = useState({type:"normal",content:""})
    const [isChanged, setIsChanged] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
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
    const [routeImg, setRouteImg] = useState("")
    const [routeDuration, setRouteDuration] = useState(0)
    const [routeTypeId, setRouteTypeId] = useState("RT01")
    const routeTypeChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {

        let type = e.target.value
        let typeId = e.target.id
        //?
        //routeTypeIdRef.current = typeId
        setRouteTypeId(()=>typeId)       
        //set routeType
        changeRouteRefHandler(type)
    }
    const dataUpdateHandler = () => {
      console.log("update current data")
      // if(status!="queue" && status!="none"){
      //   console.log("update route Info to Database...")
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
      // }
    }
    const handleRouteState = (type:string, newValue:any) => {
      switch(type){
        case "title":
            setRouteInfo((current)=>{
                return {...current, title:newValue}
            })
            // routeTitleRef.current=newValue
            return
        case "description":
            setRouteInfo((current)=>{
                return {...current, description:newValue}
            })
            // routeDescriptionRef.current=newValue
            return
        case "startDate":
            setRouteInfo((current)=>{
                return {...current, start_date:newValue}
            })
            // routeStartDateRef.current=newValue
            return
        case "startTimeZone":
            setRouteInfo((current)=>{
                return {...current, start_time_zone:newValue}
            })
            // routeStartTimeZoneRef.current=newValue
            return
        case "endDate":
            setRouteInfo((current)=>{
                return {...current, end_date:newValue}
            })
            // routeEndDateRef.current=newValue
            return
        case "endTimeZone":
            setRouteInfo((current)=>{
                return {...current, end_time_zone:newValue}
            })
            // routeEndTimeZoneRef.current=newValue
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
          // routeDurationRef.current = durationFromStartTimeChange;
          handleRouteState("startDate", dateTimeValue)
          break
        case "end-date":
          const durationFromEndTimeChange = getDurationInHour(routeInfo.start_date, dateTimeValue, routeInfo.start_time_zone, routeInfo.end_time_zone)
          setRouteDuration(()=>durationFromEndTimeChange);
          // routeDurationRef.current = durationFromEndTimeChange
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
          // routeDurationRef.current = durationFromStartTimeZoneChange
          handleRouteState("startTimeZone", timeZoneValue)
          break
        case "end-time-zone":
          const durationFromEndTimeZoneChange = getDurationInHour(routeInfo.start_date, routeInfo.end_date, routeInfo.start_time_zone, timeZoneValue)
          setRouteDuration(()=> durationFromEndTimeZoneChange);
          // routeDurationRef.current = durationFromEndTimeZoneChange
          handleRouteState("endTimeZone", timeZoneValue)
          break
      }
    }
    //setup Date
    // useEffect(()=>{
    //   routeEdgeLocationRef.current = edgeLocation
    // },[edgeLocation])

    // useEffect(()=>{
    //   routeDurationRef.current = routeDuration
    // },[routeDuration])
    
    useMemo(()=>{
      if(!isInitialLoad){
        setIsChanged(()=>true)}
      else{
        setIsChanged(()=>false)
        setIsInitialLoad(()=>false)
      }
    },[routeInfo, routeDuration, routeTypeId, routeImg, edgeLocation]) 

    useEffect(()=>{
      document.getElementById(routeTypeId).checked = true
      // routeTypeIdRef.current = routeTypeId
    },[routeTypeId])

    useEffect(()=>{
      //>>get data from database or create route data
      //>>if id not in route collection create new one
      console.log("route page reload")
      console.log("current state", status)
      if(status=="queue"){
        //just show this type page not create any feature in the map
        console.log(`About to create route feature`)
        //setup the blank route page
        // routeTitleRef.current = ""
        // routeStartDateRef.current = getLocalDateTime()
        // routeEndDateRef.current = getLocalDateTime()
        // routeStartTimeZoneRef.current = getLocalTimeZone()
        // routeEndTimeZoneRef.current = getLocalTimeZone()
        // routeDescriptionRef.current = ""
        //???
        //routeTypeIdRef.current = "walk" or "RT01"
        //routeEdgeLocationRef.current = ([[0,0],[0,0]])
        changeRouteRefHandler("walk")
        changeRouteEdgeLocation([[0,0],[0,0]])
        setRouteImg(()=>"")
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
        //create data into database
        //save id, route_type, dpt, dst, geoJson into database
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
        console.log(aboutToCreateData)
        //if create data successfully make feature selected else remove it
        setMessage(()=>{return {type:"normal",content:"creating..."}})
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
          console.log(data)
          //do we need to reassign data? no!
          console.log("Add data into route collection")
          toggleHandMapInteraction(map, true)
          setFeatureSelectedById(map, "route", id)
          const currentRouteExtent = routeSource.getFeatureById(id)?.getGeometry()?.getExtent()
          setSelectedFeatureBoundary(currentRouteExtent)
          setCurrentSelectedFeature("route", id)
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
        }else if (status == "old"){
        //get data from database and set route info state
        console.log("Get route Info from db")
        console.log("current Id >>>",id)
        fetch(`/api/route/${id}`)
        .then((res)=>{
          return res.json()
        })
        .then((data)=>{
          console.log(data)
          const newInfo = data
          // routeTypeIdRef.current = newInfo.routeTypeId
          changeRouteEdgeLocation([newInfo.depart || [0,0],newInfo.destination || [0,0]])
          setRouteImg(()=>(newInfo.image || ""))
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
          setMessage(()=>{return {type:"error",content:"no data in database, removing..."}})
        })
        .finally(()=>{
          setMessage(()=>{return {type:"normal",content:""}})
          setIsChanged(()=>false)
        })
      }
        
        return ()=>{
          console.log(id)
          
        }
    },[id])


    
  return (
    <div className="w-[360px] min-h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
      <p className='text-xs mb-1'>Route Info</p>
      <hr className='border-1 mb-2'/>
      
      <input className="h-12 py-1 mb-3 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Title' value={routeInfo.title} onChange={e=>handleRouteState("title",e.target.value)}/>
      <div className='flex items-center gap-3 mb-3'>
        <p className='w-[32px] text-xs '>Dpt:<span className='pl-3'>LONG_{edgeLocation[0][0].toFixed(3)},LAT_{edgeLocation[0][1].toFixed(3)}</span></p>
        {/* <input className='w-[calc(50%-30px)]  text-xs outline-none focus:border-b-[1px] focus:border-black' type='text' name='route_depart' /> */}
      </div>
      <div className='flex items-center gap-3 mb-3'>
        <span className='text-xs'>&harr;</span>
        <p className='w-[32px] text-xs'>Dst:<span className='pl-3'>LONG_{edgeLocation[1][0].toFixed(3)},LAT_{edgeLocation[1][1].toFixed(3)}</span></p>
        {/* <input className='w-[calc(50%-30px)] text-xs outline-none focus:border-b-[1px] focus:border-black' type='text' name='route_destination' /> */}
      </div>
      <input className="h-10 text-xs py-2" type='file'/>
      <div className='h-fit w-fit py-3'>
        {routeTypes.map((routeType, i)=>{
        return <div className='flex gap-3 items-center h-6' key={i}>
                    <input id={routeType.id} value={routeType.value} type='radio' name='routeType' defaultChecked={i==0} onChange={(e)=>routeTypeChangeHandler(e)}/>
                    <label className="text-xs" htmlFor={routeType.id}>{routeType.name}</label>
                </div>
        })}
      </div>
      {/* start time */}
      <div className='h-8 w-full flex'>
        <p className='h-full w-14 text-xs font-bold leading-8'>From: &#8614;</p>
        <input
            value={routeInfo.start_date}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="start-date"
            // defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
        />
        <select className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' value={routeInfo.start_time_zone} name='start-time-zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
            <option className='text-xs' defaultValue={"0"}>Time Zone</option>
            {timeZoneArray.map(((timeZone,i)=>{
                return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}  {timeZone.abbr}</option>
            }))}
        </select>
      </div>
      {/* end time */}
      <div className='h-8 w-full flex'>
        <p className='h-full w-14 text-xs font-bold leading-8'>&#8612; To:</p>
        <input
            value={routeInfo.end_date}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="end-date"
            // defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
        />
        <select className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' value={routeInfo.end_time_zone} name='end-time-zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
            <option className='text-xs' value={"0"}>Time Zone</option>
            {timeZoneArray.map(((timeZone,i)=>{
                return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}  {timeZone.abbr}</option>
            }))}
        </select>
      </div>
      <div className='h-8 w-full flex'>
        <p className='h-full w-16 text-xs font-bold leading-8'>Duration:</p>
        <p className='h-full w-10 leading-8 text-xs'><span>{routeDuration}             
        </span>hour</p>
      </div>
      <textarea value={routeInfo.description} className="py-3 outline-none min-h-[120px] text-xs" placeholder="How's the trip?"  onChange={(e)=>handleRouteState("description",e.target.value)}></textarea>
      {message.content!=""?<div className='w-full h-10 flex justify-center text-xs' style={message.type=="success"?{color:'green'}:message.type=="error"?{color:'red'}:{color:'black'}}>{message.content}</div>:<></>}
      {status!="queue"&&isChanged&&message.content==""?
      <button className='w-full h-fit border-black border-2 rounded-md disabled:border-gray-200 disabled:text-gray-200' onClick={()=>{dataUpdateHandler()}}>Save Change</button>
      :<></>}
    </div>
  )
}

export default RouteInfo