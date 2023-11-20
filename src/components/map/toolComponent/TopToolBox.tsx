import React, { useState, useContext } from 'react'
import Image from 'next/image'
import MapContext from '@/context/MapContext';
const TopToolBox = ({save}) => {
  const map = useContext(MapContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mapStatus, setMapStatus] = useState(false)
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
      
        
        <button className="w-fit h-10 bg-emerald-950 text-white px-5 rounded-md hover:bg-emerald-900" onClick={()=>save(map)}>
        Save
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
                  onClick={() => {setMapStatus(!mapStatus);}}
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