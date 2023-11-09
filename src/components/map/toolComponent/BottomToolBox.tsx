import React from 'react'
import Image from 'next/image'
const BottomToolBox = () => {
  return (
    <div className='w-fit h-20 z-10 absolute bottom-3 right-8 flex gap-8 items-center'>
      <button onClick={()=>{}}>
        <Image 
          src={'/icons/navigate-48.png'}
          width={25}
          height={25}
          alt="edit_button"
        />
      </button>
      <button onClick={()=>{}}>
        <Image 
          src={'/icons/subtract-60.png'}
          width={25}
          height={25}
          alt="edit_button"
        />
      </button>
      <button onClick={()=>{}}>
        <Image 
          src={'/icons/plus-60.png'}
          width={25}
          height={25}
          alt="edit_button"
        />
      </button>
      <div className='w-16 h-16 rounded-md bg-transparent border-2 border-emerald-950'></div>
    </div>
  )
}

export default BottomToolBox