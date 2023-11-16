import React from 'react'
import Link from 'next/link'
const LandingPage = () => {
  const scrollingText = "Map Note Route Spot Photo Geometry "
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='w-full h-8 uppercase overflow-hidden text-xl'>{scrollingText.repeat(6)}</div>
      <div className='w-4/5 h-[400px] my-40 mx-auto grid grid-cols-2 grid-rows-1 gap-3'>
        <div className='w-full h-full col-span-1 pt-20 pl-10 border-2 border-solid border-emerald-950'>
          <h1 className='text-3xl mb-3'>WELCOME TO <span className='text-5xl'>ADVENTURE MAP</span></h1>
          <h3 className='text-2xl'>Create travel journal on the map and explore others&apos;</h3>
        </div>
        <div className='w-full relative col-span-1'>
          {/* if login link to home page else login */}
          <button className='absolute bottom-10 right-40 p-3 w-fit h-fit bg-emerald-950 text-white rounded-md'>
            <Link href="/home">&rarr;Get started!</Link>
          </button>
        </div>
        
      </div>
      
      
    </div>
  )
}

export default LandingPage