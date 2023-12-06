import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import SideNav from '@/components/home/SideNav'
import CreateMapButton from '@/components/home/CreateMapButton'
import ListFolder from '@/components/home/ListFolder'
import { redirect } from 'next/navigation'
import { getLikedMaps, getUserMaps } from '@/utils/models/userMapsModel'

const HomePage = async() => {
    const session = await getServerSession(authOptions)
    if(!session.user){
      redirect("/login")
    }
    const userId = session.user.id;
    const userName = session.user.name;
    // const mapsDataResult = await getUserMaps(userId)
    // const mapsResult = mapsDataResult.data?mapsDataResult.data:[]
    // const likesDataResult = await getLikedMaps(userId)
    // const likesData = likesDataResult.data?likesDataResult.data:[]
    // const mapsData= mapsResult.map((data)=>{
    //   return {...data, createdAt: data.createdAt.toLocaleString(), updatedAt:data.updatedAt.toLocaleString()}
    // })
    // const [message, setMessage] = useState({
    //   type:"",
    //   content:""
    // })
    return (
      <div className='w-screen h-screen grid grid-cols-5'>
        <SideNav username={userName}/>
        <ListFolder userId={userId}/>
        <CreateMapButton userId={userId}/>
      </div>
    )
  }


export default HomePage