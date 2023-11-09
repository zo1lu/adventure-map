import React, { useState } from 'react'
import Image from 'next/image'

const TopToolBox = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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
      
        
        <button className="w-fit h-10 bg-emerald-950 text-white px-3 rounded-md hover:bg-emerald-900">
        Save
        </button>
    </div>
  )
}

export default TopToolBox