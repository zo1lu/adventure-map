import React, { useState, useContext, useEffect } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
import { fromLonLat } from 'ol/proj';
import { renderSearchGeoFeature } from '@/utils/geoData';
import { GeoJSONFeature } from 'ol/format/GeoJSON';
import { searchSource } from '@/utils/map/layer';

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
  const [keyword, setKeyword] = useState("")
  const [searchList, setSearchList] = useState([])
  
  const mapLikedToggle = () => {
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
      setMessage("error","Failed, please try again!")
      setTimeout(()=>{
        setMessage("","")
      },3000)
    })
  }
  const searchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if(isSearchOpen){
      setKeyword(()=>"")
      setSearchList(()=>[])
      searchSource.clear()
    }
  }
  const lookForLocation = (key:string) => {
    setKeyword(()=>key)
  }
  const goToPlace = (coordinate:[number,number],bbox:[number,number,number,number], geoData:GeoJSONFeature) => {
    renderSearchGeoFeature(geoData)
    const coor = fromLonLat(coordinate)   
    const boxHeight = bbox[1]-bbox[0]
    const zoomValue = Math.log2(2400/boxHeight)>18?18:Math.log2(2400/boxHeight)
    map.getView().setCenter(coor)
    map.getView().setZoom(zoomValue)
  }

  useEffect(()=>{
    let t:ReturnType<typeof setTimeout>
    t = setTimeout(()=>{
      if(keyword!=""){
        const url = `https://nominatim.openstreetmap.org/search?q=${keyword}&format=json&polygon_geojson=1&limit=5`
        fetch(url)
        .then((res)=>res.json())
        .then((data)=>{
          setSearchList(()=>data)
        })
        .catch((e)=>{
          console.log(e)
          setSearchList(()=>[])
        })
      }else{
        setSearchList(()=>[])
      }
    },500)
    return ()=>{
      clearTimeout(t)
    }
  },[keyword])

  const likeImageUrl = isLiked?'/icons/star-50-fill.png':'/icons/star-50.png'
  
  return (
    <div className="w-fit h-10 z-10 absolute top-5 right-8 flex gap-5">
      <button onClick={()=>{searchToggle()}}>
          <Image 
            src={'/icons/search-48.png'}
            width={30}
            height={30}
            alt="edit_button"
          />
        </button>
      {isSearchOpen?
        <div className="w-48 h-fit overflow-hidden">
          <input
          value={keyword}
          className="w-48 h-10 z-10 p-3 rounded-md focus:border-2"
          type="text"
          placeholder="Where are you?"
          onChange={(e)=>{lookForLocation(e.target.value)}}
          />
          <div className='max-w-48 flex flex-col'>
            {searchList&&searchList.length>0?searchList.map((result,i)=>{
              return <div key={i} className='w-48 h-fit p-3 bg-white overflow-hidden hover:bg-neutral-light cursor-pointer' onClick={()=>goToPlace([result.lon,result.lat], result.boundingbox, result.geojson)}>
                <p className='w-full text-xs font-bold whitespace-nowrap text-ellipsis overflow-hidden'>{result.name}</p>
                <p className='w-full text-xs gray-600 whitespace-nowrap text-ellipsis overflow-hidden'>{result.display_name}</p>
              </div>
            }):null}
          </div>
          
        </div>
        :<></>}
      
        <div className='w-[30px] h-[30px]'>
          <Image 
            onClick={()=>{mapLikedToggle()}}
            src={likeImageUrl}
            width={30}
            height={30}
            alt="like_button"
          />
        </div>
    </div>
  )
}

export default TopToolBox