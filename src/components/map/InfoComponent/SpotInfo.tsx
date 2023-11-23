import { usePathname } from 'next/navigation'
import React, { useState, useRef, useEffect, useContext, useMemo } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
import { spotTypes } from '@/data/spot'
import { timeZoneArray } from '@/data/dateAndTime'
import { getLocalDateTime, getLocalTimeZone, getDurationInHour } from '@/utils/calculation'
import { setFeatureSelectedById,toggleHandMapInteraction } from '@/utils/map/Interaction';
import { spotInfo_fake } from '../../../../fake_data/fake_data';
import { getFeatureGeoData } from '@/utils/geoData';

interface SpotInfoProps {
  id: string,
  status: currentStatusType,
  spotLocation: spotLocationType,
  changeSpotLocation: (newSpotLocation:spotLocationType)=> void
  setCurrentSelectedFeature:(type:selectedFeatureType, id:string)=>void
}

const SpotInfo = ({id, status, spotLocation, changeSpotLocation, setCurrentSelectedFeature}:SpotInfoProps) => {
  const map = useContext(MapContext);
  const mapId = usePathname().split("/")[2]
  const [message, setMessage] = useState({type:"normal",content:""})
  const [isChanged, setIsChanged] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  // const spotTitleRef = useRef("")
  // const spotLocationRef = useRef([0,0])
  // const spotTypeIdRef = useRef("")
  // const spotStartDateRef = useRef("")
  // const spotStartTimeZoneRef = useRef("")
  // const spotEndDateRef = useRef("")
  // const spotEndTimeZoneRef = useRef("")
  // const spotDurationRef = useRef(0)
  // const spotDescriptionRef = useRef("")
  const [spotImg, setSpotImg] = useState("")
  const [spotDuration, setSpotDuration] = useState(0)
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

  // const spotTypeChangeHandler = (e:React.ChangeEvent<HTMLSelectElement>) => {
  //   let spotType = e.target.value
  //   //
  // }
  const dataUpdateHandler = () => {
    console.log("update route Info to Database...")
        const spotLatestInfo = {
          id: id,
          title: spotInfo.title == "" ? null : spotInfo.title,
          location: spotLocation,
          spot_type_id: spotInfo.spot_type_id == "" ? null : spotInfo.spot_type_id,
          start_time: spotInfo.start_date,
          start_time_zone: spotInfo.start_time_zone,
          end_time: spotInfo.end_date,
          end_time_zone: spotInfo.end_time_zone,
          duration: spotDuration,
          description: spotInfo.description == "" ? null : spotInfo.description,
          geo_data: getFeatureGeoData(id, "mark")
        }
        setMessage(()=>{return {type:"normal",content:"updating..."}})
        fetch("/api/spot",{
          method:"PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(spotLatestInfo)
        })
        .then(res=>res.json())
        .then(res=>{
          console.log(res)
          setMessage(()=>{return {type:"success",content:"successfully updated"}})
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{return {type:"error",content:"updated failed"}})
        })
        .finally(()=>{
          setTimeout(()=>{
            setMessage(()=>{return {type:"",content:""}})
            setIsChanged(()=>false)
          },3000)
        })
      

  }
  const handleSpotState = (type:string, newValue:any) => {
    switch(type){
      case "title":
          setSpotInfo((current)=>{
            return {...current, title:newValue}
          })
          // spotTitleRef.current = newValue
          return
      case "spotType":
          setSpotInfo((current)=>{
            return {...current, spot_type_id:newValue}
          })
          // spotTypeIdRef.current = newValue
          return
      case "description":
          setSpotInfo((current)=>{
              return {...current, description:newValue}
          })
          // spotDescriptionRef.current=newValue
          return
      case "startDate":
          setSpotInfo((current)=>{
              return {...current, start_date:newValue}
          })
          // spotStartDateRef.current=newValue
          return
      case "startTimeZone":
          setSpotInfo((current)=>{
              return {...current, start_time_zone:newValue}
          })
          // spotStartTimeZoneRef.current=newValue
          return
      case "endDate":
          setSpotInfo((current)=>{
              return {...current, end_date:newValue}
          })
          // spotEndDateRef.current=newValue
          return
      case "endTimeZone":
          setSpotInfo((current)=>{
              return {...current, end_time_zone:newValue}
          })
          // spotEndTimeZoneRef.current=newValue
          return
    }
  }
  const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const dateTimeValue = e.target.value
    switch(name){
      case "start-date":
        const durationFromStartTimeChange = getDurationInHour(dateTimeValue, spotInfo.end_date, spotInfo.start_time_zone, spotInfo.end_time_zone)
        setSpotDuration(()=>durationFromStartTimeChange);
        // spotDurationRef.current = durationFromStartTimeChange;
        handleSpotState("startDate" ,dateTimeValue)
        return 
      case "end-date":
        const durationFromEndTimeChange = getDurationInHour(spotInfo.start_date, dateTimeValue, spotInfo.start_time_zone, spotInfo.end_time_zone)
        setSpotDuration(()=>durationFromEndTimeChange);
        // spotDurationRef.current = durationFromEndTimeChange
        handleSpotState("endDate" , dateTimeValue)
        return 
    };
  };

  const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name
    const timeZoneValue = e.target.value
    switch(name){
      case "start-time-zone":
        const durationFromStartTimeZoneChange = getDurationInHour(spotInfo.start_date, spotInfo.end_date, timeZoneValue, spotInfo.end_time_zone)
        // spotDurationRef.current = durationFromStartTimeZoneChange
        setSpotDuration(()=> durationFromStartTimeZoneChange);
        handleSpotState("startTimeZone" , timeZoneValue)
        return 
      case "end-time-zone":
        const durationFromEndTimeZoneChange = getDurationInHour(spotInfo.start_date, spotInfo.end_date, spotInfo.start_time_zone, timeZoneValue)
        // spotDurationRef.current = durationFromEndTimeZoneChange
        setSpotDuration(()=> durationFromEndTimeZoneChange);
        handleSpotState("endTimeZone" , timeZoneValue)
        return 
    }
  }
  // useEffect(()=>{
  //   spotLocationRef.current = spotLocation
  // },[spotLocation])
  useMemo(()=>{
    if(!isInitialLoad){
      setIsChanged(()=>true)}
    else{
      setIsChanged(()=>false)
      setIsInitialLoad(()=>false)
    }
  },[spotInfo, spotDuration, spotImg, spotLocation])

  useEffect(()=>{
    if(status=="queue"){
      //just show this type page not create any feature in the map
      console.log(`About to create spot feature`)
      //setup the blank spot page
      // spotTitleRef.current = ""
      // spotTypeIdRef.current = ""
      // spotStartDateRef.current = getLocalDateTime()
      // spotEndDateRef.current = getLocalDateTime()
      // spotStartTimeZoneRef.current = getLocalTimeZone()
      // spotEndTimeZoneRef.current = getLocalTimeZone()
      // spotDescriptionRef.current = ""
      changeSpotLocation([0,0])
      setSpotImg(()=>"")
      setSpotDuration(()=>0)
      setSpotInfo(()=>{
        return {
          title: "",
          location: [0, 0],
          spot_type_id: "",
          start_date: getLocalDateTime(),
          start_time_zone: getLocalTimeZone(),
          end_date: getLocalDateTime(),
          end_time_zone: getLocalTimeZone(),
          duration: 0, // Duration in hours
          description: "",
        }
      })
      setIsChanged(()=>false)
    }else if (status == "new"){
      //create data into database
      //save id, location, geoJson into database
      const aboutToCreateData = {
        id: id,
        title: spotInfo.title == "" ? null : spotInfo.title,
        location: spotLocation,
        spot_type_id: spotInfo.spot_type_id == "" ? null : spotInfo.spot_type_id,
        start_time: spotInfo.start_date,
        start_time_zone: spotInfo.start_time_zone,
        end_time: spotInfo.end_date,
        end_time_zone: spotInfo.end_time_zone,
        duration: spotDuration,
        description: spotInfo.description == "" ? null : spotInfo.description,
        geo_data: getFeatureGeoData(id, "mark")
      }
      console.log(aboutToCreateData)
      fetch("/api/spot",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          mapId: mapId,
          spotInfo: aboutToCreateData
        })
      })
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{
        console.log(data)
        console.log("Add data into spot collection")
        toggleHandMapInteraction(map, true)
        setFeatureSelectedById(map, "mark", id)
        setCurrentSelectedFeature("spot", id)
        setMessage(()=>{return {type:"success",content:"create successfully"}})
      })
      .catch((e)=>{
        console.log(e)
        // console.log("On no, something wrong when creating route")
        setMessage(()=>{return {type:"error",content:"create fail, removing..."}})
      })
      .finally(()=>{
        setMessage(()=>{return {type:"",content:""}})
        setIsChanged(()=>false)
      })
      
    }else if (status == "old"){
      console.log("load spot Info")
      setMessage(()=>{return {type:"normal",content:"getting data..."}})
      fetch(`/api/spot/${id}`)
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{
        console.log(data)
        const newInfo = data
        // spotTitleRef.current = newInfo.title || ""
        // spotTypeIdRef.current = newInfo.spotTypeId || ""
        // spotDescriptionRef.current = newInfo.description || ""
        // spotStartDateRef.current = newInfo.startTime || getLocalDateTime()
        // spotStartTimeZoneRef.current = newInfo.startTimeZone || getLocalTimeZone()
        // spotEndDateRef.current = newInfo.endTime || getLocalDateTime()
        // spotEndTimeZoneRef.current = newInfo.endTimeZone || getLocalTimeZone()
        changeSpotLocation(newInfo.location)
        setSpotDuration(()=>(newInfo.duration || 0))
        setSpotImg(()=>(newInfo.image || ""))
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

  },[id])

  return (
    <div className="w-[360px] h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md overflow-y-scroll">
      <p className='text-xs mb-1'>Spot Info</p>
      <hr className='border-1 mb-2'/>
      <input value={spotInfo.title} className="h-12 py-3 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Spot Title' onChange={(e)=>handleSpotState("title",e.target.value)}/>
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
      
      
      <select value={spotInfo.spot_type_id} className='h-10 w-[calc(100%-10px)] py-3 mt-1 text-xs outline-1 outline-gray-100' onChange={(e)=>{handleSpotState("spotType",e.target.value)}}>
        <option className='text-xs' value={""}>❓ Spot Type</option>
        {spotTypes.map(((spotType,i)=>{
            return <option className='text-xs' key={i} value={spotType.id}>{spotType.name}</option>
        }))}
      </select>
      {/* start time */}
      <div className='h-8 w-full flex'>
        <p className='h-full w-14 text-xs font-bold leading-8'>From: &#8614;</p>
        <input
            value={spotInfo.start_date}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="start-date"
            // defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
        />
        <select value={spotInfo.start_time_zone}  className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' name='start_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
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
            value={spotInfo.end_date}
            className='h-full w-1/3 py-3 text-xs outline-1 outline-gray-100 flex-grow'
            type="datetime-local"
            name="end-date"
            // defaultValue={getLocalDateTime()}
            min="2020-06-30T00:00"
            max="2050-06-30T00:00"
            onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
            
        />
        <select className='h-full w-[100px] px-1 text-xs outline-1 outline-gray-100' value={spotInfo.end_time_zone} name='end_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
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
      <textarea value={spotInfo.description} className="py-3 outline-none min-h-[120px] text-xs" placeholder="How's this location?" onChange={(e)=>handleSpotState("description",e.target.value)}></textarea>
      {message.content!=""?<div className='w-full h-10 flex justify-center text-xs' style={message.type=="success"?{color:'green'}:message.type=="error"?{color:'red'}:{color:'black'}}>{message.content}</div>:<></>}
      {status!="queue"&&isChanged&&message.content==""?
      <button className='w-full h-fit border-black border-2 rounded-md disabled:border-gray-200 disabled:text-gray-200' onClick={()=>{dataUpdateHandler()}}>Save Change</button>
      :<></>}
    </div>
  )
}

export default SpotInfo