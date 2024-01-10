'use client'
import React, {MouseEvent, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
    session:{user:{id:string,username:string,email:string}}|null,
    checkIsLogin:()=>Boolean
}

const MapItem = ({data, session, checkIsLogin}:MapItemProps) => {
  const {id, title, country, regionOrDistrict, travelType, memberType, author, duration, mapImage, description, startTime, endTime, isLiked} = data
    
    const [liked, setLiked] = useState(isLiked)
    const likeMap = (e:MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const isLogin = checkIsLogin()
        if(isLogin&&session!=null&&session.user!=null){
            const userId = session.user.id
            const mapId = id
            const body = {
                mapId: mapId,
                userId: userId,
                like:!liked
            }
            fetch("/api/user?type=like",{
                method:"PATCH",
                headers:{
                    'Content-Type':'applicattion/json'
                },
                body:JSON.stringify(body)
            })
            .then(res=>res.json())
            .then((data)=>{
                if(data.success){
                    setLiked(()=>!liked)
                }
            })
            .catch((e)=>{
                console.log(e)
            })          
        }    
    }
    return (
        <Link className='sm:w-[calc(50%-6px)] lg:w-[calc(33.3%-6px)]  xl:w-[calc(25%-6px)] h-[330px] cursor-pointer' href={`/explore/map/${id}`} >   
            <div className='w-full h-[150px] overflow-hidden' >
                <Image
                    src={mapImage?mapImage.url:"/placeholder/mapThumb.jpg"}
                    width={400}
                    height={200}
                    alt="map-img"
                />
            </div>
            <div className='w-full flex flex-col p-2 gap-2' >
                <div className='flex flex-col gap-1'>
                    <p className='font-bold text-xl overflow-hidden h-8'>{title}</p>
                    <div className='w-full flex justify-between'>
                        <p>📍{country}</p>
                        <p>📍{regionOrDistrict}</p>
                    </div>
                    <div className='relative flex items-center justify-between'>
                        <p className='text-xs'>{startTime.split("T")[0]}&harr;{endTime.split("T")[0]}</p>
                        <p className='text-base font-bold'>{Math.floor(duration/24)} D {duration % 24} H</p>
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
                </div>
                
                <div className='flex justify-between'>
                <div className='text-xs text-left'>{author.username}</div>
                <button onClick={(e)=>{likeMap(e)}}>
                    <Image 
                    src={liked?'/icons/star-50-fill.png':'/icons/star-50.png'}
                    width={20}
                    height={20}
                    alt="like"
                    />
                </button>
                </div>
                
            </div>
        </Link>
  )
}

export default MapItem