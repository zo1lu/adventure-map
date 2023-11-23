import React from 'react'
import Image from 'next/image'
import { deleteSelectedFeature } from '@/utils/map/Interaction'
interface OptionToolBoxProps {
    currentSelected:selectedFeature
    resetCurrentSelectedFeature:()=>void
    changeCurrentItemType:(newItem:currentItemType) => void
}
const OptionToolBox = ({currentSelected, resetCurrentSelectedFeature, changeCurrentItemType}:OptionToolBoxProps) => {
    const currentType = currentSelected.type
    const currentId = currentSelected.id
    let url: string
    // let data: object
    if(currentType=="spot"){
      url=`/api/spot?id=${currentId}`
      // data = {spotId: currentId}
    }else if(currentType=="route"){
      url=`/api/route?id=${currentId}`
      // data = {routeId: currentId}
    }else if(currentType=="linestring"||currentType=="polygon"||currentType=="circle"){
      url=`/api/geometry?id=${currentId}`
      // data = {geometryId: currentId}
    }
    const deleteFeatureHandler = () => {
      fetch(url,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        },
      })
      .then(res=>res.json())
      .then((data)=>{
        console.log(data)
        deleteSelectedFeature(currentId, currentType)
        resetCurrentSelectedFeature()
      })
      .catch((e)=>{
        console.log("error in deleting...",e)
        // alert("deletion fail, please try again!")
      })
      .finally(()=>{
        deleteSelectedFeature(currentId, currentType)
        resetCurrentSelectedFeature()
        changeCurrentItemType("none")
      })
    }
  return (
    <div className="w-[75px] h-[75px]  rounded-md bg-white  p-5">
        <button className="w-10 h-10" onClick={()=>{deleteFeatureHandler()}}>
          <Image src="/icons/remove-48.png" width={35} height={35} alt="deleteBtn"  />
        </button>

    </div>
  )
}

export default OptionToolBox