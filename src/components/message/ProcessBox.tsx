import React from 'react'
interface ProcessBoxProps {
    title:string,
    message:string
}
const ProcessBox = ({title, message}:ProcessBoxProps) => {
    return (
        <div className='w-screen h-screen bg-gray-900 bg-opacity-30 overflow-hidden absolute top-0 z-40'>
            <div className='rounded-md w-[300px] h-[200px] p-3 flex flex-col items-center justify-center absolute top-[calc(50%-100px)] left-[calc(50%-150px)] shadow-2xl bg-white '>
            <h3 className='text-2xl'>{title}</h3>
            <div className='flex flex-col py-3'>
                
                <div className='w-full h-20 flex'>
                    <svg className="animate-spin h-5 w-5 bg-main-70 m-auto" fill="none" viewBox="0 0 40 40"></svg>
                </div>
                <p className='text-xs'>{message}</p>
            </div>
            
            </div>
        </div>
    )
}

export default ProcessBox