'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
interface LikedMapItemProps{
    mapData:{
        id:string,
        title:string,
        country:string,
        regionOrDistrict:string,
        startTime:string,
        startTimeZone:string,
        endTime:string,
        endTimeZone:string,
        duration:number,
        author:{
            username:string,
        },
        description:string,
        mapImage?:{
            id:string,
            url:string,
        },
        memberType?:{
            name:string
        },
        travelType?:{
            name:string
        },
    },
    userId:string,
    unlikeAMap:(mapId:string, userId:string)=>void
}
const LikedMapItem = ({mapData, userId, unlikeAMap}:LikedMapItemProps) => {
    const router = useRouter()
    const goToPublicMapPage = (mapId:string) => {
        const url = `/explore/map/${mapId}`
        router.push(url)
    }

    const data = {
        id: mapData.id,
        title: mapData.title,
        country: mapData.country,
        region: mapData.regionOrDistrict,
        author: mapData.author.username,
        imageUrl: mapData.mapImage?mapData.mapImage.url:"/placeholder/mapThumb.jpg",
        memberType: mapData.memberType?mapData.memberType.name:"",
        travelType: mapData.travelType?mapData.travelType.name:"",
        startTime: mapData.startTime?mapData.startTime.split("T").join(" "):"",
        startTimeZone: `UTC ${mapData.startTimeZone}`,
        endTime: mapData.endTime?mapData.endTime.split("T").join(" "):"",
        endTimeZone: `UTC ${mapData.endTimeZone}`,
        duration: mapData.duration
    }
  return (
    <div className='flex gap-3 p-2 w-full h-[120px] rounded-md border-2 border-black' >
        <div className='w-[150px] h-[100px] overflow-hidden rounded-md cursor-pointer' onClick={()=>goToPublicMapPage(data.id)}>
            <Image 
                src={data.imageUrl}
                width={500}
                height={500}
                quality={100}
                alt="map-image"
                className='w-[200px] h-[100px] object-cover'
            />
        </div>
        
        <div className='flex items-center gap-5 px-2 w-4/5 cursor-pointer' onClick={()=>goToPublicMapPage(data.id)}>
            <div className='w-4/5 flex flex-col gap-1'>
                <h3 className='text-lg font-bold font-roboto'>{data.title}</h3>
                <p className='text-sm font-roboto'>{data.country}</p>
                <div className='flex gap-1 items-center'>
                    <p className='text-xs text-gray-400'>{data.startTime} {data.startTimeZone} &harr; {data.endTime} {data.endTimeZone}
                    </p>
                    <p className='text-xs font-roboto font-bold'>{Math.floor(data.duration/24)} Days {data.duration % 24}Hours</p>
                </div>
                
                <div className='flex gap-1'>
                    <p className='w-fit text-xs border-main-70 border-[1px] rounded-md px-[2px] py-[1px]'>Culture & History</p>
                    <p className='w-fit text-xs border-main-70 border-[1px] rounded-md px-[2px] py-[1px]'>Single person</p>
                </div>
                
            </div>
            <div className='w-1/5 min-w-[240px] '>
                <p className='text-xs text-gray-400 text-center'>author: {data.author}</p>
            </div>
        </div>
        <button onClick={()=>{unlikeAMap(data.id, userId)}}>
            <Image 
                src='/icons/star-50-fill.png'
                width={25}
                height={25}
                alt='delete_btn'
            />
        </button>
    </div>
  )
}

export default LikedMapItem