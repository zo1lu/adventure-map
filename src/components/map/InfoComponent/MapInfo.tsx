const _ = require('lodash');
import { usePathname } from 'next/navigation'
import React,{useEffect, useState} from 'react'
import Image from 'next/image';
import { travelTypes, memberTypes } from '@/data/map';
import { timeZoneArray } from '@/data/dateAndTime';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';

interface MapInfoProps {
    openImagePreview:(type:ImageTargetType, id:string, isNew:Boolean)=>void
    mapImage:{id:string, url:string},
    setImage:(type:string, imageData:{id:string, url:string})=>void
}
const MapInfo = ({openImagePreview, mapImage, setImage}:MapInfoProps) => {
    const mapId = usePathname().split("/")[2]
    const [isChanged, setIsChanged] = useState(false)
    const [message, setMessage] = useState({type:"",content:""})
    const [originalInfo,setOriginalInfo] = useState({
        title:"",
        country:"",
        region:"",
        travel_type:"",
        member_type:"",
        description:"",
        start_date:"",
        start_time_zone:"",
        end_date:"",
        end_time_zone:"",
    })
    const [mapInfo, setMapInfo] = useState({
        title:"",
        country:"",
        region:"",
        travel_type:"",
        member_type:"",
        description:"",
        start_date:"",
        start_time_zone:"",
        end_date:"",
        end_time_zone:"",
    })
    const [mapDuration, setMapDuration] = useState(0)

    const [textAreaStyle, setTextAreaStyle] = useState({
        minHeight:"300px",
    })
    const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false)
    
    const handleMapState = (type:string, newValue:any) => {
        switch (type){
            case "title":
                setMapInfo((current)=>{
                    return {...current, title:newValue}
                })
                return
            case "country":
                setMapInfo((current)=>{
                    return {...current, country:newValue}
                })
                return
            case "region":
                setMapInfo((current)=>{
                    return {...current, region:newValue}
                })
                return
            case "travelType":
                setMapInfo((current)=>{
                    return {...current, travel_type:newValue}
                })
                return
            case "memberType":
                setMapInfo((current)=>{
                    return {...current, member_type:newValue}
                })
                return
            case "description":
                setMapInfo((current)=>{
                    return {...current, description:newValue}
                })
                return
            case "startDate":
                setMapInfo((current)=>{
                    return {...current, start_date:newValue}
                })
                return
            case "startTimeZone":
                setMapInfo((current)=>{
                    return {...current, start_time_zone:newValue}
                })
                return
            case "endDate":
                setMapInfo((current)=>{
                    return {...current, end_date:newValue}
                })
                return
            case "endTimeZone":
                setMapInfo((current)=>{
                    return {...current, end_time_zone:newValue}
                })
                return
        }   
    }

    useEffect(()=>{
        const checkIsSame = _.isEqual(mapInfo, originalInfo)
        if(!checkIsSame){
            setIsChanged(()=>true)
        }else{
            setIsChanged(()=>false)
        }
    },[mapInfo])

    const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const dateTimeValue = e.target.value
        switch(name){
          case "start_time":
            const durationFromStartTimeChange = getDurationInHour(dateTimeValue, mapInfo.end_date, mapInfo.start_time_zone, mapInfo.end_time_zone)
            setMapDuration(()=>durationFromStartTimeChange);
            handleMapState("startDate", dateTimeValue)
            return 
          case "end_time":
            const durationFromEndTimeChange = getDurationInHour(mapInfo.start_date, dateTimeValue, mapInfo.start_time_zone, mapInfo.end_time_zone)
            setMapDuration(()=>durationFromEndTimeChange);
            handleMapState("endDate", dateTimeValue)
            return 
        };
      };
    const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name
        const timeZoneValue = e.target.value
        switch(name){
            case "start_time_zone":
                const durationFromStartTimeZoneChange = getDurationInHour(mapInfo.start_date, mapInfo.end_date, timeZoneValue, mapInfo.end_time_zone)
                setMapDuration(()=> durationFromStartTimeZoneChange);
                handleMapState("startTimeZone", timeZoneValue)
                return 
            case "end_time_zone":
                const durationFromEndTimeZoneChange = getDurationInHour(mapInfo.start_date, mapInfo.end_date, mapInfo.start_time_zone, timeZoneValue)
                setMapDuration(()=> durationFromEndTimeZoneChange);
                handleMapState("endTimeZone", timeZoneValue)
                return 
        }
    }
    const updateMapImage = () => {
        setIsDeleteBoxOpen(false)
        openImagePreview("map", mapImage.id, false)
    }
    const deleteImage = () => {
        return new Promise((resolve, reject)=>{
            fetch(`/api/image/${mapImage.id}?type=map`,{
                method:"DELETE"
            })
            .then((res)=>res.json())
            .then((result)=>{
                return result.success?resolve(result):reject(result)
            })
            .catch((e)=>reject({"error":true, "message":e}))
        })
    }
    const deleteMapImage = async() => {
        try{
            await deleteImage()
            setImage("map", {id:"",url:""})
            setIsDeleteBoxOpen(false)
        }catch(e){
            console.log(e)
        }
        
    }
    const saveMapInfo = () => {
        setMessage(()=>{return {type:"normal",content:"Updating..."}})
        const mapLatestInfo = {
            title:mapInfo.title,
            country:mapInfo.country,
            region_or_district:mapInfo.region,
            start_time: mapInfo.start_date,
            start_time_zone: mapInfo.start_time_zone,
            end_time: mapInfo.end_date,
            end_time_zone: mapInfo.end_time_zone,
            duration: mapDuration,
            description: mapInfo.description,
            travel_type_id: mapInfo.travel_type,
            member_type_id: mapInfo.member_type
        }
        const body = {
            mapId: mapId,
            mapData: mapLatestInfo
        }
        fetch("/api/map?type=plain",{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(body)
        })
        .then(res=>res.json())
        .then(res=>{
            setMessage(()=>{return {type:"success",content:"Successfully updated"}})
        })
        .catch((e)=>{
            console.log(e)
            setMessage(()=>{return {type:"error",content:"Updated failed"}})
        })
        .finally(()=>{
        setTimeout(()=>{
            setMessage(()=>{return {type:"",content:""}})
            setIsChanged(()=>false)
        },3000)
        })
    }


    useEffect(()=>{
        //get map info from database
        setMessage(()=>{return {type:"normal",content:"Getting data..."}})
        fetch(`/api/map/${mapId}?type=plain`)
        .then((res)=>{
            return res.json()
        })
        .then((data)=>{
            const newInfo = data
            const newImageData = newInfo.mapImage?
                                    {
                                        id:newInfo.mapImage.id,
                                        url:newInfo.mapImage.url
                                    }:{
                                        id:"",
                                        url:""
                                    }
            setImage("map", newImageData)
            setMapDuration(()=>(newInfo.duration != null ? newInfo.duration : 0))
            setMapInfo(()=>{
                return {
                    title: newInfo.title || "",
                    country: newInfo.country || "",
                    region: newInfo.regionOrDistrict || "",
                    travel_type: newInfo.travelTypeId || "",
                    member_type: newInfo.memberTypeId || "",
                    start_date: newInfo.startTime? newInfo.startTime :getLocalDateTime(),
                    start_time_zone: newInfo.startTimeZone? newInfo.startTimeZone :getLocalTimeZone(),
                    end_date: newInfo.endTime? newInfo.endTime :getLocalDateTime(),
                    end_time_zone: newInfo.endTimeZone? newInfo.endTimeZone :getLocalTimeZone(),
                    description: newInfo.description || "",
                }
            })
            setOriginalInfo(()=>{
                return {
                    title: newInfo.title,
                    country: newInfo.country,
                    region: newInfo.regionOrDistrict,
                    travel_type: newInfo.travelTypeId,
                    member_type: newInfo.memberTypeId,
                    start_date: newInfo.startTime,
                    start_time_zone: newInfo.startTimeZone,
                    end_date: newInfo.endTime,
                    end_time_zone: newInfo.endTimeZone,
                    description: newInfo.description,
                }
            })        
        })
        .catch(()=>{
            setMessage(()=>{return {type:"error",content:"Something wrong"}})
        })
        .finally(()=>{
            setMessage(()=>{return {type:"normal",content:""}})
            setIsChanged(()=>false)
        })
        return ()=>{
           
        }
    },[mapId])

    const messageColor = message.type=="success"?"green"
                        :message.type=="error"?"red"
                        :"black"
  return (
    <>
        <div className='bg-white rounded-md w-[500px] max-h-[80vh] h-fit absolute top-12 left-0 py-5 flex flex-col'>
            <div className='h-10 flex mx-5 mb-1 items-center justify-between'>
                <p className='text-xs'>About</p>
                <div className='w-[calc(100%-80px)] flex justify-end items-center'>
                    {message.content!=""?<div className='w-full text-xs text-end' style={{color:messageColor}}>{message.content}</div>:null}

                    {isChanged&&message.content==""?
                    <div className='flex gap-3'>
                        <button className='w-fit h-5 px-2 text-xs' onClick={()=>{saveMapInfo()}}>
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
            <hr className='mx-5'/>
            <div className='w-full overflow-y-scroll flex flex-col gap-3 py-3'>
            <div className='h-10 w-[calc(100%-40px)] mx-5' >
                <span>🗺️</span>
                <input value={mapInfo.title} className='h-full w-[calc(100%-40px)] outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xl font-bold' name="title" placeholder='Title' onChange={(e)=>handleMapState("title",e.target.value)}/>
            </div>
            
            {/* CountryList? */}
            <div className='h-5 w-[calc(100%-40px)] mx-5 flex'>
            <span>📍</span>
            <input value={mapInfo.country} className='h-5 w-1/2 outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' name="country" placeholder='Country' onChange={(e)=>handleMapState("country",e.target.value)}/>
            <span>📍</span>
            <input value={mapInfo.region} className='h-5 w-1/2 outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' name="region_or_district" placeholder='Region or District' onChange={(e)=>handleMapState("region",e.target.value)}/>
            </div>
            {/* image */}
            {mapImage.id?
                <div className='w-full h-[360px] min-h-[360px] overflow-hidden relative shadow-lg shadow-gray-300'>
                    {isDeleteBoxOpen?
                    <div className='absolute top-3 right-10 w-20 h-20 py-3 bg-white z-10'>
                        <p className="hover:font-bold text-center cursor-pointer" onClick={()=>{deleteMapImage()}}>Delete</p>
                        <p className="hover:font-bold text-center cursor-pointer" onClick={()=>{updateMapImage()}}>Update</p>
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
                        src={mapImage.url}
                        width={500}
                        height={360}
                        quality={100}
                        alt="map_main_image"
                        className='w-[500px] h-auto object-cover '
                    />
                </div>
                :<div className='w-full h-[360px] min-h-[360px] overflow-hidden flex bg-gray-50'>
                    
                    <button className="m-auto rounded-md text-white bg-gray-400 hover:bg-gray-300 px-3 py-1" onClick={()=>{openImagePreview("map", mapId, true)}}>
                        Select photo
                    </button>
                </div>
            }
            <div className='h-10 w-[calc(100%-40px)] mx-5 flex gap-3'>
                <select value={mapInfo.travel_type} className='h-10 w-1/2 p-3 text-xs outline-1 outline-gray-100' onChange={(e)=>handleMapState("travelType",e.target.value)} >
                    <option className='text-xs' value={""} >Travel Type</option>
                    {travelTypes.map(((travelType,i)=>{
                        return <option className='text-xs' key={i} value={travelType.id}>{travelType.name}</option>
                    }))}
                </select>
                <select value={mapInfo.member_type} className='h-10 w-1/2 p-3 text-xs outline-1 outline-gray-100' onChange={(e)=>handleMapState("memberType",e.target.value)}>
                    <option className='text-xs' value={""}>Member Type</option>
                    {memberTypes.map(((memberType,i)=>{
                        return <option className='text-xs' key={i} value={memberType.id}>{memberType.name}</option>
                    }))}
                </select>
            </div>
            {/* start time */}
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-14 text-xs font-bold leading-8 ml-3'>From: &#8614;</p>
                <input
                    value={mapInfo.start_date}
                    className='h-full w-1/3 p-3 text-xs outline-1 outline-gray-100 flex-grow'
                    type="datetime-local"
                    name="start_time"
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                    onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
                />
                <select value={mapInfo.start_time_zone}  className='h-full w-[150px] px-3 text-xs outline-1 outline-gray-100' name='start_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
                    <option className='text-xs' value={""}>Time Zone</option>
                    {timeZoneArray.map(((timeZone,i)=>{
                        return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}  {timeZone.abbr}</option>
                    }))}
                </select>
            </div>
            {/* end time */}
            <div   className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-14 text-xs font-bold leading-8 ml-3'>&#8612; To:</p>
                <input
                    value={mapInfo.end_date}
                    className='h-full w-1/3 p-3 text-xs outline-1 outline-gray-100 flex-grow'
                    type="datetime-local"
                    name="end_time"
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                    onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
                />
                <select value={mapInfo.end_time_zone} className='h-full w-[150px] px-3 text-xs outline-1 outline-gray-100' name='end_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
                    <option className='text-xs' value={""}>Time Zone</option>
                    {timeZoneArray.map(((timeZone,i)=>{
                        return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}  {timeZone.abbr}</option>
                    }))}
                </select>
            </div>
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-16 text-xs font-bold leading-8 ml-3'>Duration:</p>
                <p className='h-full w-10 leading-8 text-xs'><span>{mapDuration}              
                </span>hour</p>
            </div>
            
            <textarea value={mapInfo.description} className='w-[calc(100%-40px)] mx-5 p-3 outline-1 outline-none text-sm ' style={textAreaStyle}  name='description' placeholder='About this travel...' onChange={(e)=>handleMapState("description",e.target.value)}></textarea>
            </div>
        </div>
    </>
  )
}

export default MapInfo