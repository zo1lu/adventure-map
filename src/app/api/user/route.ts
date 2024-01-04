import { getLikedMaps, getUserMaps, likedAMap, unLikeAMap } from "@/utils/models/userMapsModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

export async function GET(req:NextRequest){
    try{
        const user = req.nextUrl.searchParams.get('user')
        const type = req.nextUrl.searchParams.get('type')
        if(type=="maps"&&user){
            const result = await getUserMaps(user)
            return result.data?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }else if(type=="liked"&&user){
            const result = await getLikedMaps(user)
            return result.data?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}

export async function PATCH(req:NextRequest){
    try{
        const type = req.nextUrl.searchParams.get('type')
        if(type=="like"){
            const {mapId, userId, like} = await req.json()
            const result = like?await likedAMap(userId, mapId): await unLikeAMap(userId, mapId)
            return result.success?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }    
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}
