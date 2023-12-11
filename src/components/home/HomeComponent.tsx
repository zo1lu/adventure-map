'use client'
import React,{useState} from 'react'
import SideNav from '@/components/home/SideNav'
import CreateMapButton from '@/components/home/CreateMapButton'
import ListFolder from '@/components/home/ListFolder'

interface HomeProps{
    userName:string,
    userId:string,
}
const HomeComponent = ({userName, userId}:HomeProps) => {
  return (
    <div className='w-screen h-screen '>
        <div className='w-screen h-screen sm:hidden flex bg-main-70 justify-center items-center'>
            <p className='text-white m-auto'>View in landscape mode</p>
        </div>
        <div className='max-w-[1920px] w-full h-screen hidden sm:grid grid-cols-5 relative m-auto'>
            <SideNav username={userName}/>
            <ListFolder userId={userId}/>
            <CreateMapButton userId={userId}/>
        </div>
    </div>
  )
}

export default HomeComponent