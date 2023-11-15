import React, {useEffect, useState, useContext, useRef} from 'react'
import { routeTypes } from '@/data/route'
import { timeZoneArray } from '@/data/dateAndTime'
import { routeLayer, routeSource } from '@/utils/map/layer'
import { createRouteStyle } from '@/utils/map/feature';
import MapContext from '@/context/MapContext';
import { addDrawRouteAndSnapInteractions, removeDrawAndSnapInteractions, removeSelectedFeature } from '@/utils/map/Interaction';
import { routeInfo_fake } from '../../../../fake_data/fake_data';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';

interface RouteInfoProps {
  item: currentItemObject,
  changeRouteRefHandler: (routeType: routeType)=> void,
  edgeLocation: number[][],
  changeRouteEdgeLocation: (edgeLocation:edgeLocationType)=>void
}

const RouteInfo = ({item, changeRouteRefHandler, edgeLocation, changeRouteEdgeLocation}:RouteInfoProps) => {
    const map = useContext(MapContext);
    const id = item.id
    const status = item.status
    const routeTitleRef = useRef<HTMLInputElement>(null)
    const routeTypeRef = useRef<routeType>("walk")
    const routeDescriptionRef = useRef<HTMLTextAreaElement>(null)
    const routeStartDateRef = useRef<HTMLInputElement>(null)
    const routeEndDateRef = useRef<HTMLInputElement>(null)
    const routeStartTimeZoneRef = useRef<HTMLSelectElement>(null)
    const routeEndTimeZoneRef = useRef<HTMLSelectElement>(null)
    const [routeImg, setRouteImg] = useState("")
    const [routeDuration, setRouteDuration] = useState(0)
    // const [routeInfo, setRouteInfo] = useState({
    //   id:"",
    //   title:"",
    //   image:"",
    //   depart:[0,0],
    //   destination:[0,0],
    //   route_type:"",
    //   descrtiption:"",
    //   start_time:"",
    //   start_time_zone:"",
    //   end_time:"",
    //   end_time_zone:"",
    //   duration:0,
    //   geo_data:{}
    // })
    

    const routeTypeChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
      let type = e.target.value
      routeTypeRef.current = type

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

    const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name
      const dateTimeValue = e.target.value
      switch(name){
        case "start_time":
          const durationFromStartTimeChange = getDurationInHour(dateTimeValue, routeEndDateRef.current.value, routeStartTimeZoneRef.current.value, routeEndTimeZoneRef.current.value)
          return setRouteDuration(()=>durationFromStartTimeChange);
        case "end_time":
          const durationFromEndTimeChange = getDurationInHour(routeStartDateRef.current.value, dateTimeValue, routeStartTimeZoneRef.current.value, routeEndTimeZoneRef.current.value)
          return setRouteDuration(()=>durationFromEndTimeChange);
      };
    };

    const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
      const name = e.target.name
      const timeZoneValue = e.target.value
      switch(name){
        case "start_time_zone":
          const durationFromStartTimeZoneChange = getDurationInHour(routeStartDateRef.current.value, routeEndDateRef.current.value, timeZoneValue, routeEndTimeZoneRef.current.value)
          return setRouteDuration(()=> durationFromStartTimeZoneChange);
        case "end_time_zone":
          const durationFromEndTimeZoneChange = getDurationInHour(routeStartDateRef.current.value, routeEndDateRef.current.value, routeStartTimeZoneRef.current.value, timeZoneValue)
          return setRouteDuration(()=> durationFromEndTimeZoneChange);
      }
    }

    //setup Date

    useEffect(()=>{
      //>>get data from database or create route data
      //>>if id not in route collection create new one
      if(status=="queue"){
        //just show this type page not create any feature in the map
        console.log(`About to create ${item.type} feature`)
        //setup the blank route page
        routeTitleRef.current.value = ""
        routeDescriptionRef.current.value = ""
        routeTypeRef.current = "walk"
        changeRouteEdgeLocation([[0,0],[0,0]])
        setRouteImg(()=>"")
        routeStartDateRef.current.value = getLocalDateTime()
        routeEndDateRef.current.value = getLocalDateTime()
        routeStartTimeZoneRef.current.value = getLocalTimeZone()
        routeEndTimeZoneRef.current.value = getLocalTimeZone()
        setRouteDuration(()=>0)
        document.getElementById("walk").checked = true
      }else if (status == "new"){
        //create data into database
        //save id, route_type, dpt, dst, geoJson into database
        console.log("Add data into route collection")
        //get data from database and set route info state
        //get data by id from routes collections
        console.log("load route Info")
        const newInfo = routeInfo_fake
        routeTitleRef.current.value = newInfo.title
        routeDescriptionRef.current.value = newInfo.descrtiption
        routeTypeRef.current = newInfo.route_type
        changeRouteEdgeLocation([newInfo.depart,newInfo.destination])
        setRouteImg(()=>newInfo.image)
        routeStartDateRef.current.value = newInfo.start_time
        routeEndDateRef.current.value = newInfo.end_time
        routeStartTimeZoneRef.current.value = newInfo.start_time_zone
        routeEndTimeZoneRef.current.value = newInfo.end_time_zone
        setRouteDuration(()=>newInfo.duration)
        document.getElementById(newInfo.route_type).checked = true
      }else if (status == "old"){
        //get data from database and set route info state
        console.log("load route Info")
        const newInfo = routeInfo_fake
        routeTitleRef.current.value = newInfo.title
        routeDescriptionRef.current.value = newInfo.descrtiption
        routeTypeRef.current = newInfo.route_type
        changeRouteEdgeLocation([newInfo.depart,newInfo.destination])
        setRouteImg(()=>newInfo.image)
        routeStartDateRef.current.value = newInfo.start_time
        routeEndDateRef.current.value = newInfo.end_time
        routeStartTimeZoneRef.current.value = newInfo.start_time_zone
        routeEndTimeZoneRef.current.value = newInfo.end_time_zone
        setRouteDuration(()=>newInfo.duration)
        document.getElementById(newInfo.route_type).checked = true
      }
      
        
        return ()=>{
          if(status!="queue"){
            console.log("update route Info to Database...")
            //update data
            //clear local input date
          }
          
        }
    },[id, status])

  return (
    <div className="w-[320px] min-h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
      <p className='text-xs mb-1'>Route Info {id}</p>
      <hr className='border-1 mb-2'/>
      
      <input className="h-12 py-1 mb-3 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Title' ref={routeTitleRef}/>
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
                    <input id={routeType.value} value={routeType.value} type='radio' name='routeType' defaultChecked={i==0} onChange={(e)=>routeTypeChangeHandler(e)}/>
                    <label className="text-xs" htmlFor={routeType.value}>{routeType.name}</label>
                </div>
        })}
      </div>
      {/* start time */}
      <div className='h-8 w-full flex'>
        <p className='h-full w-14 text-xs font-bold leading-8'>From: &#8614;</p>
        <input
            ref={routeStartDateRef}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="start_time"
            defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
        />
        <select className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' ref={routeStartTimeZoneRef} name='start_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
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
            ref={routeEndDateRef}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="end_time"
            defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
        />
        <select className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' ref={routeEndTimeZoneRef} name='end_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
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
      <textarea className="py-3 outline-none min-h-[120px] text-xs" placeholder="How's the trip?" ref={routeDescriptionRef}></textarea>
    </div>
  )
}

export default RouteInfo