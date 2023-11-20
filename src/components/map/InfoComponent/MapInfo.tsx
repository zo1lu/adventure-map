import { usePathname } from 'next/navigation'
import React,{useEffect, useRef, useState} from 'react'
import Image from 'next/image';
import { travelTypes, memberTypes } from '@/data/map';
import { timeZoneArray } from '@/data/dateAndTime';
import { getDurationInHour, getLocalDateTime, getLocalTimeZone } from '@/utils/calculation';
//data for test
import { mapInfo_fake } from '../../../../fake_data/fake_data';
import { mapInfoType } from '@/data/infoType';

const MapInfo = () => {
    const mapId = usePathname().split("/")[2]
    const mapTitleRef = useRef("")
    const mapCountryRef = useRef("")
    const mapRegionRef = useRef("")
    const mapTravelTypeRef = useRef("")
    const mapMemberTypeRef = useRef("")
    const mapDescriptionRef = useRef("")
    const mapStartDateRef = useRef("")
    const mapEndDateRef = useRef("")
    const mapStartTimeZoneRef = useRef("")
    const mapEndTimeZoneRef = useRef("")
    const mapDurationRef = useRef(0)
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
    const [mapImg, setMapImg] = useState("")
    const [mapDuration, setMapDuration] = useState(0)

    const [textAreaStyle, setTextAreaStyle] = useState({
        minHeight:"300px",
    })
    const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false)
    const handleMapState = (type:string, newValue:any) => {
        console.log(newValue)
        switch (type){
            case "title":
                setMapInfo((current)=>{
                    return {...current, title:newValue}
                })
                mapTitleRef.current=newValue
                return
            case "country":
                setMapInfo((current)=>{
                    return {...current, country:newValue}
                })
                mapCountryRef.current=newValue
                return
            case "region":
                setMapInfo((current)=>{
                    return {...current, region:newValue}
                })
                mapRegionRef.current=newValue
                return
            case "travelType":
                setMapInfo((current)=>{
                    return {...current, travel_type:newValue}
                })
                mapTravelTypeRef.current=newValue
                return
            case "memberType":
                setMapInfo((current)=>{
                    return {...current, member_type:newValue}
                })
                mapMemberTypeRef.current=newValue
                return
            case "description":
                setMapInfo((current)=>{
                    return {...current, description:newValue}
                })
                mapDescriptionRef.current=newValue
                return
            case "startDate":
                setMapInfo((current)=>{
                    return {...current, start_date:newValue}
                })
                mapStartDateRef.current=newValue
                return
            case "startTimeZone":
                setMapInfo((current)=>{
                    return {...current, start_time_zone:newValue}
                })
                mapStartTimeZoneRef.current=newValue
                return
            case "endDate":
                setMapInfo((current)=>{
                    return {...current, end_date:newValue}
                })
                mapEndDateRef.current=newValue
                return
            case "endTimeZone":
                setMapInfo((current)=>{
                    return {...current, end_time_zone:newValue}
                })
                mapEndTimeZoneRef.current=newValue
                return
        }
            
    }

    const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const dateTimeValue = e.target.value
        switch(name){
          case "start_time":
            const durationFromStartTimeChange = getDurationInHour(dateTimeValue, mapEndDateRef.current, mapStartTimeZoneRef.current, mapEndTimeZoneRef.current)
            setMapDuration(()=>durationFromStartTimeChange);
            mapDurationRef.current = durationFromStartTimeChange
            handleMapState("startDate", dateTimeValue)
            //mapStartDateRef.current = dateTimeValue
            return 
          case "end_time":
            const durationFromEndTimeChange = getDurationInHour(mapStartDateRef.current, dateTimeValue, mapStartTimeZoneRef.current, mapEndTimeZoneRef.current)
            setMapDuration(()=>durationFromEndTimeChange);
            mapDurationRef.current = durationFromEndTimeChange
            handleMapState("endDate", dateTimeValue)
            //mapEndDateRef.current = dateTimeValue
            return 
        };
      };
    
    const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name
        const timeZoneValue = e.target.value
        switch(name){
            case "start_time_zone":
                const durationFromStartTimeZoneChange = getDurationInHour(mapStartDateRef.current, mapEndDateRef.current, timeZoneValue, mapEndTimeZoneRef.current)
                setMapDuration(()=> durationFromStartTimeZoneChange);
                mapDurationRef.current = durationFromStartTimeZoneChange
                handleMapState("startTimeZone", timeZoneValue)
                //mapStartTimeZoneRef.current = timeZoneValue
                return 
            case "end_time_zone":
                const durationFromEndTimeZoneChange = getDurationInHour(mapStartDateRef.current, mapEndDateRef.current, mapStartTimeZoneRef.current, timeZoneValue)
                setMapDuration(()=> durationFromEndTimeZoneChange);
                mapDurationRef.current = durationFromEndTimeZoneChange
                handleMapState("endTimeZone", timeZoneValue)
                //mapEndTimeZoneRef.current = timeZoneValue
                return 
        }
    }
    // const updateDurationFromDateTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    //     const name = e.target.name
    //     const dateTimeValue = e.target.value
    //     switch(name){
    //       case "start_time":
    //         const durationFromStartTimeChange = getDurationInHour(dateTimeValue, mapEndDateRef.current.value, mapStartTimeZoneRef.current.value, mapEndTimeZoneRef.current.value)
    //         return setMapDuration(()=>durationFromStartTimeChange);
    //       case "end_time":
    //         const durationFromEndTimeChange = getDurationInHour(mapStartDateRef.current.value, dateTimeValue, mapStartTimeZoneRef.current.value, mapEndTimeZoneRef.current.value)
    //         return setMapDuration(()=>durationFromEndTimeChange);
    //     };
    //   };
    
    // const updateDurationFromTimeZoneChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    //     const name = e.target.name
    //     const timeZoneValue = e.target.value
    //     switch(name){
    //         case "start_time_zone":
    //             const durationFromStartTimeZoneChange = getDurationInHour(mapStartDateRef.current.value, mapEndDateRef.current.value, timeZoneValue, mapEndTimeZoneRef.current.value)
    //             return setMapDuration(()=> durationFromStartTimeZoneChange);
    //         case "end_time_zone":
    //             const durationFromEndTimeZoneChange = getDurationInHour(mapStartDateRef.current.value, mapEndDateRef.current.value, mapStartTimeZoneRef.current.value, timeZoneValue)
    //             return setMapDuration(()=> durationFromEndTimeZoneChange);
    //     }
    // }
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
    // const changeMapTitle = (e:React.ChangeEvent<HTMLInputElement>) =>{
    //     const newValue = e.target.value
    //     setMapTitle(()=>{
    //         return newValue
    //     })
    //     mapTitleRef.current = newValue
    // }
    // const changeMapCountry = (e:React.ChangeEvent<HTMLInputElement>) =>{
    //     const newValue = e.target.value
    //     setMapCountry(()=>{
    //         return newValue
    //     })
    //     mapCountryRef.current = newValue
    // }
    // const changeMapRegion = (e:React.ChangeEvent<HTMLInputElement>) =>{
    //     const newValue = e.target.value
    //     setMapRegion(()=>{
    //         return newValue
    //     })
    //     mapRegionRef.current = newValue
    // }
    useEffect(()=>{
        mapDurationRef.current = mapDuration
      },[mapDuration])

    useEffect(()=>{
        //get map info from database
        fetch(`/api/map/${mapId}?type=plain`)
        .then((res)=>{
            return res.json()
        })
        .then((data)=>{
            console.log(data)
            const newInfo = data
            mapTitleRef.current = newInfo.title || ""
            mapCountryRef.current = newInfo.country || ""
            mapRegionRef.current = newInfo.regionOrDistrict || ""
            mapDescriptionRef.current = newInfo.description || ""
            mapTravelTypeRef.current = newInfo.travelTypeId || ""
            mapMemberTypeRef.current = newInfo.memberTypeId || ""
            setMapImg(()=>(newInfo.mapImage?.url || ""))
            mapStartDateRef.current = newInfo.startTime || getLocalDateTime()
            mapEndDateRef.current = newInfo.endTime|| getLocalDateTime()
            mapStartTimeZoneRef.current = newInfo.startTimeZone || getLocalTimeZone()
            mapEndTimeZoneRef.current = newInfo.endTimeZone || getLocalTimeZone()
            mapDurationRef.current = newInfo.duration
            setMapDuration(()=>(newInfo.duration || 0))
            setMapInfo((current)=>{
                return {
                    ...current,
                    title: newInfo.title || "",
                    country: newInfo.country || "",
                    region: newInfo.regionOrDistrict || "",
                    travel_type: newInfo.travelTypeId || "",
                    member_type: newInfo.memberTypeId || "",
                    start_date: newInfo.startTime || getLocalDateTime(),
                    start_time_zone: newInfo.startTimeZone || getLocalTimeZone(),
                    end_date: newInfo.endTime || getLocalDateTime(),
                    end_time_zone: newInfo.endTimeZone || getLocalTimeZone(),
                    description: newInfo.description || "",
                }
            })

        })
        return ()=>{
            console.log("update map info to database")
            const mapLatestInfo = {
                title: mapTitleRef.current == "" ? null : mapTitleRef.current,
                country:  mapCountryRef.current == "" ? null : mapCountryRef.current,
                region_or_district: mapRegionRef.current == "" ? null : mapRegionRef.current,
                start_time: mapStartDateRef.current,
                start_time_zone: mapStartTimeZoneRef.current,
                end_time: mapEndDateRef.current,
                end_time_zone: mapEndTimeZoneRef.current,
                duration: mapDurationRef.current,
                description: mapDescriptionRef.current == "" ? null : mapDescriptionRef.current,
                travel_type_id: mapTravelTypeRef.current == "" ? null : mapTravelTypeRef.current,
                member_type_id: mapMemberTypeRef.current == "" ? null : mapMemberTypeRef.current
            }
            console.log(mapLatestInfo)
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
            .then(res=>console.log(res))
            .catch((e)=>console.log(e))
        }
    },[])

    // useEffect(()=>{
    //     console.log(mapTitle)
    // },[mapTitle, mapCountry, mapRegion])

  return (
    <>
        <div className='bg-white rounded-md w-[500px] max-h-[80vh] h-fit absolute top-12 left-0 py-8 overflow-y-scroll flex flex-col gap-3'>
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
                    // defaultValue={getLocalDateTime()}
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
                    // defaultValue={getLocalDateTime()}
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
            
            <textarea value={mapDescriptionRef.current} className='w-[calc(100%-40px)] mx-5 p-3 outline-1 outline-none text-sm ' style={textAreaStyle}  name='description' placeholder='About this travel...' onChange={(e)=>handleMapState("description",e.target.value)}></textarea>
            {/* <p className='h-auto w-[calc(100%-40px)] mx-5 p-3 text-sm' style={{backgroundColor:"red", height:'600px'}}>{mapInfo.description}</p> */}
            

        </div>
    </>
  )
}

export default MapInfo