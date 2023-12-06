import { usePathname } from 'next/navigation'
import React, { useState, useRef, useEffect, useContext, useMemo } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
import { spotTypes } from '@/data/spot'
import { timeZoneArray } from '@/data/dateAndTime'
import { getLocalDateTime, getLocalTimeZone, getDurationInHour } from '@/utils/calculation'
// import { setFeatureSelectedById,toggleHandMapInteraction } from '@/utils/map/Interaction';
// import { spotInfo_fake } from '../../../../deprecate/fake_data';
// import { getFeatureGeoData } from '@/utils/geoData';

interface SpotInfoProps {
  id: string,
}

const SpotInfo = ({id}:SpotInfoProps) => {
  const map = useContext(MapContext);
  const mapId = usePathname().split("/")[3]
  const [message, setMessage] = useState({type:"normal",content:""})
  const [spotImg, setSpotImg] = useState({
    id:"",
    url:""
  })
  const [spotInfo, setSpotInfo] = useState({
    title: "",
    location: [0, 0],
    spot_type_id: "",
    start_date: "",
    start_time_zone:"",
    end_date: "",
    end_time_zone:"",
    duration: 0, // Duration in hours
    description: "",
  })
  useEffect(()=>{
    console.log("load spot Info")
      setMessage(()=>{return {type:"normal",content:"getting data..."}})
      fetch(`/api/spot/${id}`)
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{
        const newInfo = data

        setSpotImg(()=>{
          return newInfo.spotImage?{
            id:newInfo.spotImage.id,
            url:newInfo.spotImage.url
          }:{
            id:"",
            url:""
        }
        })
        setSpotInfo((current)=>{
          return {
            ...current,
            title:newInfo.title || "",
            spot_type_id: newInfo.spotTypeId || "",
            location:newInfo.location,
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
        setMessage(()=>{return {type:"error",content:"no data"}})
      })
      .finally(()=>{
        setMessage(()=>{return {type:"normal",content:""}})
        //setIsChanged(()=>false)
        
      })
    // if(status=="queue"){
    //   //just show this type page not create any feature in the map
    //   console.log(`About to create spot feature`)
    //   //setup the blank spot page
    //   // spotTitleRef.current = ""
    //   // spotTypeIdRef.current = ""
    //   // spotStartDateRef.current = getLocalDateTime()
    //   // spotEndDateRef.current = getLocalDateTime()
    //   // spotStartTimeZoneRef.current = getLocalTimeZone()
    //   // spotEndTimeZoneRef.current = getLocalTimeZone()
    //   // spotDescriptionRef.current = ""
    //   changeSpotLocation([0,0])
    //   setSpotImg(()=>{
    //     return {
    //       id:"",
    //       url:""
    //     }
    //   })
    //   setSpotDuration(()=>0)
    //   setSpotInfo(()=>{
    //     return {
    //       title: "",
    //       location: [0, 0],
    //       spot_type_id: "",
    //       start_date: getLocalDateTime(),
    //       start_time_zone: getLocalTimeZone(),
    //       end_date: getLocalDateTime(),
    //       end_time_zone: getLocalTimeZone(),
    //       duration: 0, // Duration in hours
    //       description: "",
    //     }
    //   })
    //   setIsChanged(()=>false)
    // }else if (status == "new"){
    //   //create data into database
    //   //save id, location, geoJson into database
    //   const aboutToCreateData = {
    //     id: id,
    //     title: spotInfo.title == "" ? null : spotInfo.title,
    //     location: spotLocation,
    //     spot_type_id: spotInfo.spot_type_id == "" ? null : spotInfo.spot_type_id,
    //     start_time: spotInfo.start_date,
    //     start_time_zone: spotInfo.start_time_zone,
    //     end_time: spotInfo.end_date,
    //     end_time_zone: spotInfo.end_time_zone,
    //     duration: spotDuration,
    //     description: spotInfo.description == "" ? null : spotInfo.description,
    //     geo_data: getFeatureGeoData(id, "mark")
    //   }
    //   console.log(aboutToCreateData)
    //   fetch("/api/spot",{
    //     method:"POST",
    //     headers:{
    //       "Content-Type":"application/json"
    //     },
    //     body:JSON.stringify({
    //       mapId: mapId,
    //       spotInfo: aboutToCreateData
    //     })
    //   })
    //   .then((res)=>{
    //     return res.json()
    //   })
    //   .then((data)=>{
    //     console.log(data)
    //     console.log("Add data into spot collection")
    //     toggleHandMapInteraction(map, true)
    //     setFeatureSelectedById(map, "mark", id)
    //     setCurrentSelectedFeature("spot", id)
    //     setMessage(()=>{return {type:"success",content:"create successfully"}})
    //   })
    //   .catch((e)=>{
    //     console.log(e)
    //     // console.log("On no, something wrong when creating route")
    //     setMessage(()=>{return {type:"error",content:"create fail, removing..."}})
    //   })
    //   .finally(()=>{
    //     setMessage(()=>{return {type:"",content:""}})
    //     setIsChanged(()=>false)
    //   })
      
    // }else if (status == "old"){
    // }
    return ()=>{
    }

  },[id])
  const startTimeZoneArray = timeZoneArray.filter(timeZone=>timeZone.offset==spotInfo.start_time_zone)
  const endTimeZoneArray = timeZoneArray.filter(timeZone=>timeZone.offset==spotInfo.end_time_zone)
  const startTimeZone = startTimeZoneArray.length>0?startTimeZoneArray[0]:{offset:"",abbr:"",name:""}
  const endTimeZone = endTimeZoneArray.length>0?endTimeZoneArray[0]:{offset:"",abbr:"",name:""}
  const spotTypeArray = spotTypes.filter(type=>type.id==spotInfo.spot_type_id)
  const spotType = spotTypeArray.length>0?spotTypeArray[0]:{name:""}
  return (
    <div className="w-[360px] h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md ">
      <div className='flex items-center justify-between'>
        <p className='w-20 text-xs'>Spot Info</p>
        <div className='w-[calc(100%-80px)] flex justify-end items-center'>
          {message.content!=""?<div className='w-full text-xs text-end' style={message.type=="success"?{color:'green'}:message.type=="error"?{color:'red'}:{color:'black'}}>{message.content}</div>:null}
          
        </div>
      </div>
      
      <hr className='border-1 my-2'/>
      <div className='overflow-y-scroll'>
        <div className='w-full flex mb-2 justify-between'>
          <input value={spotInfo.title} className="w-[calc(100%-48px)] h-8 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Spot Title' readOnly/>
        </div>
        <div className='flex mb-2'>
          <p className='w-1/2 text-xs'><span>Long: {spotInfo.location[0].toFixed(3)}</span></p>
          <p className='w-1/2 text-xs'><span>Lat: {spotInfo.location[1].toFixed(3)}</span></p>
        </div>
        {id&&spotImg.id?<div className='w-full h-[240px] min-h-[240px] overflow-hidden relative'>
          <Image 
              src={spotImg.url}
              width={300}
              height={240}
              quality={100}
              alt="spot_image"
              className='w-[500px] h-[360px] object-cover'
          />
        </div>
        :null}
        
        <div className='h-10 w-[calc(100%-10px)] flex'>
            <p className='text-xs w-fit font-bold mr-3 leading-10'>Spot Type: </p>
            <p className='text-xs w-fit leading-10'>{spotType.name}</p>
        </div>
        {/* start time */}
        <div className='h-8 w-full flex'>
          <p className='h-full w-14 text-xs font-bold leading-8'>From: &#8614;</p>
          <input
              value={spotInfo.start_date}
              className='h-full w-1/3 py-3 px-3 text-xs outline-1 outline-gray-100 flex-grow'
              type="datetime-local"
              name="start-date"
              // defaultValue={getLocalDateTime()}
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
              value={spotInfo.end_date}
              className='h-full w-1/3 py-3 px-3 text-xs outline-1 outline-gray-100 flex-grow'
              type="datetime-local"
              name="end-date"
              // defaultValue={getLocalDateTime()}
              min="2020-06-30T00:00"
              max="2050-06-30T00:00"
              readOnly
          />
          <p className='h-full text-xs leading-8 w-20'>UTC {endTimeZone.offset} {endTimeZone.abbr}</p>
        </div>
        <div className='h-8 w-full flex'>
          <p className='h-full w-16 text-xs font-bold leading-8'>Duration:</p>
          <p className='h-full w-10 leading-8 text-xs'><span>{spotInfo.duration}              
          </span>hour</p>
        </div>
        <textarea value={spotInfo.description} className="w-full py-3 outline-none min-h-[120px] text-xs" readOnly></textarea>
      </div>
      
      
    </div>
  )
}

export default SpotInfo