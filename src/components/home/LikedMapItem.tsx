'use client'
import React from 'react'
import Image from 'next/image'
interface LikedMapItemProps{
    mapData:{
        id:string,
        title:string,
        country:string,
        region:string,
        startTime:string,
        startTimeZone:string,
        endTime:string,
        endTimeZone:string,
        duration:number,
        author:string,
        description:string,
        travelType:string,
        memberType:string,
        image:{
            id:string,
            url:string,
        }
    },
    userId:string|undefined
}
const LikedMapItem = ({mapData, userId}:LikedMapItemProps) => {
    const unlikeAMap = (userId:string, mapId:string) => {

    }
    const data = {
        
    }
  return (
    <div className='flex gap-3 p-2 my-2 w-full h-[calc(32%-5px)] rounded-md border-2 border-black' >
        <div className='w-[150px] h-[100px] overflow-hidden rounded-md'>
        <Image 
            src={data.image.url}
            width={500}
            height={500}
            quality={100}
            alt={data.title.toLowerCase()}
            className='w-[200px] h-[100px] object-cover'
        />
        </div>
        
        <div className='flex items-center gap-5 px-2 w-4/5'>
            <div className='w-4/5 flex flex-col gap-1'>
                <h3 className='text-lg font-bold font-roboto'>{data.title}</h3>
                <p className='text-sm font-roboto'>{data.country}</p>
                <p className='text-xs text-gray-400'>{data.startTime} {data.startTimeZone} &harr; {data.endTime} {data.endTimeZone}<span className='font-bold'>{data.duration / 24} Days</span></p>
                <div className='flex gap-1'>
                    <p className='w-fit text-xs border-main-70 border-[1px] rounded-md px-[2px] py-[1px]'>Culture & History</p>
                    <p className='w-fit text-xs border-main-70 border-[1px] rounded-md px-[2px] py-[1px]'>Single person</p>
                </div>
                
            </div>
            <div className='w-1/5 min-w-[240px] '>
                <p className='text-xs text-gray-400 text-center'>author: {data.author}</p>
            </div>
        </div>
        <button onClick={()=>{unlikeAMap(userId,data.id)}}>
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