import React,{useEffect, useState} from 'react'
import Image from 'next/image';
import { travelTypes, memberTypes } from '@/data/map';
import { timeZoneArray } from '@/data/dateAndTime';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';
//data for test
import { mapInfo_fake } from '../../../../fake_data/fake_data';

const MapInfo = () => {
    const [mapInfo, setMapInfo] = useState({
        title: "",
        images: [],
        country: "",
        region_or_district: "",
        location: "",
        travel_type: "",
        member_type: "",
        start_time: getLocalDateTime(),
        start_time_zone:getLocalTimeZone(),
        end_time: getLocalDateTime(),
        end_time_zone:getLocalTimeZone(),
        duration: 0, // Duration in hours
        description: ""
    })
    const [textAreaStyle, setTextAreaStyle] = useState({
        minHeight:"300px",
    })
    const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false)

    const updateMapInfo = (e:React.ChangeEvent<HTMLInputElement>) => {
        const action = e.target.name
        const info = e.target.value
        switch (action){
            case 'title':
                setMapInfo((preInfo)=>{
                    return {...preInfo, title:info}
                });
                break;
            case 'country':
                setMapInfo((preInfo)=>{
                    return {...preInfo, country:info}
                });
                break;
            case 'region_or_district':
                setMapInfo((preInfo)=>{
                    return {...preInfo, region_or_district:info}
                });
                break;
        } 
    }
    const updateMapDescription = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        const action = e.target.name
        const info = e.target.value
        setTextAreaStyle((currentStyle)=>
            {
                return {...currentStyle, minHeight:(e.target.scrollHeight.toString()+"px")}
            })
        switch (action){
            case 'description':
                setMapInfo((preInfo)=>{
                    return {...preInfo, description:info}
                });
                break;
        } 
    }

    const updateMapDateTime = (e:React.ChangeEvent<HTMLInputElement>) => {
        const action = e.target.name
        const info = e.target.value
        switch (action){
            case("start_time"):
                const newdurationFromStartTimeChange = getDurationInHour(info, mapInfo.end_time, mapInfo.start_time_zone, mapInfo.end_time_zone)
                setMapInfo((preInfo)=>{
                    return {...preInfo, start_time:info, duration: newdurationFromStartTimeChange}
                });
                break;
            case("end_time"):
                const newdurationFromEndTimeChange = getDurationInHour(mapInfo.start_time, info, mapInfo.start_time_zone, mapInfo.end_time_zone)
                setMapInfo((preInfo)=>{
                    return {...preInfo, end_time:info, duration:newdurationFromEndTimeChange}
                });
                break;
            case("start_time_zone"):
                const newdurationFromStartTimeZoneChange = getDurationInHour(mapInfo.start_time, mapInfo.end_time, info, mapInfo.end_time_zone)
                setMapInfo((preInfo)=>{
                    return {...preInfo, start_time_zone:info, duration:newdurationFromStartTimeZoneChange}
                });
                break;
            case("end_time_zone"):
                const newdurationFromEndTimeZoneChange = getDurationInHour(mapInfo.start_time, mapInfo.end_time, mapInfo.start_time_zone, info)
                setMapInfo((preInfo)=>{
                    return {...preInfo, end_time_zone:info, duration:newdurationFromEndTimeZoneChange}
                });
                break;
        }
    }

    const addMapImage = () => {

    }

    const deleteMapImage = () => {
        setMapInfo((currentMapInfo)=>{
            return {...currentMapInfo, images:[]}
        })
    }
    
    useEffect(()=>{
        const newMapInfo = mapInfo_fake
        setMapInfo((currentMapInfo)=>{
            return {...currentMapInfo, ...newMapInfo}
        })
    },[])

  return (
    <>
        <div className='bg-white rounded-md w-[500px] max-h-[80vh] h-fit absolute top-12 left-0 py-8 overflow-y-scroll flex flex-col gap-3'>
            <div className='h-10 w-[calc(100%-40px)] mx-5' >
                <span>🗺️</span>
                <input className='h-full w-[calc(100%-40px)] outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xl font-bold' value={mapInfo.title? mapInfo.title:""} name="title" placeholder='Title' onChange={(e)=>{updateMapInfo(e)}}/>
            </div>
            
            {/* CountryList? */}
            <div className='h-5 w-[calc(100%-40px)] mx-5 flex'>
            <span>📍</span>
            <input className='h-5 w-1/2 outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' name="country" value={mapInfo.country?mapInfo.country:""} placeholder='Country' onChange={(e)=>{updateMapInfo(e)}}/>
            <span>📍</span>
            <input className='h-5 w-1/2 outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' name="region_or_district" value={mapInfo.region_or_district?mapInfo.region_or_district:""}placeholder='Region or District' onChange={(e)=>{updateMapInfo(e)}}/>
            </div>
            {/* image */}
            {mapInfo.images.length<1?
                <div className='w-full h-[360px] min-h-[360px] overflow-hidden flex bg-gray-50'>
                    <button className="m-auto rounded-md text-white bg-gray-400 hover:bg-gray-300 px-3 py-1" onClick={()=>{addMapImage()}}>Select photo</button>
                </div>:
                <div className='w-full h-[360px] min-h-[360px] overflow-hidden relative'>
                    {isDeleteBoxOpen?
                    <div className='absolute top-3 right-10 w-20 h-20 py-3 bg-white'>
                        <p className="hover:font-bold text-center" onClick={()=>{deleteMapImage()}}>Delete</p>
                    </div>:
                    <></>}
                    <button className='w-6 h-6 absolute top-3 right-2 rounded-md' onClick={()=>{setIsDeleteBoxOpen(!isDeleteBoxOpen)}}>
                        <Image 
                            src={'/icons/three-dots-vw-50.png'}
                            width={20}
                            height={20}
                            alt="edit_button"
                        />
                    </button>
                    {mapInfo.images.map((imageUrl,i)=>
                        <Image 
                            key={i}
                            src={imageUrl}
                            width={500}
                            height={400}
                            alt="map_main_image"
                        />
                    )}
                </div>
            }
            <div className='h-10 w-[calc(100%-40px)] mx-5 flex gap-3'>
                <select className='h-10 w-1/2 p-3 text-xs outline-1 outline-gray-100' defaultValue={mapInfo.travel_type}>
                    <option className='text-xs' value={""}>Travel Type</option>
                    {travelTypes.map(((travelType,i)=>{
                        return <option className='text-xs' key={i} value={travelType}>{travelType}</option>
                    }))}
                </select>
                <select className='h-10 w-1/2 p-3 text-xs outline-1 outline-gray-100' defaultValue={mapInfo.member_type}>
                    <option className='text-xs' value={""}>Member Type</option>
                    {memberTypes.map(((memberType,i)=>{
                        return <option className='text-xs' key={i} value={memberType}>{memberType}</option>
                    }))}
                </select>
            </div>
            {/* start time */}
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-14 text-xs font-bold leading-8 ml-3'>From: &#8614;</p>
                <input
                    className='h-full w-1/3 p-3 text-xs outline-1 outline-gray-100 flex-grow'
                    type="datetime-local"
                    name="start_time"
                    defaultValue={mapInfo.start_time}
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                    onChange={(e)=>updateMapDateTime(e)}
                />
                <select className='h-full w-[150px] px-3 text-xs outline-1 outline-gray-100' value={mapInfo.start_time_zone} name='start_time_zone' onChange={(e)=>updateMapDateTime(e)}>
                    <option className='text-xs' defaultValue={"0"}>Time Zone</option>
                    {timeZoneArray.map(((timeZone,i)=>{
                        return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}  {timeZone.abbr}</option>
                    }))}
                </select>
            </div>
            {/* end time */}
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-14 text-xs font-bold leading-8 ml-3'>&#8612; To:</p>
                <input
                    className='h-full w-1/3 p-3 text-xs outline-1 outline-gray-100 flex-grow'
                    type="datetime-local"
                    name="end_time"
                    defaultValue={mapInfo.end_time}
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                    onChange={(e)=>updateMapDateTime(e)}
                />
                <select className='h-full w-[150px] px-3 text-xs outline-1 outline-gray-100' defaultValue={mapInfo.end_time_zone} name='end_time_zone' onChange={(e)=>updateMapDateTime(e)}>
                    <option className='text-xs' value={"0"}>Time Zone</option>
                    {timeZoneArray.map(((timeZone,i)=>{
                        return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}  {timeZone.abbr}</option>
                    }))}
                </select>
            </div>
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-16 text-xs font-bold leading-8 ml-3'>Duration:</p>
                <p className='h-full w-10 leading-8 text-xs'><span>{mapInfo.duration}              
                </span>hour</p>
            </div>
            
            <textarea className='w-[calc(100%-40px)] mx-5 p-3 outline-1 outline-none text-sm ' style={textAreaStyle}  name='description' placeholder='About this travel...' value={mapInfo.description} onChange={(e)=>updateMapDescription(e)} ></textarea>
            {/* <p className='h-auto w-[calc(100%-40px)] mx-5 p-3 text-sm' style={{backgroundColor:"red", height:'600px'}}>{mapInfo.description}</p> */}
            

        </div>
    </>
  )
}

export default MapInfo