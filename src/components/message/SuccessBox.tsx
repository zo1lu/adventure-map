import React from 'react'
interface SuccessBoxProps {
    message:string
}
const SuccessBox = ({message}:SuccessBoxProps) => {
    return (
        <div className='w-screen h-screen bg-gray-900 bg-opacity-30 overflow-hidden absolute top-0 z-40'>
          <div className='rounded-md w-[300px] h-[200px] flex flex-col items-center justify-center absolute top-[calc(50%-100px)] left-[calc(50%-150px)] shadow-2xl bg-white '>
            <h3 className='text-green-500 text-2xl'>Success!</h3>
            <p>{message}</p>
          </div>
        </div>
      )
}

export default SuccessBox