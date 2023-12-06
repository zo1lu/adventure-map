import React, { useState, useContext, useEffect } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
import { Map } from 'ol';
interface TopToolBoxProps {
  mapStatus:boolean,
  mapId:string,
  setMessage:(type:string, content:string)=>void,
  toggleMapStatus:(goPublic:boolean)=>void
  saveView:(map:Map)=>void
}
const TopToolBox = ({mapStatus, mapId, setMessage, toggleMapStatus, saveView}:TopToolBoxProps) => {
  const map = useContext(MapContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  

  const mapStatusToggle = () => {
    const body={
      mapId: mapId,
      setPublic: !mapStatus
    }
    fetch("/api/map?type=public",{
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
        !mapStatus?
        setMessage("success","Successfully public your map!")
        :setMessage("success","Successfully make your map private!")
        setTimeout(()=>{
          setMessage("","")
        },3000)
        toggleMapStatus(!mapStatus)
      }else{
        //show error
        const errorMsg = "Make sure your map infomation is all filled, including title, country, region, image, travel type, member type, date, timezone and description!"
        setMessage("publicAlert", errorMsg)
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

  
  return (
    <div className="w-fit h-10 z-10 absolute top-5 right-5 flex gap-3">
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
      
        
        <button className="w-fit h-10 bg-emerald-950 text-white px-5 rounded-md hover:bg-emerald-900" onClick={()=>saveView(map)}>
        Save View
        </button>
        <div className="h-10 w-28 relative flex flex-col items-start justify-center min-h-10 overflow-hidden">
            <div className="flex items-center justify-center">
              <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={mapStatus}
                  readOnly
              />
              <div
                  onClick={()=>{mapStatusToggle()}}
                  className="w-12 h-7 p-3 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
              ></div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                  {mapStatus?"Public":"Private"}
              </span>
                {/* <label class="inline-flex relative items-center mr-5 cursor-pointer">
                    
                </label> */}
            </div>
        </div>
    </div>
  )
}

export default TopToolBox