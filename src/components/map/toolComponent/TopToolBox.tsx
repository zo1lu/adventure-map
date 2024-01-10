import React, { useState, useContext, useEffect } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
import { Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import { renderSearchGeoFeature } from '@/utils/geoData';
import { GeoJSONFeature } from 'ol/format/GeoJSON';
import { searchSource } from '@/utils/map/layer';

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
  const [keyword, setKeyword] = useState("")
  const [searchList, setSearchList] = useState([])

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

  return (
    <div className="w-fit h-10 z-10 absolute top-5 right-5 flex gap-3">
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
            </div>
        </div>
    </div>
  )
}

export default TopToolBox