import React,{useEffect, useRef, useState} from 'react'
import Image from 'next/image';
import { travelTypes, memberTypes } from '@/data/map';
import { timeZoneArray } from '@/data/dateAndTime';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';
//data for test
import { mapInfo_fake } from '../../../../fake_data/fake_data';

const MapInfo = () => {
    // const nowTime = getLocalDateTime()
    // const localTimeZone = getLocalTimeZone()
    // const [mapInfo, setMapInfo] = useState({
    //     title: "",
    //     images: [""],
    //     country: "",
    //     region_or_district: "",
    //     location: "",
    //     travel_type: "",
    //     member_type: "",
    //     start_time: "2025-12-10T09:00" ,
    //     start_time_zone: localTimeZone,
    //     end_time: nowTime,
    //     end_time_zone: localTimeZone,
    //     duration: 0, // Duration in hours
    //     description: ""
    // })
    const mapTitleRef = useRef<HTMLInputElement>(null)
    const mapCountryRef = useRef<HTMLInputElement>(null)
    const mapRegionRef = useRef<HTMLInputElement>(null)
    const mapTravelTypeRef = useRef<HTMLSelectElement>(null)
    const mapMemberTypeRef = useRef<HTMLSelectElement>(null)
    const mapDescriptionRef = useRef<HTMLTextAreaElement>(null)
    const mapStartDateRef = useRef<HTMLInputElement>(null)
    const mapEndDateRef = useRef<HTMLInputElement>(null)
    const mapStartTimeZoneRef = useRef<HTMLSelectElement>(null)
    const mapEndTimeZoneRef = useRef<HTMLSelectElement>(null)
    const [mapImg, setMapImg] = useState("")
    const [mapDuration, setMapDuration] = useState(0)

    const [textAreaStyle, setTextAreaStyle] = useState({
        minHeight:"300px",
    })
    const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false)

    // const updateMapInfo = (e:React.ChangeEvent<HTMLInputElement>) => {
    //     const action = e.target.name
    //     const info = e.target.value
    //     switch (action){
    //         case 'title':
    //             setMapInfo((preInfo)=>{
    //                 return {...preInfo, title:info}
    //             });
    //             break;
    //         case 'country':
    //             setMapInfo((preInfo)=>{
    //                 return {...preInfo, country:info}
    //             });
    //             break;
    //         case 'region_or_district':
    //             setMapInfo((preInfo)=>{
    //                 return {...preInfo, region_or_district:info}
    //             });
    //             break;
    //     } 
    // }
    // const updateMapDescription = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    //     const action = e.target.name
    //     const info = e.target.value
    //     setTextAreaStyle((currentStyle)=>
    //         {
    //             return {...currentStyle, minHeight:(e.target.scrollHeight.toString()+"px")}
    //         })
    //     switch (action){
    //         case 'description':
    //             setMapInfo((preInfo)=>{
    //                 return {...preInfo, description:info}
    //             });
    //             break;
    //     } 
    // }

    // const updateMapDateTime = (e:React.ChangeEvent<HTMLInputElement>) => {
    //     const action = e.target.name
    //     const info = e.target.value
    //     switch (action){
    //         case("start_time"):
    //             const newdurationFromStartTimeChange = getDurationInHour(info, mapInfo.end_time, mapInfo.start_time_zone, mapInfo.end_time_zone)
    //             setMapInfo((preInfo)=>{
    //                 return {...preInfo, start_time:info, duration: newdurationFromStartTimeChange}
    //             });
    //             break;
    //         case("end_time"):
    //             const newdurationFromEndTimeChange = getDurationInHour(mapInfo.start_time, info, mapInfo.start_time_zone, mapInfo.end_time_zone)
    //             setMapInfo((preInfo)=>{
    //                 return {...preInfo, end_time:info, duration:newdurationFromEndTimeChange}
    //             });
    //             break;
    //     }
    // }
    // const updateMapTimeZone = (e:React.ChangeEvent<HTMLSelectElement>) => {
    //     const action = e.target.name
    //     const info = e.target.value
    //     switch (action){
    //         case("start_time_zone"):
    //             const newdurationFromStartTimeZoneChange = getDurationInHour(mapInfo.start_time, mapInfo.end_time, info, mapInfo.end_time_zone)
    //             setMapInfo((preInfo)=>{
    //                 return {...preInfo, start_time_zone:info, duration:newdurationFromStartTimeZoneChange}
    //             });
    //             break;
    //         case("end_time_zone"):
    //             const newdurationFromEndTimeZoneChange = getDurationInHour(mapInfo.start_time, mapInfo.end_time, mapInfo.start_time_zone, info)
    //             setMapInfo((preInfo)=>{
    //                 return {...preInfo, end_time_zone:info, duration:newdurationFromEndTimeZoneChange}
    //             });
    //             break;
    //     }
    // }
    const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const dateTimeValue = e.target.value
        switch(name){
          case "start_time":
            const durationFromStartTimeChange = getDurationInHour(dateTimeValue, mapEndDateRef.current.value, mapStartTimeZoneRef.current.value, mapEndTimeZoneRef.current.value)
            return setMapDuration(()=>durationFromStartTimeChange);
          case "end_time":
            const durationFromEndTimeChange = getDurationInHour(mapStartDateRef.current.value, dateTimeValue, mapStartTimeZoneRef.current.value, mapEndTimeZoneRef.current.value)
            return setMapDuration(()=>durationFromEndTimeChange);
        };
      };
    
      const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name
        const timeZoneValue = e.target.value
        switch(name){
          case "start_time_zone":
            const durationFromStartTimeZoneChange = getDurationInHour(mapStartDateRef.current.value, mapEndDateRef.current.value, timeZoneValue, mapEndTimeZoneRef.current.value)
            return setMapDuration(()=> durationFromStartTimeZoneChange);
          case "end_time_zone":
            const durationFromEndTimeZoneChange = getDurationInHour(mapStartDateRef.current.value, mapEndDateRef.current.value, mapStartTimeZoneRef.current.value, timeZoneValue)
            return setMapDuration(()=> durationFromEndTimeZoneChange);
        }
      }
    const addMapImage = () => {
        //upload image to storage
        //get link
        const uploadImageUrl = "/images/mapImages/japan_kyoto_02.jpg"
        setMapImg(()=>uploadImageUrl)
    }

    const deleteMapImage = () => {
        //remove from storage
        setMapImg(()=>"")
        setIsDeleteBoxOpen(false)
    }
    
    useEffect(()=>{
        
        //get map Id
        //get map info from database
        const newInfo = mapInfo_fake
        // const newInfo = []
        //load into field
        mapTitleRef.current.value = newInfo.title || ""
        mapCountryRef.current.value = newInfo.country || ""
        mapRegionRef.current.value = newInfo.region_or_district || ""
        mapDescriptionRef.current.value = newInfo.description || ""
        mapTravelTypeRef.current.value = newInfo.travel_type || ""
        mapMemberTypeRef.current.value = newInfo.member_type || ""
        setMapImg(()=>newInfo.image)
        mapStartDateRef.current.value = newInfo.start_time || getLocalDateTime()
        mapEndDateRef.current.value = newInfo.end_time || getLocalDateTime() 
        mapStartTimeZoneRef.current.value = newInfo.start_time_zone || getLocalTimeZone()
        mapEndTimeZoneRef.current.value = newInfo.end_time_zone || getLocalTimeZone()
        setMapDuration(()=>newInfo.duration)
        return ()=>{
            console.log("update map info to database")
        }
    },[])

  return (
    <>
        <div className='bg-white rounded-md w-[500px] max-h-[80vh] h-fit absolute top-12 left-0 py-8 overflow-y-scroll flex flex-col gap-3'>
            <div className='h-10 w-[calc(100%-40px)] mx-5' >
                <span>🗺️</span>
                <input ref={mapTitleRef} className='h-full w-[calc(100%-40px)] outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xl font-bold' name="title" placeholder='Title'/>
            </div>
            
            {/* CountryList? */}
            <div className='h-5 w-[calc(100%-40px)] mx-5 flex'>
            <span>📍</span>
            <input ref={mapCountryRef} className='h-5 w-1/2 outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' name="country" placeholder='Country' />
            <span>📍</span>
            <input ref={mapRegionRef} className='h-5 w-1/2 outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' name="region_or_district" placeholder='Region or District' />
            </div>
            {/* image */}
            {mapImg?
                <div className='w-full h-[360px] min-h-[360px] overflow-hidden relative'>
                    {isDeleteBoxOpen?
                    <div className='absolute top-3 right-10 w-20 h-20 py-3 bg-white z-10'>
                        <p className="hover:font-bold text-center" onClick={()=>{deleteMapImage()}}>Delete</p>
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
                        src={mapImg}
                        width={500}
                        height={360}
                        quality={100}
                        alt="map_main_image"
                        className='w-[500px] h-[360px] object-cover'
                    />
                </div>
                :<div className='w-full h-[360px] min-h-[360px] overflow-hidden flex bg-gray-50'>
                    <button className="m-auto rounded-md text-white bg-gray-400 hover:bg-gray-300 px-3 py-1" onClick={()=>{addMapImage()}}>Select photo</button>
                </div>
            }
            <div className='h-10 w-[calc(100%-40px)] mx-5 flex gap-3'>
                <select ref={mapTravelTypeRef} className='h-10 w-1/2 p-3 text-xs outline-1 outline-gray-100' defaultValue={""} >
                    <option className='text-xs' value={""}>Travel Type</option>
                    {travelTypes.map(((travelType,i)=>{
                        return <option className='text-xs' key={i} value={travelType.value}>{travelType.name}</option>
                    }))}
                </select>
                <select ref={mapMemberTypeRef} className='h-10 w-1/2 p-3 text-xs outline-1 outline-gray-100' defaultValue={""} >
                    <option className='text-xs' value={""}>Member Type</option>
                    {memberTypes.map(((memberType,i)=>{
                        return <option className='text-xs' key={i} value={memberType.value}>{memberType.name}</option>
                    }))}
                </select>
            </div>
            {/* start time */}
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-14 text-xs font-bold leading-8 ml-3'>From: &#8614;</p>
                <input
                    ref={mapStartDateRef}
                    className='h-full w-1/3 p-3 text-xs outline-1 outline-gray-100 flex-grow'
                    type="datetime-local"
                    name="start_time"
                    defaultValue={getLocalDateTime()}
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                    onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
                />
                <select ref={mapStartTimeZoneRef}  className='h-full w-[150px] px-3 text-xs outline-1 outline-gray-100' name='start_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
                    <option className='text-xs' defaultValue={"0"}>Time Zone</option>
                    {timeZoneArray.map(((timeZone,i)=>{
                        return <option className='text-xs' key={i} value={timeZone.offset}>UTC{timeZone.offset}  {timeZone.abbr}</option>
                    }))}
                </select>
            </div>
            {/* end time */}
            <div ref={mapEndDateRef}  className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-14 text-xs font-bold leading-8 ml-3'>&#8612; To:</p>
                <input
                    className='h-full w-1/3 p-3 text-xs outline-1 outline-gray-100 flex-grow'
                    type="datetime-local"
                    name="end_time"
                    defaultValue={getLocalDateTime()}
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                    onChange={(e)=>{updateDurationFromDateTimeChange(e)}}
                />
                <select ref={mapEndTimeZoneRef} className='h-full w-[150px] px-3 text-xs outline-1 outline-gray-100' name='end_time_zone' onChange={(e)=>{updateDurationFromTimeZoneChange(e)}}>
                    <option className='text-xs' value={"0"}>Time Zone</option>
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
            
            <textarea ref={mapDescriptionRef} className='w-[calc(100%-40px)] mx-5 p-3 outline-1 outline-none text-sm ' style={textAreaStyle}  name='description' placeholder='About this travel...' ></textarea>
            {/* <p className='h-auto w-[calc(100%-40px)] mx-5 p-3 text-sm' style={{backgroundColor:"red", height:'600px'}}>{mapInfo.description}</p> */}
            

        </div>
    </>
  )
}

export default MapInfo