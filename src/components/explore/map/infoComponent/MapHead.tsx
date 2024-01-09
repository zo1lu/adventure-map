import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MapInfo from './MapInfo'
interface MapHeadProps {
    mapData:mapDataType
}

const MapHead = ({mapData}: MapHeadProps) => {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isMapInfoOpen, setIsMapInfoOpen] = useState(true)
    const navToggle = () => {
        setIsNavOpen(()=>!isNavOpen)
        if(!isNavOpen){
            setIsMapInfoOpen(()=>false)
        }
    }
    const mapInfoToggle = () => {
        setIsMapInfoOpen(()=>!isMapInfoOpen)
        if(!isMapInfoOpen){
            setIsNavOpen(()=>false)
        }
    }

  return (
        <div className='absolute top-5 left-5 h-10 w-fit flex gap-3'>
            <button className='bg-transparent rounded-md flex items-center gap-3 p-3 hover:bg-white' style={{backgroundColor:isNavOpen?'white':'transparent'}} onClick={navToggle}>
                <p className='text-lg font-bold text-emerald-950 font-yeseva_one'>AdventureMap</p>
                <Image 
                    src='/icons/arrow-down-30.png'
                    width={20}
                    height={20}
                    alt='map Info'/>
            </button>
            <button className='h-10 w-10 rounded-md' style={{backgroundColor:isMapInfoOpen?'white':'transparent'}} onClick={mapInfoToggle}>
                <Image
                    className='m-auto'
                    src='/icons/map-50.png'
                    width={20}
                    height={20}
                    alt='map Info'
                />
            </button>            
            {isNavOpen?
            <div className='w-[187px] h-[200px] rounded-md bg-white absolute top-12 left-0 p-5' >
                <Link className='block mb-3' href="/home">Home</Link>
                <Link className='block' href="/explore">Explore</Link>
            </div>:<></>}
            {isMapInfoOpen?<MapInfo mapData={mapData}/>:<></>}
        </div>
  )
}

export default MapHead