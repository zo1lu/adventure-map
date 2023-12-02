import React from 'react'
import Link from 'next/link'
const LandingPage = () => {
  const scrollingText = "Map &#10033;Note&#x2726;Route&#x2691;Spot&#9650;Photo&#x2605;Geometry&#x25A0; "
  return (
    <div className='w-full h-screen flex flex-col items-start cursor-crosshair'>
      {/* <div className='w-full h-8 uppercase overflow-hidden text-xl'>{scrollingText.repeat(6)}</div> */}
      <div className='w-full h-10 leading-10 uppercase overflow-hidden text-xl hover:bg-main-70 hover:text-neutral-light px-2'>Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687; Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687; Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687; Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687; Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687;</div>
      <div className='w-4/5 h-[500px] my-40 mx-auto grid grid-cols-3 grid-rows-1 gap-3'>
        <div className='w-fit h-full col-span-2 pl-10 flex flex-col justify-center'>
          <h1 className='text-xl'>WELCOME TO</h1>
          <p className='h-32 text-[100px] font-yeseva_one relative bottom-5'>ADVENTURE MAP</p>
          <h3 className='text-3xl'>Create travel journal on the map and explore others&apos;</h3>
        </div>
        <div className='w-full col-span-1 flex flex-col gap-3 justify-center items-end'>
          <Link className='hover:underline text-xl cursor-zoom-in' href="/home">Get started &rarr;</Link>
          <Link className='hover:underline text-xl cursor-zoom-in' href="/explore">Explore &rarr;</Link>
        </div>
        
      </div>
    </div>
  )
}

export default LandingPage