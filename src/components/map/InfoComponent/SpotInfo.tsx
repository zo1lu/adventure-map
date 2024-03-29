import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
import { spotTypes } from '@/data/spot'
import { timeZoneArray } from '@/data/dateAndTime'
import { getLocalDateTime, getLocalTimeZone, getDurationInHour } from '@/utils/calculation'
import { setFeatureSelectedById,toggleHandMapInteraction } from '@/utils/map/Interaction';
import { getFeatureGeoData } from '@/utils/geoData';

interface SpotInfoProps {
  id: string,
  status: currentStatusType,
  spotImage: {id:string, url:string},
  setImage:(type:string,imageData:{id:string, url:string})=>void,
  spotLocation: spotLocationType,
  changeSpotLocation: (newSpotLocation:spotLocationType)=> void
  setCurrentSelectedFeature:(type:selectedFeatureType, id:string)=>void
  openImagePreview:(type:ImageTargetType, id:string, isNew:Boolean)=>void
}

const SpotInfo = ({id, status, spotImage, setImage, spotLocation, changeSpotLocation, setCurrentSelectedFeature, openImagePreview}:SpotInfoProps) => {
  const map = useContext(MapContext);
  const mapId = usePathname().split("/")[2]
  const [message, setMessage] = useState({type:"normal",content:""})
  const [isChanged, setIsChanged] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
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
  const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false)

  const dataUpdateHandler = () => {
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
        .then(()=>{
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
          return
      case "spotType":
          setSpotInfo((current)=>{
            return {...current, spot_type_id:newValue}
          })
          return
      case "description":
          setSpotInfo((current)=>{
              return {...current, description:newValue}
          })
          return
      case "startDate":
          setSpotInfo((current)=>{
              return {...current, start_date:newValue}
          })
          return
      case "startTimeZone":
          setSpotInfo((current)=>{
              return {...current, start_time_zone:newValue}
          })
          return
      case "endDate":
          setSpotInfo((current)=>{
              return {...current, end_date:newValue}
          })
          return
      case "endTimeZone":
          setSpotInfo((current)=>{
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
        const durationFromStartTimeChange = getDurationInHour(dateTimeValue, spotInfo.end_date, spotInfo.start_time_zone, spotInfo.end_time_zone)
        setSpotDuration(()=>durationFromStartTimeChange);
        handleSpotState("startDate" ,dateTimeValue)
        return 
      case "end-date":
        const durationFromEndTimeChange = getDurationInHour(spotInfo.start_date, dateTimeValue, spotInfo.start_time_zone, spotInfo.end_time_zone)
        setSpotDuration(()=>durationFromEndTimeChange);
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
        setSpotDuration(()=> durationFromStartTimeZoneChange);
        handleSpotState("startTimeZone" , timeZoneValue)
        return 
      case "end-time-zone":
        const durationFromEndTimeZoneChange = getDurationInHour(spotInfo.start_date, spotInfo.end_date, spotInfo.start_time_zone, timeZoneValue)
        setSpotDuration(()=> durationFromEndTimeZoneChange);
        handleSpotState("endTimeZone" , timeZoneValue)
        return 
    }
  }
  const deleteImage = () => {
    return new Promise((resolve, reject)=>{
        fetch(`/api/image/${spotImage.id}?type=spot`,{
            method:"DELETE"
        })
        .then((res)=>res.json())
        .then((result)=>{
            return result.success?resolve(result):reject(result)
        })
        .catch((e)=>reject({"error":true, "message":e}))
    })
  }
  const updateSpotImage = () => {
    setIsDeleteBoxOpen(false)
    openImagePreview("spot", spotImage.id, false)
  }

  const deleteSpotImage = async() => {
    setIsDeleteBoxOpen(false)
    try{
          await deleteImage()
          setImage("spot",{id:"",url:""})
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
  },[spotInfo, spotDuration, spotLocation])

  useEffect(()=>{
    if(status=="queue"){
      changeSpotLocation([0,0])
      setImage("spot",{id:"",url:""})
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
        toggleHandMapInteraction(map, true)
        setFeatureSelectedById(map, "mark", id)
        setCurrentSelectedFeature("spot", id)
        setMessage(()=>{return {type:"success",content:"create successfully"}})
      })
      .catch((e)=>{
        console.log(e)
        setMessage(()=>{return {type:"error",content:"create fail, removing..."}})
      })
      .finally(()=>{
        setMessage(()=>{return {type:"",content:""}})
        setIsChanged(()=>false)
      })
      
    }else if (status == "old"){
      setMessage(()=>{return {type:"normal",content:"Getting data..."}})
      fetch(`/api/spot/${id}`)
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{
        const newInfo = data
        changeSpotLocation(newInfo.location)
        setSpotDuration(()=>(newInfo.duration || 0))
        const newImageData = newInfo.spotImage?{
                                  id:newInfo.spotImage.id,
                                  url:newInfo.spotImage.url
                                }:{
                                  id:"",
                                  url:""
                              }
        setImage("spot", newImageData)
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
  },[id])

  return (
    <div className="w-[360px] h-[500px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md ">
      <div className='flex items-center justify-between'>
        <p className='w-20 text-xs'>Spot Info</p>
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
          <input value={spotInfo.title} className="w-[calc(100%-48px)] h-8 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Spot Title' onChange={(e)=>handleSpotState("title",e.target.value)}/>
          {id&&spotImage.id==""?
              <button className='w-fit h-8 text-xs' onClick={()=>{openImagePreview("spot", id, true)}}>
                <Image 
                    src={'/icons/camera-30.png'}
                    width={25}
                    height={25}
                    alt="camera_button"
                />
              </button>:null
            }
        </div>
        <div className='flex mb-2'>
          <p className='w-1/2 text-xs'><span>Long: {spotLocation[0].toFixed(3)}</span></p>
          <p className='w-1/2 text-xs'><span>Lat: {spotLocation[1].toFixed(3)}</span></p>
        </div>
        {id&&spotImage.id?<div className='w-full h-[240px] min-h-[240px] overflow-hidden relative'>
                      {isDeleteBoxOpen?
                      <div className='absolute top-3 right-10 w-20 h-20 py-3 bg-white z-10'>
                          <p className="hover:font-bold text-center" onClick={()=>{deleteSpotImage()}}>Delete</p>
                          <p className="hover:font-bold text-center" onClick={()=>{updateSpotImage()}}>Update</p>
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
                          src={spotImage.url}
                          width={300}
                          height={240}
                          quality={100}
                          alt="spot_image"
                          className='w-[500px] h-[360px] object-cover'
                      />
                  </div>
        :null}
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
              className='h-full w-1/3 py-3 px-3 text-xs outline-1 outline-gray-100 flex-grow'
              type="datetime-local"
              name="start-date"
              min="2020-06-30T00:00"
              max="2050-06-30T00:00"
              onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
          />
          <select value={spotInfo.start_time_zone}  className='h-full w-[80px] px-1 text-xs outline-1 outline-gray-100' name='start_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
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
              value={spotInfo.end_date}
              className='h-full w-1/3 py-3 px-3 text-xs outline-1 outline-gray-100 flex-grow'
              type="datetime-local"
              name="end-date"
              min="2020-06-30T00:00"
              max="2050-06-30T00:00"
              onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
              
          />
          <select className='h-full w-[80px] px-1 text-xs outline-1 outline-gray-100' value={spotInfo.end_time_zone} name='end_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
              <option className='text-xs' value={"0"}>Time Zone</option>
              {timeZoneArray.map(((timeZone,i)=>{
                  return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}</option>
              }))}
          </select>
        </div>
        <div className='h-8 w-full flex'>
          <p className='h-full w-16 text-xs font-bold leading-8'>Duration:</p>
          <p className='h-full w-10 leading-8 text-xs'><span>{spotDuration}              
          </span>hour</p>
        </div>
        <textarea value={spotInfo.description} className="w-full py-3 outline-none min-h-[120px] text-xs" placeholder="How's this location?" onChange={(e)=>handleSpotState("description",e.target.value)}></textarea>
      </div>
    </div>
  )
}

export default SpotInfo