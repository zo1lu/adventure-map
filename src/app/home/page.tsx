import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import HomeComponent from '@/components/home/HomeComponent'
import { redirect } from 'next/navigation'
import { getLikedMaps, getUserMaps } from '@/utils/models/userMapsModel'
const HomePage = async() => {
    const session = await getServerSession(authOptions)
    if(!session.user){
      redirect("/login")
    }
    const userId = session?session.user.id:null;
    const userName = session?session.user.name:null;
    // const mapsDataResult = await getUserMaps(userId)
    // const mapsResult = mapsDataResult.data?mapsDataResult.data:[]
    // const likesDataResult = await getLikedMaps(userId)
    // const likesData = likesDataResult.data?likesDataResult.data:[]
    // const mapsData= mapsResult.map((data)=>{
    //   return {...data, createdAt: data.createdAt.toLocaleString(), updatedAt:data.updatedAt.toLocaleString()}
    // })
    
    if(userId&&userName){
      return (
        <>
          <HomeComponent userName={userName} userId={userId}/>
        </>
      )
    }
  }


export default HomePage