'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

interface SideNavProps{
    username:string
}
const SideNav = ({username}:SideNavProps) => {
    const router = useRouter()  
    const logout = async() => {
        try{
          await signOut({redirect:false})
          router.replace("/")
        }catch(e){
          console.log(e)
        }
      }

  return (
    <div className='flex flex-col gap-3 px-5 py-5 items-start'>
        <div className='text-2xl col-span-1 font-yeseva_one'>ADVENTURE MAP</div>
        <div className='text-roboto text-xl'>Hi! {username}</div>
        <Link className="hover:underline" href="/explore">Explore</Link>
        <Link className="hover:underline" href="/profile">Profile</Link>
        <button className="hover:underline" onClick={()=>logout()}>Logout</button>
      </div>
  )
}

export default SideNav