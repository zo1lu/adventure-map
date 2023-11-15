import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { spotTypes } from '@/data/spot'
import { timeZoneArray } from '@/data/dateAndTime'
import { getLocalDateTime, getLocalTimeZone, getDurationInHour } from '@/utils/calculation'
import { spotInfo_fake } from '../../../../fake_data/fake_data';
interface SpotInfoProps {
  item: currentItemObject,
  spotLocation: spotLocationType,
  changeSpotLocation: (newSpotLocation:spotLocationType)=> void
}

const SpotInfo = ({item, spotLocation, changeSpotLocation}:SpotInfoProps) => {
  const id = item.id
  const status = item.status
  const spotTitleRef = useRef<HTMLInputElement>(null)
  const spotTypeRef = useRef<HTMLSelectElement>(null)
  const spotDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const spotStartDateRef = useRef<HTMLInputElement>(null)
  const spotEndDateRef = useRef<HTMLInputElement>(null)
  const spotStartTimeZoneRef = useRef<HTMLSelectElement>(null)
  const spotEndTimeZoneRef = useRef<HTMLSelectElement>(null)
  const [spotImg, setSpotImg] = useState("")
  const [spotDuration, setSpotDuration] = useState(0)
  // const [spotInfo, setSpotInfo] = useState({
  //   title: "",
  //   spot_type: "",
  //   location: [0, 0],
  //   images: "",
  //   start_time: "",
  //   start_time_zone:"",
  //   end_time: "",
  //   end_time_zone:"",
  //   duration: 0, // Duration in hours
  //   description: "",
  //   geo_data:{}
  // })
  const spotTypeChangeHandler = (e:React.ChangeEvent<HTMLSelectElement>) => {
    let spotType = e.target.value
    //
  }

  const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const dateTimeValue = e.target.value
    switch(name){
      case "start_time":
        const durationFromStartTimeChange = getDurationInHour(dateTimeValue, spotEndDateRef.current.value, spotStartTimeZoneRef.current.value, spotEndTimeZoneRef.current.value)
        return setSpotDuration(()=>durationFromStartTimeChange);
      case "end_time":
        const durationFromEndTimeChange = getDurationInHour(spotStartDateRef.current.value, dateTimeValue, spotStartTimeZoneRef.current.value, spotEndTimeZoneRef.current.value)
        return setSpotDuration(()=>durationFromEndTimeChange);
    };
  };

  const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name
    const timeZoneValue = e.target.value
    switch(name){
      case "start_time_zone":
        const durationFromStartTimeZoneChange = getDurationInHour(spotStartDateRef.current.value, spotEndDateRef.current.value, timeZoneValue, spotEndTimeZoneRef.current.value)
        return setSpotDuration(()=> durationFromStartTimeZoneChange);
      case "end_time_zone":
        const durationFromEndTimeZoneChange = getDurationInHour(spotStartDateRef.current.value, spotEndDateRef.current.value, spotStartTimeZoneRef.current.value, timeZoneValue)
        return setSpotDuration(()=> durationFromEndTimeZoneChange);
    }
  }

  useEffect(()=>{
    if(status=="queue"){
      //just show this type page not create any feature in the map
      console.log(`About to create ${item.type} feature`)
      //setup the blank spot page
      spotTitleRef.current.value = ""
      spotDescriptionRef.current.value = ""
      spotTypeRef.current.value = ""
      changeSpotLocation([0,0])
      setSpotImg(()=>"")
      spotStartDateRef.current.value = getLocalDateTime()
      spotEndDateRef.current.value = getLocalDateTime()
      spotStartTimeZoneRef.current.value = getLocalTimeZone()
      spotEndTimeZoneRef.current.value = getLocalTimeZone()
      setSpotDuration(()=>0)
    }else if (status == "new"){
      //create data into database
      //save id, location, geoJson into database
      console.log("Add data into spots collection")
      //get data from database and show spot info 
      //get data by id from spots collections
      console.log("load spot Info")
      const newInfo = spotInfo_fake
      spotTitleRef.current.value = newInfo.title
      spotDescriptionRef.current.value = newInfo.description
      spotTypeRef.current.value = newInfo.spot_type
      changeSpotLocation(newInfo.location)
      setSpotImg(()=>newInfo.images[0])
      spotStartDateRef.current.value = newInfo.start_time
      spotEndDateRef.current.value = newInfo.end_time
      spotStartTimeZoneRef.current.value = newInfo.start_time_zone
      spotEndTimeZoneRef.current.value = newInfo.end_time_zone
      setSpotDuration(()=>newInfo.duration)
    }else if (status == "old"){
      console.log("load spot Info")
      const newInfo = spotInfo_fake
      spotTitleRef.current.value = newInfo.title
      spotDescriptionRef.current.value = newInfo.description
      spotTypeRef.current.value = newInfo.spot_type
      changeSpotLocation(newInfo.location)
      setSpotImg(()=>newInfo.images[0])
      spotStartDateRef.current.value = newInfo.start_time
      spotEndDateRef.current.value = newInfo.end_time
      spotStartTimeZoneRef.current.value = newInfo.start_time_zone
      spotEndTimeZoneRef.current.value = newInfo.end_time_zone
      setSpotDuration(()=>newInfo.duration)
    }

    return ()=>{
      if(status!="queue"){
        console.log("update route Info to Database...")
      }
    }
  },[id, status])

  return (
    <div className="w-[320px] h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md overflow-y-scroll">
      <p className='text-xs mb-1'>Spot Info {id}</p>
      <hr className='border-1 mb-2'/>
      <input ref={spotTitleRef} className="h-12 py-3 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Spot Title'/>
      <div className='flex mb-3'>
        <p className='w-1/2 text-xs'><span>Long: {spotLocation[0].toFixed(3)}</span></p>
        <p className='w-1/2 text-xs'><span>Lat: {spotLocation[1].toFixed(3)}</span></p>
      </div>
      {spotImg?<Image 
        src={spotImg}
        width={400}
        height={400}
        alt="spot_image"
      />
      :<label className='h-fit w-fit text-xs py-2 px-3 border-2 border-emerald-950 rounded-md'>
        <input className="hidden" type='file'/>
        Select Photo
      </label>}
      
      
      <select ref={spotTypeRef} className='h-10 w-[calc(100%-10px)] py-3 mt-1 text-xs outline-1 outline-gray-100' defaultValue={""} onChange={(e)=>spotTypeChangeHandler(e)}>
        <option className='text-xs' value={""}>❓ Spot Type</option>
        {spotTypes.map(((spotType,i)=>{
            return <option className='text-xs' key={i} value={spotType.value}>{spotType.name}</option>
        }))}
      </select>
      {/* start time */}
      <div className='h-8 w-full flex'>
        <p className='h-full w-14 text-xs font-bold leading-8'>From: &#8614;</p>
        <input
            ref={spotStartDateRef}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="start_time"
            defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
        />
        <select ref={spotStartTimeZoneRef}  className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' name='start_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
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
            ref={spotEndDateRef}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="end_time"
            defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
            
        />
        <select className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' ref={spotEndTimeZoneRef} name='end_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
            <option className='text-xs' value={"0"}>Time Zone</option>
            {timeZoneArray.map(((timeZone,i)=>{
                return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}  {timeZone.abbr}</option>
            }))}
        </select>
      </div>
      <div className='h-8 w-full flex'>
        <p className='h-full w-16 text-xs font-bold leading-8'>Duration:</p>
        <p className='h-full w-10 leading-8 text-xs'><span>{spotDuration}              
        </span>hour</p>
      </div>
      <textarea ref={spotDescriptionRef} className="py-3 outline-none min-h-[120px] text-xs" placeholder="How's this location?"></textarea>
    </div>
  )
}

export default SpotInfo