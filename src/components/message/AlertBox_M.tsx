import React from 'react'
interface AlertBoxMProps {
  message: string
  closeMessageBox: ()=> void
}
const AlertBox_M = ({message, closeMessageBox}:AlertBoxMProps) => {
  const closeAlertPage = () => {
    closeMessageBox()
  }
  return (
    <div className='w-screen h-screen bg-gray-400 bg-opacity-30 overflow-hidden absolute top-0 z-40'>
      <div className='rounded-md w-[360px] h-[260px] flex flex-col items-center justify-center absolute top-[calc(50%-100px)] left-[calc(50%-150px)] shadow-2xl bg-white p-10'>
        <h3 className='text-red-700 text-2xl'>Warning!</h3>
        <p className='text-center'>{message}</p>
        <button className='border-black border-2 rounded-md py-2 px-5 mt-3'
        onClick={()=>closeAlertPage()}>OK</button>
      </div>
    </div>
  )
}

export default AlertBox_M
