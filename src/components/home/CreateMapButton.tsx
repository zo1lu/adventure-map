'use client'
import React,{useState} from 'react'
import { useRouter } from 'next/navigation'
import ProcessBox from '../message/ProcessBox'
interface CreateMapButtonProps{
    userId:string
}
const CreateMapButton = ({userId}:CreateMapButtonProps) => {
    const router = useRouter()
    const [message, setMessage] = useState({
      type:"",
      content:""
    })
    const createNewMap = async(userId:string) => {
        //create map in database and redirect to map page
        setMessage(()=>{
          return {
            type:"createMapProcess",
            content:"creating new map"
          }
        })
        fetch('/api/map',{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            "authorId": userId
          })
        })
        .then(res=>res.json())
        .then(data=>{
          router.push(`/map/${data.id}`)
        })
        .finally(()=>{
          setMessage(()=>{
            return {
              type:"",
              content:""
            }
          })
        })
      }
      //message.type=="createMapProcess"?
  return (
    <>
    {message.type=="createMapProcess"?<ProcessBox title={"Creating New Map..."} message={message.content} />:null}
    <button className='col-span-1 absolute right-10 top-5 p-3 w-fit h-fit text-xs bg-emerald-950 text-white rounded-md'
      onClick={()=>createNewMap(userId)}>Create New</button>
    </>
  )
}

export default CreateMapButton