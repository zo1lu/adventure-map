import { usePathname } from 'next/navigation'
import React, {useEffect, useState, useContext, useRef} from 'react'
import { routeTypes } from '@/data/route'
import { timeZoneArray } from '@/data/dateAndTime'
import { routeLayer, routeSource } from '@/utils/map/layer'
import { createRouteStyle } from '@/utils/map/feature';
import MapContext from '@/context/MapContext';
import { addDrawRouteAndSnapInteractions, removeDrawAndSnapInteractions, removeSelectedFeature } from '@/utils/map/Interaction';
import { routeInfo_fake } from '../../../../fake_data/fake_data';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';
import { getFeatureGeoData } from '@/utils/geoData';

interface RouteInfoProps {
  item: currentItemObject,
  changeRouteRefHandler: (routeType: routeType)=> void,
  edgeLocation: number[][],
  changeRouteEdgeLocation: (edgeLocation:edgeLocationType)=>void
}

const RouteInfo = ({item, changeRouteRefHandler, edgeLocation, changeRouteEdgeLocation}:RouteInfoProps) => {
    const map = useContext(MapContext);
    const mapId = usePathname().split("/")[2]
    const id = item.id
    const status = item.status

    const routeTitleRef = useRef("")
    const routeEdgeLocationRef = useRef([[0,0],[0,0]])
    const routeTypeIdRef = useRef("RT01")
    const routeDescriptionRef = useRef("")
    const routeStartDateRef = useRef("")
    const routeEndDateRef = useRef("")
    const routeStartTimeZoneRef = useRef("")
    const routeEndTimeZoneRef = useRef("")
    const routeDurationRef = useRef(0)
    const [routeInfo, setRouteInfo] = useState({
        id:"",
        title:"",
        depart:[0,0],
        destination:[0,0],
        descrtiption:"",
        start_time:"",
        start_time_zone:"",
        end_time:"",
        end_time_zone:"",
        duration:0,
    })
    const [routeImg, setRouteImg] = useState("")
    const [routeDuration, setRouteDuration] = useState(0)
    const [routeTypeId, setRouteTypeId] = useState("RT01")
    const routeTypeChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        let type = e.target.value
        let typeId = e.target.id
        routeTypeIdRef.current = typeId
        setRouteTypeId(()=>typeId)
        //set new style to current feature
        const routeStyle = createRouteStyle(type)
        //How to pass selected style
        removeSelectedFeature(map)
        routeSource.getFeatureById(id)?.setStyle(routeStyle)
        // routeSource.getFeatureById(id)?.changed()
        const currentProperty = routeSource.getFeatureById(id)?.getProperties()
        routeSource.getFeatureById(id)?.setProperties({...currentProperty, route_type: type})
        // routeSource.changed()
        //add new draw interaction when no feature added to route source
        if (!id){
          removeDrawAndSnapInteractions(map)
          addDrawRouteAndSnapInteractions(map, type)
        }
       
        //set routeType
        changeRouteRefHandler(type)
    }
    const handleRouteState = (type:string, newValue:any) => {
      switch(type){
        case "title":
            setRouteInfo((current)=>{
                return {...current, title:newValue}
            })
            routeTitleRef.current=newValue
            return
        case "description":
            setRouteInfo((current)=>{
                return {...current, description:newValue}
            })
            routeDescriptionRef.current=newValue
            return
        case "startDate":
            setRouteInfo((current)=>{
                return {...current, start_date:newValue}
            })
            routeStartDateRef.current=newValue
            return
        case "startTimeZone":
            setRouteInfo((current)=>{
                return {...current, start_time_zone:newValue}
            })
            routeStartTimeZoneRef.current=newValue
            return
        case "endDate":
            setRouteInfo((current)=>{
                return {...current, end_date:newValue}
            })
            routeEndDateRef.current=newValue
            return
        case "endTimeZone":
            setRouteInfo((current)=>{
                return {...current, end_time_zone:newValue}
            })
            routeEndTimeZoneRef.current=newValue
            return
      }
    }
    const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name
      const dateTimeValue = e.target.value
      switch(name){
        case "start_time":
          const durationFromStartTimeChange = getDurationInHour(dateTimeValue, routeEndDateRef.current, routeStartTimeZoneRef.current, routeEndTimeZoneRef.current)
          setRouteDuration(()=>durationFromStartTimeChange);
          routeDurationRef.current = durationFromStartTimeChange;
          handleRouteState("startDate", dateTimeValue)
          break
        case "end_time":
          const durationFromEndTimeChange = getDurationInHour(routeStartDateRef.current, dateTimeValue, routeStartTimeZoneRef.current, routeEndTimeZoneRef.current)
          setRouteDuration(()=>durationFromEndTimeChange);
          routeDurationRef.current = durationFromEndTimeChange
          handleRouteState("endDate", dateTimeValue)
          break
      };
    };

    const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
      const name = e.target.name
      const timeZoneValue = e.target.value
      switch(name){
        case "start_time_zone":
          const durationFromStartTimeZoneChange = getDurationInHour(routeStartDateRef.current, routeEndDateRef.current, timeZoneValue, routeEndTimeZoneRef.current)
          setRouteDuration(()=> durationFromStartTimeZoneChange);
          routeDurationRef.current = durationFromStartTimeZoneChange
          handleRouteState("startTimeZone", timeZoneValue)
          break
        case "end_time_zone":
          const durationFromEndTimeZoneChange = getDurationInHour(routeStartDateRef.current, routeEndDateRef.current, routeStartTimeZoneRef.current, timeZoneValue)
          setRouteDuration(()=> durationFromEndTimeZoneChange);
          routeDurationRef.current = durationFromEndTimeZoneChange
          handleRouteState("endTimeZone", timeZoneValue)
          break
      }
    }

    //setup Date
    useEffect(()=>{
      routeEdgeLocationRef.current = edgeLocation
    },[edgeLocation])

    useEffect(()=>{
      routeDurationRef.current = routeDuration
    },[routeDuration])

    useEffect(()=>{
      document.getElementById(routeTypeId).checked = true
      routeTypeIdRef.current = routeTypeId
      console.log(routeTypeId)
    },[routeTypeId])

    useEffect(()=>{
      //>>get data from database or create route data
      //>>if id not in route collection create new one
      console.log(status)
      if(status=="queue"){
        //just show this type page not create any feature in the map
        console.log(`About to create ${item.type} feature`)
        //setup the blank route page
        routeTitleRef.current = ""
        routeDescriptionRef.current = ""
        routeTypeIdRef.current = "walk"
        changeRouteEdgeLocation([[0,0],[0,0]])
        setRouteImg(()=>"")
        routeEdgeLocationRef.current = ([[0,0],[0,0]])
        routeStartDateRef.current = getLocalDateTime()
        routeEndDateRef.current = getLocalDateTime()
        routeStartTimeZoneRef.current = getLocalTimeZone()
        routeEndTimeZoneRef.current = getLocalTimeZone()
        setRouteDuration(()=>0)
        setRouteTypeId(()=>"RT01")
        setRouteInfo(()=>{
          return {
            id:id,
            title:"",
            depart:[0,0],
            destination:[0,0],
            descrtiption:"",
            start_time:getLocalDateTime(),
            start_time_zone:getLocalTimeZone(),
            end_time:getLocalDateTime(),
            end_time_zone:getLocalTimeZone(),
            duration:0,
          }
        })
      }else if (status == "new"){
        //create data into database
        //save id, route_type, dpt, dst, geoJson into database
        console.log("Add data into route collection")
        //get data from database and set route info state
        //get data by id from routes collections
        const aboutToCreateData = {
          id: id,
          title: routeInfo.title,
          depart: routeEdgeLocationRef.current[0],
          destination: routeEdgeLocationRef.current[1],
          route_type_id: routeTypeId,
          start_time: routeInfo.start_time,
          start_time_zone: routeInfo.start_time_zone,
          end_time: routeInfo.end_time,
          end_time_zone: routeInfo.end_time_zone,
          duration: routeDuration,
          description: routeInfo.descrtiption,
          geo_data: getFeatureGeoData(id, "route")
        }
        console.log(aboutToCreateData)
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
        })
        console.log("load route Info")
        // const newInfo = routeInfo_fake
        // routeTitleRef.current.value = newInfo.title
        // routeDescriptionRef.current.value = newInfo.descrtiption
        // routeTypeIdRef.current = newInfo.route_type
        // changeRouteEdgeLocation([newInfo.depart,newInfo.destination])
        // setRouteImg(()=>newInfo.image)
        // routeStartDateRef.current.value = newInfo.start_time
        // routeEndDateRef.current.value = newInfo.end_time
        // routeStartTimeZoneRef.current.value = newInfo.start_time_zone
        // routeEndTimeZoneRef.current.value = newInfo.end_time_zone
        // setRouteDuration(()=>newInfo.duration)
        // document.getElementById(newInfo.route_type).checked = true
      }else if (status == "old"){
        //get data from database and set route info state
        console.log("load route Info")
        fetch(`/api/route/${id}`)
        .then((res)=>{
          return res.json()
        })
        .then((data)=>{
          console.log(data)
          const newInfo = data
          routeTitleRef.current = newInfo.title || ""
          routeDescriptionRef.current = newInfo.descrtiption || ""
          routeTypeIdRef.current = newInfo.routeTypeId || ""
          changeRouteEdgeLocation([newInfo.depart || [0,0],newInfo.destination || [0,0]])
          setRouteImg(()=>newInfo.image)
          routeStartDateRef.current = newInfo.startTime || getLocalDateTime()
          routeEndDateRef.current = newInfo.endTime || getLocalDateTime()
          routeStartTimeZoneRef.current = newInfo.startTimeZone || getLocalTimeZone()
          routeEndTimeZoneRef.current = newInfo.endTimeZone || getLocalTimeZone()
          setRouteDuration(()=>(newInfo.duration || 0))
          setRouteTypeId(()=>(newInfo.routeTypeId || "RT01"))
          setRouteInfo((current)=>{
            return {
              ...current,
              title:newInfo.title || "",
              depart:newInfo.depart || [0,0],
              destination:newInfo.destination || [0,0],
              descrtiption: newInfo.description || "",
              start_time: newInfo.startTime || getLocalDateTime(),
              start_time_zone: newInfo.startTimeZone || getLocalTimeZone(),
              end_time: newInfo.endTime || getLocalDateTime(),
              end_time_zone: newInfo.endTimeZone || getLocalTimeZone(),
              duration: newInfo.duration || 0,
            }
            
          })
        })
        
      }
      
        
        return ()=>{
          console.log(id)
          if(status!="queue" && status!="none"){
            console.log("update route Info to Database...")
            // console.log(getFeatureGeoData(id, "route"))
            const routeLatestInfo = {
              id: id,
              title: routeTitleRef.current == "" ? null : routeTitleRef.current,
              depart: routeEdgeLocationRef.current[0],
              destination: routeEdgeLocationRef.current[1],
              route_type_id: routeTypeIdRef.current,
              start_time: routeStartDateRef.current,
              start_time_zone: routeStartTimeZoneRef.current,
              end_time: routeEndDateRef.current,
              end_time_zone: routeEndTimeZoneRef.current,
              duration: routeDurationRef.current,
              description: routeDescriptionRef.current == "" ? null : routeDescriptionRef.current,
              geo_data:getFeatureGeoData(id, "route")
            }
            fetch("/api/route",{
              method:"PATCH",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify(routeLatestInfo)
            })
            .then(res=>res.json())
            .then(res=>console.log(res))
            .catch((e)=>console.log(e))
            //update data
            //clear local input date
          }
          
        }
    },[id, status])
    
  return (
    <div className="w-[320px] min-h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
      <p className='text-xs mb-1'>Route Info {id}</p>
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
            value={routeInfo.start_time}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="start_time"
            // defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
        />
        <select className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' value={routeInfo.start_time_zone} name='start_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
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
            value={routeInfo.end_time}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="end_time"
            // defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
        />
        <select className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' value={routeInfo.end_time_zone} name='end_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
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
      <textarea className="py-3 outline-none min-h-[120px] text-xs" placeholder="How's the trip?" value={routeInfo.descrtiption} onChange={(e)=>handleRouteState("description",e.target.value)}></textarea>
    </div>
  )
}

export default RouteInfo