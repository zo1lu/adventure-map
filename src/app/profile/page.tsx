import React from 'react'
import Image from 'next/image'
const ProfilePage = () => {
    const userData = {
        email:"zoey1111@gmail.com",
        username:"zzzoe",
        image:"",
        about:"",
    }
  return (
    <div className='w-full h-full'>
        <div className='w-[320px] h-[800px] m-auto py-40 flex flex-col gap-3'>
            <div className='flex items-end gap-3'>
                <div className='w-[100px] h-[100px] rounded-full border-red-500 flex border-2'>
                    <Image 
                        src={'/avatars/woman-01.png'}
                        width={150}
                        height={150}
                        alt={'avatar'}
                    />
                </div>
                <label className='h-fit w-fit text-xs py-2 px-3 border-2 border-emerald-950 rounded-md'>
                    {/* <input className="hidden" type='file'/> */}
                    Change Avatar
                </label>
            </div>
            
            <p>Account:{userData.email}</p>
            <p>UserName:{userData.username}</p>
            <p>About:</p>
            <textarea className="w-[320px] h-[200px] border-solid border-black border-2 rounded-md p-3" placeholder='Something about yourself...'></textarea>
        </div>
        
    </div>
  )
}

export default ProfilePage