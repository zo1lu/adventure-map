import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import HomeComponent from '@/components/home/HomeComponent'
import { redirect } from 'next/navigation'
const HomePage = async() => {
    const session = await getServerSession(authOptions)
    if(!session.user){
      redirect("/login")
    }
    const userId = session?session.user.id:null;
    const userName = session?session.user.name:null;    
    if(userId&&userName){
      return (
        <>
          <HomeComponent userName={userName} userId={userId}/>
        </>
      )
    }
  }
export default HomePage