import React from 'react'
import ImageAlert from './AlertBox'
// import { ImageConfirm } from './ConfirmBox'
interface MessageBoxProps {
    type:string,
    messageType: string,
    content:string,
    resetMessageBox:()=>void
}

const MessageBox = ({type, messageType, content, resetMessageBox}:MessageBoxProps) => {
  return (
    <div className='w-screen h-screen bg-gray-900 bg-opacity-30 overflow-hidden absolute top-0 z-40' style={type?{display:"block"}:{display:"none"}}>
        {type=="image"&&messageType=="alert"?
            <ImageAlert message={content} resetMessageBox={resetMessageBox}/>
        :type=="image"&&messageType=="confirm"?
            <ImageConfirm message={content} resetMessageBox={resetMessageBox}/>
        :null
        }
        
    </div>
  )
}

export default MessageBox