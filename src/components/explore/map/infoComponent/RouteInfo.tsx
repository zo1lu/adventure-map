import Image from 'next/image'
import React, {useEffect, useState} from 'react'
import { routeTypes } from '@/data/route'
import { timeZoneArray } from '@/data/dateAndTime'
import { getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';

interface RouteInfoProps {
  id: string,
}

const RouteInfo = ({id}:RouteInfoProps) => {
    const [message, setMessage] = useState({type:"normal",content:""})
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
    const [routeTypeId, setRouteTypeId] = useState("RT01")

    useEffect(()=>{
      fetch(`/api/route/${id}`)
        .then((res)=>{
          return res.json()
        })
        .then((data)=>{
          const newInfo = data
          setRouteImg(()=>{
            return newInfo.routeImage?{
              id:newInfo.routeImage.id,
              url:newInfo.routeImage.url
            }:{
              id:"",
              url:""
          }
          })
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
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{return {type:"error",content:"no data in database, removing..."}})
        })
        .finally(()=>{
          setMessage(()=>{return {type:"normal",content:""}})
        })
    },[id])
    const startTimeZoneArray = timeZoneArray.filter(timeZone=>timeZone.offset==routeInfo.start_time_zone)
  const endTimeZoneArray = timeZoneArray.filter(timeZone=>timeZone.offset==routeInfo.end_time_zone)
  const startTimeZone = startTimeZoneArray.length>0?startTimeZoneArray[0]:{offset:"",abbr:"",name:""}
  const endTimeZone = endTimeZoneArray.length>0?endTimeZoneArray[0]:{offset:"",abbr:"",name:""}
    
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
          <input className="h-8 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Title' value={routeInfo.title} readOnly/>
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
                      <input id={routeType.id} value={routeType.value} type='radio' name='routeType' className='hidden' checked={routeTypeId=== routeType.id} readOnly/>
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
              readOnly
          />
          <p className='h-full text-xs leading-8 w-20'>UTC {startTimeZone.offset} {startTimeZone.abbr}</p>
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
              readOnly
          />
          <p className='h-full text-xs leading-8 w-20'>UTC {endTimeZone.offset} {endTimeZone.abbr}</p>
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