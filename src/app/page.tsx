import React from 'react'
import Link from 'next/link'
const LandingPage = () => {
  const scrollingText = "Map &#10033;Note&#x2726;Route&#x2691;Spot&#9650;Photo&#x2605;Geometry&#x25A0; "
  return (
    <div className='w-screen h-screen flex flex-col items-start cursor-crosshair overflow-hidden'>
      {/* <div className='w-full h-8 uppercase overflow-hidden text-xl'>{scrollingText.repeat(6)}</div> */}
      <div className='sm:block hidden w-screen h-10 leading-10 uppercase overflow-hidden text-xl hover:bg-main-70 hover:text-neutral-light px-2'>Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687; Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687; Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687; Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687; Map &#10033; Note &#x2726; Route &#x2691; Spot &#9206; Photo &#x2605; Geometry &#9687;</div>
      <div className='hidden w-4/5 max-w-[1200px] h-[calc(50%-40px)] md:h-[calc(100%-40px)] min-h-[300px] py-[clac(100%-150px)] mx-auto sm:grid md:grid-cols-3 md:grid-rows-1 gap-3 grid-cols-1 grid-rows-3'>
        <div className='w-fit h-full md:col-span-2 flex flex-col justify-center row-span-2'>
          <h1 className='md:text-lg mb-5 text-base'>Welcome to</h1>
          <p className='h-fit 2xl:text-[100px] md:text-6xl text-5xl font-yeseva_one relative md:bottom-5 bottom-3'>ADVENTURE MAP</p>
          <h3 className='2xl:text-3xl text-xl'>Create travel journal on the map and explore others&apos;</h3>
        </div>
        <div className='w-full col-span-1 flex md:flex-col gap-3 md:justify-center md:items-end items-start justify-start'>
          <Link className='hover:underline md:text-xl text-base cursor-zoom-in' href="/home">Get started &rarr;</Link>
          <Link className='hover:underline md:text-xl text-base cursor-zoom-in' href="/explore">Explore &rarr;</Link>
        </div>
        
      </div>
      <div className='w-screen h-screen sm:hidden flex bg-main-70 justify-center items-center'>
        <p className='text-white m-auto'>View in landscape mode</p>
      </div>
    </div>
  )
}

export default LandingPage