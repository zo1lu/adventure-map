'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { mapList, likedMapList } from '../../../deprecate/fake_data'
import { useSession, signOut } from 'next-auth/react'
import MyMapItem from '@/components/home/MyMapItem'
import LikedMapItem from '@/components/home/LikedMapItem'
import { resolve } from 'path'

const HomePage = () => {
    const router = useRouter()  
    const {data:session} = useSession()
    const userId = session?.user?.id;
    const userName = session?.user?.name;
    const userEmail = session?.user?.email;
    const [mapList, setMapList] = useState<object[]|[]>([])
    const [likedList, setLikedList] = useState<object[]|[]>([])
    const [tab,setTab] = useState("maps")
    const createNewMap = async(userId:string) => {
      //create map in database and redirect to map page
      fetch('/api/map',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          "authorId": userId
        })
      })
      .then(res=>res.json())
      .then(data=>{
        router.push(`../map/${data.id}`)
      })
    }
    const logout = async() => {
      try{
        await signOut({redirect:false})
        router.replace("/")
      }catch(e){
        console.log(e)
      }
    }
    
    const unLikeMap = (userId:string, mapId:string) => {

    }
    const getMapRequest = (userId:string) => {
      return new Promise<{"data":object[]}>((resolve, reject)=>{
        fetch(`/api/user?user=${userId}&type=maps`)
        .then((res)=>res.json())
        .then(data=>{
          console.log(data)
          resolve(data)
        })
        .catch(e=>{
          reject({"error":true, message:e})
        })
      })
    }
    const getLikedMapRequest = (userId:string) => {
      return new Promise<{"data":object[]}>((resolve, reject)=>{
        fetch(`/api/user?user=${userId}&type=liked`)
        .then((res)=>res.json())
        .then(data=>{
          console.log(data)
          resolve(data)
        })
        .catch(e=>{
          reject({"error":true, message:e})
        })
      })
    }
    const deleteMapRequest = (mapId:string) => {
      return new Promise<{"success"?:true,"error":true}>((resolve, reject) => {
        fetch("/api/map",{
          method:"DELETE",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({mapId:mapId})
        })
        .then((res)=>res.json())
        .then((data)=>{
          return data.success?resolve(data):reject(data)
        })
        .catch((e)=>{
          return reject(e)
        })
      })
    }
    const getMaps = async(userId:string) => {
      const result = await getMapRequest(userId)
      if(result&&result.data&&result.data.length>0){
        setMapList(()=>{
          return result.data
        })
      }

    }
    const getLikedMaps = async(userId:string) => {

    }
    const deleteMap = async(mapId:string, userId:string) => {
      const result = await deleteMapRequest(mapId)
      if(result&&result.success){
        getMaps(userId)
      }
    }

    useEffect(()=>{
        if(session==null){
        router.push("/")
        }else{
 
          
          getMaps(session.user.id)
        }
    },[session])

  return (
    <div className='w-screen h-screen grid grid-cols-5'>
      
      <div className='flex flex-col gap-3 px-5 py-5 items-start'>
        <div className='text-2xl col-span-1 font-yeseva_one'>ADVENTURE MAP</div>
        <div className='text-roboto text-xl'>Hi! {userName}</div>
        <Link className="hover:underline" href="/explore">Explore</Link>
        <Link className="hover:underline" href="/profile">Profile</Link>
        <button className="hover:underline" onClick={()=>logout()}>Logout</button>
      </div>

      <div className='relative flex flex-col col-span-3 overflow-hidden pt-10 pb-10'>
        <div className='w-[124px] h-1 bg-white absolute top-[80px] left-[22px]' style={tab=="maps"?{left:'22px'}:{left:'154px'}}></div>
        <div className='flex gap-1 px-5'>
          <button className='w-32 h-10 text-base px-5 font-roboto border-x-2 border-t-2 rounded-t-md' onClick={()=>setTab("maps")} style={tab=="maps"?{borderColor:"#022C22"}:{borderColor:"#f2eeed"}}>My Maps</button>
          <button className='w-32 h-10 text-base px-5 font-roboto border-x-2 border-t-2 rounded-t-md' onClick={()=>setTab("liked")} style={tab=="liked"?{borderColor:"#022C22"}:{borderColor:"#f2eeed"}}>Like Maps</button>
        </div>
        {tab=="maps"?
            <div className='w-full h-full overflow-y-scroll p-6 border-2 rounded-md border-main-70' > 
                
                {mapList.length>0?
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
              <div className='w-full h-full overflow-y-scroll p-5 border-2 rounded-md border-main-70'> 
                {likedList.length>0?
                  likedList.map((data, i)=>{
                    return <LikedMapItem key={i} mapData={data} userId={userId}/>
                  })
                  :<p className='mt-5'>You do not have any liked map. <Link className='hover:underline' href="/explore">Go explore&rarr;</Link>
                  </p>
                }
              </div>
          :null
        }          
      </div>

      <button className='col-span-1 absolute right-10 top-5 p-3 w-fit h-fit text-xs bg-emerald-950 text-white rounded-md'
      onClick={()=>createNewMap(userId)}>Create New</button>
      
    </div>
    
  )
}

export default HomePage