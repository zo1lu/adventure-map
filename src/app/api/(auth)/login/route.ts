import { NextRequest } from "next/server"

export async function POST(req:NextRequest){
    try{
        const {email, username, password} = await req.json()
    }catch(error){
        console.log(error)
    }
}