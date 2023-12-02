'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
interface MyMapItemProp{
    mapData:{
        id:string,
        title:string,
        country:string,
        regionOrDistrict:string,
        description:string,
        public:Boolean,
        createdAt:string,
        updatedAt:string,
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
        startTime:string,
        startTimeZone:string,
        endTime:string,
        endTimeZone:string,
        duration:number
    },
    userId:string,
    deleteMap:(mapId:string,userId:string)=>void
}
const MyMapItem = ({mapData, userId, deleteMap}:MyMapItemProp) => {
    const router = useRouter()
    const data = {
        id: mapData.id,
        title: mapData.title?mapData.title:"Title",
        country: mapData.country?mapData.country:"Country",
        regionOrDistrict: mapData.regionOrDistrict!=null?mapData.regionOrDistrict:"region",
        description: mapData.description?mapData.description:"write",
        public: mapData.public,
        createdAt: mapData.createdAt,
        updatedAt: mapData.updatedAt,
        mapImage: mapData.mapImage?{
            id: mapData.mapImage.id,
            url: mapData.mapImage.url,
        }:null,
        memberType: mapData.memberType?mapData.memberType.name:"",
        travelType: mapData.travelType?mapData.travelType.name:"",
        startTime: mapData.startTime?mapData.startTime.split("T").join(" "):"",
        startTimeZone: `UTC ${mapData.startTimeZone}`,
        endTime: mapData.endTime?mapData.endTime.split("T").join(" "):"",
        endTimeZone: `UTC ${mapData.endTimeZone}`,
        duration: mapData.duration
    }
    const goToMapPage = (mapId:string) => {
        const url = `/map/${mapId}`
        router.push(url)
    }
  return (
    <button className='flex gap-3 p-2 my-2 w-full h-[120px] max-h-[150px] rounded-md border-[2px] border-black items-center' onDoubleClick={()=>goToMapPage(data.id)}>
        <div className='w-[150px] h-full overflow-hidden rounded-md'>
            {data.mapImage?
                <Image 
                    src={data.mapImage.url}
                    width={300}
                    height={300}
                    quality={100}
                    alt="map-image"
                    className='w-[200px] h-[100px] object-cover'
                />
                :<Image 
                src={"/placeholder/mapThumb.jpg"}
                width={300}
                height={300}
                quality={100}
                alt="thumb"
                className='w-[200px] h-[100px] object-cover'
            />
            }
            
        </div>
        <div className='grid grid-cols-8 items-center gap-5 px-2 w-4/5'>
            <div className='w-full col-span-4 flex flex-col gap-1 items-start'>
                <h3 className='text-lg font-bold font-roboto'>{data.title}</h3>
                <p className='text-sm font-roboto'>{data.country}, {data.regionOrDistrict}</p>
                <div className='flex gap-1 items-center'>
                    <p className='text-xs font-roboto'>{data.startTime}</p>
                    {/* <p className='text-xs font-roboto'>{data.startTimeZone}</p> */}
                    <span className='text-xs font-roboto'>&harr;</span>
                    <p className='text-xs font-roboto'>{data.endTime}</p>
                    {/* <p className='text-xs font-roboto'>{data.endTimeZone}</p> */}
                    <p className='text-xs font-roboto font-bold'>{Math.floor(data.duration/24)} Days {data.duration % 24}Hours</p>
                </div>
                
            </div>
            <div className='col-span-2 flex gap-2 items-center justify-center'>
                <div className='w-2 h-2 rounded-full' style={{backgroundColor:data.public?"green":"red"}}></div>
                <label className='text-xs'>{data.public?"Public":"Private"}</label>
            </div>
            <div className='col-span-2 min-w-[200px]'>
                <p className='text-xs text-gray-400'>Created: {data.createdAt}</p>
                <p className='text-xs text-gray-400'>Updated: {data.updatedAt}</p>
            </div>
        </div>
        <button onClick={()=>deleteMap(data.id, userId)}>
            <Image 
            src='/icons/remove-32.png'
            width={25}
            height={25}
            alt='delete_btn'
            />
        </button>
    </button>
  )
}

export default MyMapItem