import React,{useEffect, useState} from 'react'
import Image from 'next/image';
import { travelTypes, memberTypes } from '@/data/map';
//data for test
import { mapInfo_fake } from '@/data/fake_data';

const MapInfo = () => {
    const [mapInfo, setMapInfo] = useState({
        title: "",
        images: [],
        country: "",
        region_or_district: "",
        location: "",
        travel_type: "",
        member_type: "",
        startTime: new Date(Date.now()),
        endTime: new Date(Date.now()),
        duration: null, // Duration in hours
        description: ""
    })
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
        const info = e.target.innerText
        switch (action){
            case 'description':
                setMapInfo((preInfo)=>{
                    return {...preInfo, description:info}
                });
                break;
        } 
    }

    const addImage = () => {

    }
    const timeZoneArray = () => {
        let arr = []
        for (let i=-12; i<=12;i++){
            arr.push(i<1?i.toString():"+"+i.toString())
        }
        return arr
    }
    useEffect(()=>{
        const newMapInfo = mapInfo_fake
        setMapInfo((currentMapInfo)=>{
            return {...currentMapInfo, ...newMapInfo}
        })
    },[])

  return (
    <>
        <div className='bg-white rounded-md w-[500px] h-[80vh] absolute top-12 left-0 py-5 overflow-y-scroll flex flex-col gap-3'>
            <input className='h-10 w-[calc(100%-40px)] outline-none mx-5 p-3 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xl font-bold' value={mapInfo.title} name="title" placeholder='Title' onChange={(e)=>{updateMapInfo(e)}}/>
            {/* CountryList? */}
            <input className='h-5 w-40 outline-none mx-5 p-3 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' value={mapInfo.country} name="country" placeholder='📍 Country' onChange={(e)=>{updateMapInfo(e)}}/>
            <input className='h-5 w-40 outline-none mx-5 p-3 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' value={mapInfo.region_or_district} name="region_or_district" placeholder='📍 Region or District' onChange={(e)=>{updateMapInfo(e)}}/>
            {/* image */}
            {mapInfo.images.length<1?
                <div className='w-full h-[360px] min-h-[360px] overflow-hidden flex bg-gray-50'>
                    <button className="m-auto rounded-md text-white bg-gray-400 hover:bg-gray-300 px-3 py-1" onClick={()=>addImage()}>Select photo</button>
                </div>:
                <div className='w-full h-[360px] min-h-[360px] overflow-hidden'>
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
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex gap-3'>
                <input
                    className='h-full w-3/5 p-3 text-xs outline-1 outline-gray-100'
                    type="datetime-local"
                    name="start_time"
                    value="2023-06-12T19:30"
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                />
                <select className='h-full w-2/5 px-3 text-xs outline-1 outline-gray-100'>
                    <option className='text-xs' value={""}>Time Zone</option>
                    {timeZoneArray().map(((timeZone,i)=>{
                        return <option className='text-xs' key={i} value={timeZone}>UTC {timeZone}</option>
                    }))}
                </select>
            </div>
            <div className='h-5 w-[calc(100%-40px)] mx-5 flex gap-3'>
                <input
                    className='h-full w-3/5 p-3 text-xs outline-1 outline-gray-100'
                    type="datetime-local"
                    name="start_time"
                    value="2023-06-12T19:30"
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                />
                <select className='h-full w-2/5 px-3 text-xs outline-1 outline-gray-100'>
                    <option className='text-xs' value={""}>Time Zone</option>
                    {timeZoneArray().map(((timeZone,i)=>{
                        return <option className='text-xs' key={i} value={timeZone}>UTC {timeZone}</option>
                    }))}
                </select>
            </div>
            <select className='h-10 w-[calc(100%-40px)] mx-5 p-3 text-xs outline-1 outline-gray-100' value={mapInfo.travel_type}>
                <option className='text-xs' value={""}>Travel Type</option>
                {travelTypes.map(((travelType,i)=>{
                    return <option className='text-xs' key={i} value={travelType}>{travelType}</option>
                }))}
            </select>
            <select className='h-10 w-[calc(100%-40px)] mx-5 p-3 text-xs outline-1 outline-gray-100' value={mapInfo.member_type}>
                <option className='text-xs' value={""}>Member Type</option>
                {memberTypes.map(((memberType,i)=>{
                    return <option className='text-xs' key={i} value={memberType}>{memberType}</option>
                }))}
            </select>
            <textarea className='h-40 min-h-[160px] w-[calc(100%-40px)] mx-5 p-3 outline-1 outline-gray-100 text-sm' name='description' placeholder='About this travel...' onChange={(e)=>updateMapDescription(e)}></textarea>

        </div>
    </>
  )
}

export default MapInfo