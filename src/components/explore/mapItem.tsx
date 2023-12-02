'use client'
import React, {useState} from 'react'
import Image from 'next/image'
interface MapItemProps {
    data:{
        id:string,
        title:string,
        country:string,
        regionOrDistrict:string,
        travelType:{name:string},
        memberType:{name:string},
        author:{id:string, username:string, email:string},
        duration:number,
        mapImage:{id:string, url:string},
        description:string,
        startTime:string,
        endTime:string,
        isLiked:Boolean
    },
    session:object|null,
    goToMap:(mapId:string)=>void
    checkIsLogin:()=>Boolean
}

const MapItem = ({data, session, goToMap, checkIsLogin}:MapItemProps) => {
  const {id, title, country, regionOrDistrict, travelType, memberType, author, duration, mapImage, description, startTime, endTime, isLiked} = data
    
    const [liked, setLiked] = useState(isLiked)
    const likeMap = (mapId:string) => {
        const isLogin = checkIsLogin()
        if(isLogin){
            //send Request base on current like state
            //if success setIsLiked
            setLiked(()=>!liked)
        }    
    }
    return (
        <div className='w-[calc(25%-6px)] h-[330px] cursor-pointer' >
        
        <div className='w-full h-[150px] overflow-hidden' onDoubleClick={()=>{goToMap(id)}}>
            <Image
                src={mapImage?mapImage.url:"/placeholder/mapThumb.jpg"}
                width={300}
                height={150}
                alt="map-img"
            />
        </div>
        <div className='w-full flex flex-col p-2 gap-2'>
            <p className='font-bold text-xl overflow-hidden h-8'>{title}</p>
            <div className='w-full flex justify-between'>
                <p>📍{country}</p>
                <p>📍{regionOrDistrict}</p>
            </div>
            <div className='relative flex items-center justify-between'>
                <p className='text-xs'>{startTime.split("T")[0]}&harr;{endTime.split("T")[0]}</p>
                <p className='text-base font-bold'>{Math.floor(duration/24)} Days {duration % 24} Hours</p>
            </div>
            <div className='flex gap-1'>
                <div className='w-fit border-[1px] rounded-md border-black px-2'>
                    <p className='text-xs'>{travelType.name}</p>
                </div>
                <div className='w-fit border-[1px] rounded-md border-black px-2'>
                    <p className='text-xs'>{memberType.name}</p>
                </div>
                
            </div>
            <div className='h-4 overflow-hidden'>
                <p className='text-xs text-gray-700'>{description}</p>
            </div>
            <div className='flex justify-between'>
              <div className='text-xs text-left'>{author.username}</div>
              <button onClick={()=>{likeMap(id)}}>
                
                <Image 
                  src={liked?'/icons/star-50-fill.png':'/icons/star-50.png'}
                  width={20}
                  height={20}
                  alt="like"
                />
              </button>
            </div>
            
        </div>
    </div>
  )
}

export default MapItem