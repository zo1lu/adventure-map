'use client'
import React,{useEffect, useState} from 'react'
import Link from 'next/link'
import MyMapItem from '@/components/home/MyMapItem'
import LikedMapItem from '@/components/home/LikedMapItem'
import MessageBox from '../message/MessageBox'

interface ListFolderProps{
    userId:string
}
const ListFolder = ({userId}:ListFolderProps) => {
    const [mapList, setMapList] = useState<object[]|[]>([])
    const [likedList, setLikedList] = useState<object[]|[]>([])
    const [tab,setTab] = useState("maps")
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState({type:"",content:""})
    
    const getMaps = async(userId:string) => {
      fetch(`/api/user?user=${userId}&type=maps`)
      .then((res)=>res.json())
      .then(result=>{
        if(result.data&&result.data.length>0){
          setMapList(()=>{
            return result.data
          })  
        }else{
          setMapList(()=>[])
        }
      })
      .catch(e=>{
        console.log(e)
        setMapList(()=>[])
      })
      setIsLoading(()=>false)
    }
    
    const getLikedMaps = async(userId:string) => {
      fetch(`/api/user?user=${userId}&type=liked`)
      .then((res)=>res.json())
      .then(result=>{
        if(result.data&&result.data.length>0){
          setLikedList(()=>{
            return result.data
          })
        }else{
          setLikedList(()=>[])
        }
      })
      .catch(e=>{
        console.log(e)
        setLikedList(()=>[])
      })
      setIsLoading(()=>false)
    }

    const deleteMap = async(mapId:string, userId:string) => {
      setMessage(()=>{ return {type:"normal",content:"Deleting map..."}})
      fetch("/api/map",{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({mapId:mapId})
        })
        .then((res)=>res.json())
        .then((data)=>{
          if(data.success){
            setMessage(()=>{ return {type:"success",content:"Successfully delete map!"}})
            getMaps(userId)
          }else{
            setMessage(()=>{ return {type:"error",content:"Delete map fail!"}})
          }
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{ return {type:"error",content:"Delete map fail!"}})
        })
        .finally(()=>{
          setTimeout(()=>{
            setMessage(()=>{ return {type:"",content:""}})
          },3000)
        })
    }

    const unlikeAMap = async(mapId:string, userId:string) => {
      setMessage(()=>{ return {type:"normal",content:"Unlike map..."}})
        const body = {
            mapId: mapId,
            userId: userId,
            like: false
        }
        fetch("/api/user?type=like",{
            method:"PATCH",
            headers:{
            'Countent-Type':'application/json'
            },
            body:JSON.stringify(body)
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.success){
              setMessage(()=>{ return {type:"success",content:"Successfully unlike map..."}})
              getLikedMaps(userId)
            }else{
              setMessage(()=>{ return {type:"error",content:"Unlike map fail!"}})
            }
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{ return {type:"error",content:"Unlike map fail!"}})
        })
        .finally(()=>{
          setTimeout(()=>{
            setMessage(()=>{ return {type:"",content:""}})
          },3000)
        })
    }

    useEffect(()=>{
        getMaps(userId)
        getLikedMaps(userId)
    },[userId])   

  return (
    <>    
    <div className='flex relative flex-col col-span-3 row-span-2 overflow-hidden pt-0 lg:pt-10 pb-10'>
        {message.type=="success"||message.type=="error"||message.type=="normal"?<MessageBox type={message.type} message={message.content}/>:null}
        <div className='w-[124px] h-2 bg-white absolute top-[38px] lg:top-[78px] left-[22px]' style={tab=="maps"?{left:'22px'}:{left:'154px'}}></div>
        <div className='flex gap-1 px-5'>
          <button className='w-32 h-10 text-base px-5 font-roboto border-x-2 border-t-2 rounded-t-md' onClick={()=>setTab("maps")} style={tab=="maps"?{borderColor:"#022C22"}:{borderColor:"#f2eeed"}}>My Maps</button>
          <button className='w-32 h-10 text-base px-5 font-roboto border-x-2 border-t-2 rounded-t-md' onClick={()=>setTab("liked")} style={tab=="liked"?{borderColor:"#022C22"}:{borderColor:"#f2eeed"}}>Like Maps</button>
        </div>
        <div className='w-full h-[calc(100%-20px)] border-2 rounded-md border-main-70 py-5 '>
        {tab=="maps"?
            <div className='w-full h-full overflow-y-scroll overflow-x-hidden px-5 flex flex-col gap-1' > 
                {isLoading?<div className='m-auto'>
                    <svg className="animate-spin h-5 w-5 mr-3 bg-main-70 fill-none" viewBox="0 0 40 40"></svg>
                  </div>:
                mapList.length>0?
                mapList.map((data, i)=>{
                return <MyMapItem key={i} mapData={data} userId={userId} deleteMap={deleteMap}/>
              })
              :<div className='pt-5'>
                <p>You owned 0 map.</p>
                <p>Create your travel journal on map</p>
              </div>
                }
            </div>

          :tab=="liked"?
              <div className='w-full h-full overflow-y-scroll overflow-x-hidden px-5 flex flex-col gap-1'> 
                {isLoading?<div className='m-auto'>
                    <svg className="animate-spin h-5 w-5 mr-3 bg-main-70" viewBox="0 0 40 40"></svg>
                  </div>:
                likedList.length>0?
                  likedList.map((data, i)=>{
                    return <LikedMapItem key={i} mapData={data} userId={userId} unlikeAMap={unlikeAMap}/>
                  })
                  :<p className='mt-5'>You do not have any liked map. <Link className='hover:underline' href="/explore">Go explore&rarr;</Link>
                  </p>
                }
              </div>
          :null
        }          
        </div>
      </div>
    </>
    
  )
}

export default ListFolder