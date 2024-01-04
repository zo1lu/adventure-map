import React from 'react'
interface MessageBoxProps{
    type:string,
    message:string,
}
const MessageBox = ({type, message}:MessageBoxProps) => {
    const messageColor = type=="success"?"green"
                        :type=="error"?"red"
                        :"black"
                        
  return (
    <div className='absolute top-10 right-6 rounded-md h-10 w-fit px-5 py-3 flex' style={{color:messageColor}}>
        <p className='text-xs m-auto'>{message}</p>
    </div>
  )
}

export default MessageBox