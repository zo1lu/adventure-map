import React from 'react'
interface ConfirmBoxProps {
    message: string
    closeMessageBox: ()=> void
    confirmAction:()=> void
}
export const ConfirmBox = ({message, closeMessageBox, confirmAction}:ConfirmBoxProps) => {
    const closeConfirmPage = () => {
        closeMessageBox()
      }
      const confirmMessage = () => {
        confirmAction()
      }
  return (
    <div className='w-screen h-screen bg-gray-900 bg-opacity-30 overflow-hidden absolute top-0 z-40'>
        <div className='rounded-md w-[300px] h-[200px] flex flex-col items-center justify-center absolute top-[calc(50%-100px)] left-[calc(50%-150px)] shadow-2xl bg-white '>
            <h3 className='text-red-700 text-2xl'>Are you Sure!</h3>
            <p>{message}</p>
            <div className='flex gap-3'>
                <button className='border-black border-2 rounded-md py-2 px-5'
                onClick={()=>closeConfirmPage()}>CANCLE</button>
                <button className='border-black border-2 rounded-md py-2 px-5'
                onClick={()=>confirmMessage()}>OK</button>
            </div>
            
        </div>
    </div>
    
  )
}
