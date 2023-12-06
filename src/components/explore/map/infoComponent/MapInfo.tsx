import React,{useEffect, useState} from 'react'
import Image from 'next/image';
import { travelTypes, memberTypes } from '@/data/map';
import { timeZoneArray } from '@/data/dateAndTime';

//data for test

interface MapInfoProps {
    mapData:mapDataType
}
const MapInfo = ({mapData}:MapInfoProps) => {
    const [textAreaStyle, setTextAreaStyle] = useState({
        minHeight:"300px",
    })
    
    const travelType = travelTypes.filter(type=>type.id==mapData.travelTypeId)[0]
    const memberType = memberTypes.filter(type=>type.id==mapData.memberTypeId)[0]
    const startTimeZone = timeZoneArray.filter(timeZone=>timeZone.offset==mapData.startTimeZone)[0]
    const endTimeZone = timeZoneArray.filter(timeZone=>timeZone.offset==mapData.endTimeZone)[0]
  return (
    <>
        <div className='bg-white rounded-md w-[500px] max-h-[80vh] h-fit absolute top-12 left-0 py-8 overflow-y-scroll flex flex-col gap-3'>
            <div className='h-10 w-[calc(100%-40px)] mx-5' >
                <span>🗺️</span>
                <input value={mapData.title} className='h-full w-[calc(100%-40px)] outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xl font-bold' name="title" placeholder='Title' readOnly/>
            </div>
            
            {/* CountryList? */}
            <div className='h-5 w-[calc(100%-40px)] mx-5 flex'>
            <span>📍</span>
            <input value={mapData.country} className='h-5 w-1/2 outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' name="country" placeholder='Country' readOnly/>
            <span>📍</span>
            <input value={mapData.regionOrDistrict} className='h-5 w-1/2 outline-none pl-1 bg-transparent focus:border-0 focus:border-b-[1px] border-gray-600 text-xs' name="region_or_district" placeholder='Region or District' readOnly/>
            </div>
            {/* image */}
            <div className='w-full h-[360px] min-h-[360px] overflow-hidden relative'>
                {mapData.mapImage&&mapData.mapImage.url?
                    <Image 
                    src={mapData.mapImage.url}
                    width={500}
                    height={360}
                    quality={100}
                    alt="map_main_image"
                    className='w-[500px] h-[360px] object-cover'
                />:<div className='w-[500px] h-[360px] bg-gray-300'></div>
                }
            </div>
                
            <div className='h-10 w-[calc(100%-40px)] mx-5 flex items-center gap-3'>
                <div className='w-1/2 h-10 flex ml-3'>
                    <p className='text-xs w-fit font-bold mr-3 leading-10'>Travel Type: </p>
                    <p className='text-xs w-fit leading-10'>{travelType.name}</p>
                </div>
                <div className='w-1/2 h-10 flex ml-3'>
                    <p className='text-xs w-fit font-bold mr-3 leading-10'>Member Type: </p>
                    <p className='text-xs w-fit leading-10'>{memberType.name}</p>
                </div>
            </div>
            {/* start time */}
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-14 text-xs font-bold leading-8 ml-3'>From: &#8614;</p>
                <input
                    value={mapData.startTime}
                    className='h-full w-20 p-3 text-xs outline-1 outline-gray-100 flex-grow'
                    type="datetime-local"
                    name="start_time"
                    // defaultValue={getLocalDateTime()}
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                    readOnly
                />
                <p className='h-full text-xs leading-8 w-20'>UTC {startTimeZone.offset} {startTimeZone.abbr}</p>
            </div>
            {/* end time */}
            <div   className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-14 text-xs font-bold leading-8 ml-3'>&#8612; To:</p>
                <input
                    value={mapData.endTime}
                    className='h-full w-20 p-3 text-xs outline-1 outline-gray-100 flex-grow'
                    type="datetime-local"
                    name="end_time"
                    // defaultValue={getLocalDateTime()}
                    min="2020-06-30T00:00"
                    max="2050-06-30T00:00"
                    readOnly
                />
                <p className='h-full text-xs leading-8 w-20'>UTC {endTimeZone.offset} {endTimeZone.abbr}</p>
            </div>
            <div className='h-8 w-[calc(100%-40px)] mx-5 flex'>
                <p className='h-full w-16 text-xs font-bold leading-8 ml-3'>Duration:</p>
                <p className='h-full w-10 leading-8 text-xs'><span>{mapData.duration}              
                </span>hour</p>
            </div>
            
            <textarea value={mapData.description} className='w-[calc(100%-40px)] mx-5 p-3 outline-1 outline-none text-sm ' style={textAreaStyle}  name='description' placeholder='About this travel...' readOnly></textarea>            
        </div>
    </>
  )
}

export default MapInfo