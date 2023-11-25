import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MapInfo from './MapInfo'
interface MapHeadProps {
    openImagePreview:(type:ImageTargetType, id:string)=>void
}

const MapHead = ({openImagePreview}: MapHeadProps) => {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isMapInfoOpen, setIsMapInfoOpen] = useState(false)
    const [mapName, setMapName] = useState("")
    const navToggle = () => {
        setIsNavOpen(()=>!isNavOpen)
    }
    const mapInfoToggle = () => {
        setIsMapInfoOpen(()=>!isMapInfoOpen)
    }

  return (
        <div className='absolute top-5 left-5 h-10 w-fit flex gap-3'>
            <button className='bg-transparent rounded-md flex items-center gap-3 p-3 hover:bg-white' onClick={navToggle}>
                <p className='text-lg font-bold text-emerald-950'>AdventureMap</p>
                <Image 
                    src='/icons/arrow-down-30.png'
                    width={20}
                    height={20}
                    alt='map Info'/>
            </button>
            <button className='h-10 w-10' onClick={mapInfoToggle}>
                <Image
                    className='m-auto'
                    src='/icons/map-50.png'
                    width={20}
                    height={20}
                    alt='map Info'
                />
            </button>
            <input type='text' className='bg-transparent h-10 w-40 p-3 text-lg font-bold text-emerald-950 focus:bg-white focus:border-emerald-950 focus:border-2 ' onChange={()=>console.log("Hi")} placeholder='map name'/>
            
            {isNavOpen?
            <div className='w-[187px] h-[200px] rounded-md bg-white absolute top-12 left-0 p-5' >
                <Link className='block mb-3' href="/home">Home</Link>
                <Link className='block' href="/explore">Explore</Link>
            </div>:<></>}
            {isMapInfoOpen?<MapInfo openImagePreview={openImagePreview}/>:<></>}
        </div>
  )
}

export default MapHead