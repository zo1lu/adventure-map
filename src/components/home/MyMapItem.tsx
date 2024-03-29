'use client'
import React,{MouseEvent, useState} from 'react'
import Image from 'next/image'
import { ConfirmBox } from '../message/ConfirmBox'
import Link from 'next/link'
interface MyMapItemProp{
    mapData:{
        id:string,
        title:string,
        country:string,
        regionOrDistrict:string,
        description:string,
        isPublic:Boolean,
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
    const [message, setMessage] = useState({type:"",content:""})
    const data = {
        id: mapData.id,
        title: mapData.title?mapData.title:"Title",
        country: mapData.country?mapData.country:"Country",
        regionOrDistrict: mapData.regionOrDistrict!=null?mapData.regionOrDistrict:"Region",
        description: mapData.description?mapData.description:"write",
        public: mapData.isPublic,
        createdAt: mapData.createdAt,
        updatedAt: mapData.updatedAt,
        mapImage: mapData.mapImage?{
            id: mapData.mapImage.id,
            url: mapData.mapImage.url,
        }:null,
        memberType: mapData.memberType?mapData.memberType.name:"",
        travelType: mapData.travelType?mapData.travelType.name:"",
        startTime: mapData.startTime?mapData.startTime.split("T").join(" "):"Start Date",
        startTimeZone: `UTC ${mapData.startTimeZone}`,
        endTime: mapData.endTime?mapData.endTime.split("T").join(" "):"End Date",
        endTimeZone: `UTC ${mapData.endTimeZone}`,
        duration: mapData.duration
    }
    const closeMessageBox = () => {
        setMessage(()=>{
            return {
                type:"",
                content:""
            }
        })
    }
    const confirmAction = () => {
        deleteMap(data.id, userId)
    }
    const deleteConfirm = (e:MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setMessage(()=>{
            return{
                type:"confirm",
                content:"Do you want to delete this map?"
            }
        })
    }
  return (
    <>
    {message.type=="confirm"?<ConfirmBox message={message.content} closeMessageBox={closeMessageBox} confirmAction={confirmAction} />:null}
    <Link className='flex gap-3 p-2 w-full h-[120px] max-h-[150px] rounded-md border-[2px] border-black items-center' href={`/map/${data.id}`}>
        <div className='w-[150px] h-full overflow-hidden rounded-md cursor-pointer' >
            {data.mapImage?
                <Image 
                    placeholder="blur"
                    blurDataURL={'/placeholder/placeHolder0.5.jpg'}
                    src={data.mapImage.url}
                    width={300}
                    height={300}
                    quality={100}
                    alt="map-image"
                    className='w-[150px] h-[100px] object-cover'
                />
                :<Image 
                placeholder="blur"
                blurDataURL={'/placeholder/placeHolder0.5.jpg'}
                src={"/placeholder/placeHolder0.5-thumbnail.jpg"}
                width={300}
                height={300}
                quality={100}
                alt="thumb"
                className='w-[150px] h-[100px] object-cover'
            />
            }
            
        </div>
        <div className='grid xl:grid-cols-8 grid-cols-6 items-center gap-1 px-2 w-4/5 cursor-pointer overflow-hidden'>
            <div className='w-full min-w-[300px] col-span-4 flex flex-col gap-1 items-start'>
                <h3 className='text-lg font-bold font-roboto'>{data.title}</h3>
                <p className='text-sm font-roboto'>{data.country}, {data.regionOrDistrict}</p>
                <div className='flex gap-1 items-center'>
                    <p className='text-xs font-roboto'>{data.startTime}</p>
                    <span className='text-xs font-roboto'>&harr;</span>
                    <p className='text-xs font-roboto'>{data.endTime}</p>
                    <p className='text-xs font-roboto font-bold'>{Math.floor(data.duration/24)} Days {data.duration % 24}Hours</p>
                </div>
                
            </div>
            <div className='col-span-2 flex gap-2 items-center justify-center'>
                <div className='w-2 h-2 rounded-full' style={{backgroundColor:data.public?"green":"red"}}></div>
                <label className='text-xs'>{data.public?"Public":"Private"}</label>
            </div>
            <div className='hidden xl:block col-span-2 min-w-[200px]'>
                <p className='text-xs text-gray-400'>Created: {data.createdAt.split(".")[0]}</p>
                <p className='text-xs text-gray-400'>Updated: {data.updatedAt.split(".")[0]}</p>
            </div>
        </div>
        <button className='w-10' onClick={(e)=>deleteConfirm(e)}>
            <Image 
            src='/icons/remove-32.png'
            width={25}
            height={25}
            alt='delete_btn'
            />
        </button>
    </Link>
    </>
    
  )
}

export default MyMapItem