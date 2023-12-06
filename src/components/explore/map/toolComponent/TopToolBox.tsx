import React, { useState, useContext, useEffect } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
interface TopToolBoxProps {
  isLiked:boolean,
  mapId:string,
  userId:string,
  setMessage:(type:string, content:string)=>void,
  toggleIsLiked:(like:boolean)=>void
}
const TopToolBox = ({isLiked, mapId, userId, setMessage, toggleIsLiked}:TopToolBoxProps) => {
  const map = useContext(MapContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  

  const mapLikedToggle = () => {
    // console.log("hiiii")
    if(userId==""){
      setMessage("alert","Please login to like the map")
      return 
    }
    const body={
      mapId: mapId,
      userId: userId,
      like: !isLiked
    }
    fetch("/api/user?type=like",{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
    })
    .then(res=>res.json())
    .then((result)=>{
      if(result.success){
        // show successfull message
        isLiked?
        setMessage("success","Successfully unlike this map!")
        :setMessage("success","Successfully like this map!")
        setTimeout(()=>{
          setMessage("","")
        },3000)
        toggleIsLiked(!isLiked)
      }
    })
    .catch((e)=>{
      console.log(e)
      //show error message
      setMessage("error","Failed, please try again!")
      setTimeout(()=>{
        setMessage("","")
      },3000)
    })
  }
  const likeImageUrl = isLiked?'/icons/star-50-fill.png':'/icons/star-50.png'
  
  return (
    <div className="w-fit h-10 z-10 absolute top-5 right-8 flex gap-5 items-center">
      <button onClick={()=>{setIsSearchOpen(!isSearchOpen)}}>
          <Image 
            src={'/icons/search-48.png'}
            width={30}
            height={30}
            alt="edit_button"
          />
        </button>
      {isSearchOpen?
        <div>
          <input
          className="w-50 h-10 z-10 p-3 rounded-md"
          type="text"
          placeholder="Where are you?"
          />
        </div>
        :<></>}
      
        
        {/* <button className="w-fit h-10 bg-emerald-950 text-white px-5 rounded-md hover:bg-emerald-900" onClick={()=>save(map)}>
        Save
        </button> */}
        <div className='w-[30px] h-[30px]'>
          <Image 
            onClick={()=>{mapLikedToggle()}}
            src={likeImageUrl}
            width={30}
            height={30}
            alt="like_button"
          />
        </div>
        
        {/* <div className="h-10 w-28 relative flex flex-col items-start justify-center min-h-10 overflow-hidden">
            <div className="flex items-center justify-center">
              <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={mapStatus}
                  readOnly
              />
              <div
                  onClick={()=>{mapLikedToggle()}}
                  className="w-12 h-7 p-3 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
              ></div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                  {mapStatus?"Public":"Private"}
              </span>
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                    
                </label>
            </div>
        </div> */}
    </div>
  )
}

export default TopToolBox