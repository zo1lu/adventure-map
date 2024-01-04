'use client'
import React,{useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

interface SideNavProps{
    username:string
}
const SideNav = ({username}:SideNavProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    <>
    {isMenuOpen?<div className='h-screen w-[300px] bg-[rgba(255,255,255,0.95)] z-20 absolute top-0 left-0 flex flex-col p-5 justify-start items-start gap-5'>
        <button className='w-8 h-8 absolute top-5 right-5' onClick={()=>setIsMenuOpen(()=>false)}>
          <Image 
            src={'/icons/cross-50.png'}
            width={40}
            height={40}
            alt="close_button"
          />
        </button>
        <div className='text-2xl col-span-1 font-yeseva_one'>ADVENTURE MAP</div>
        <div className='text-roboto text-xl'>Hi! {username}</div>
        <Link className="hover:underline" href="/explore">Explore</Link>
        <Link className="hover:underline" href="/profile">Profile</Link>
        <button className="hover:underline" onClick={()=>logout()}>Logout</button>
      </div>:null}
      <div className='hidden lg:flex flex-col gap-3 px-5 py-5 items-start'>
          <div className='text-2xl col-span-1 font-yeseva_one'>ADVENTURE MAP</div>
          <div className='text-roboto text-xl'>Hi! {username}</div>
          <Link className="hover:underline" href="/explore">Explore</Link>
          <Link className="hover:underline" href="/profile">Profile</Link>
          <button className="hover:underline" onClick={()=>logout()}>Logout</button>
      </div>
      <div className='flex lg:hidden col-span-1 row-span-1 h-[80px] items-center gap-5'>
        
        {!isMenuOpen?
        <div className='flex items-center'>
          <button className='w-10 h-10' onClick={()=>setIsMenuOpen(()=>true)}>
            <Image 
              src={'/icons/menu-50.png'}
              width={25}
              height={25}
              alt="menu_button"
            />
          </button>
          <div className='text-2xl col-span-1 font-yeseva_one w-fit'>ADVENTURE MAP</div>
        </div>
        :null}
        
      </div>
    </>
    
  )
}

export default SideNav