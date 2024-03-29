import React, { useEffect, useState } from 'react'

interface GeometryInfoProps {
  id: string,
  type: currentItemType,
}

const GeometryInfo = ({id, type }:GeometryInfoProps) => {
  const [message, setMessage] = useState({type:"normal",content:""})
  const [geometryInfo, setGeometryInfo] = useState({
      id:"",
      title:"",
      geometry_type_id:"",
      color:"#ffcc33",
      stroke:5,
      description:"",
  })

  useEffect(()=>{
    fetch(`/api/geometry/${id}`)
        .then((res)=>{
          return res.json()
        })
        .then((data)=>{
          const newInfo = data
          setGeometryInfo((current)=>{
            return {
              ...current,
              title: newInfo.title || "",
              geometry_type_id: newInfo.geometryTypeId,
              color: newInfo.color,
              stroke: newInfo.stroke,
              description: newInfo.description || "",
            }
          })
        })
        .catch((e)=>{
          console.log(e)
          setMessage(()=>{return {type:"error",content:"no data"}})
        })
        .finally(()=>{
          setMessage(()=>{return {type:"normal",content:""}})
        })
  },[id, type])

  return (
    <div className="w-[220px] h-fit absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
        <p className='w-20 text-xs'>{type} info</p>
        <div className='w-[calc(100%-80px)] flex justify-end items-center'>
          {message.content!=""?<div className='w-full h-10 flex justify-center text-xs' style={message.type=="success"?{color:'green'}:message.type=="error"?{color:'red'}:{color:'black'}}>{message.content}</div>:<></>}
        </div>
        <hr className='border-1 mb-2'/>
        <input value={geometryInfo.title} className="h-12 py-3 outline-none focus:border-b-[1px] focus:border-black text-xl font-bold uppercase" placeholder='Title' readOnly/>

        <div className='w-[calc(100%-20px)] flex h-10 items-center'>
          <div className='rounded-full w-4 h-4 mr-3' style={{backgroundColor:geometryInfo.color}}></div>
          <label className='text-xs leading-10 w-fit'>Stroke-{geometryInfo.stroke}</label>
        </div>
        <textarea value={geometryInfo.description} className="py-3 outline-none min-h-[120px] text-xs" placeholder="description" readOnly></textarea>
    </div>
  )
}

export default GeometryInfo