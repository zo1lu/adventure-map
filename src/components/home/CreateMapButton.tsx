'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
interface CreateMapButtonProps{
    userId:string
}
const CreateMapButton = ({userId}:CreateMapButtonProps) => {
    const router = useRouter()
    const createNewMap = async(userId:string) => {
        //create map in database and redirect to map page
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
      }
  return (
    <button className='col-span-1 absolute right-10 top-5 p-3 w-fit h-fit text-xs bg-emerald-950 text-white rounded-md'
      onClick={()=>createNewMap(userId)}>Create New</button>
  )
}

export default CreateMapButton