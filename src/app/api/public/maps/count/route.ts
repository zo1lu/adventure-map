import { getPublicMapsCount, getPublicMapsCountWithFilter, getPublicMapsCountWithKeyword } from "@/utils/models/publicMapsModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

export async function GET(req:NextRequest){
    const key = req.nextUrl.searchParams.get('key') || undefined
    const country = req.nextUrl.searchParams.get('country') || undefined
    const region = req.nextUrl.searchParams.get('region') || undefined
    const travelType = req.nextUrl.searchParams.get('travel') || undefined
    const memberType = req.nextUrl.searchParams.get('member') || undefined
    const min = req.nextUrl.searchParams.get('min') || undefined
    const max = req.nextUrl.searchParams.get('max') || undefined

    const travelTypeList = travelType?travelType.split(","):[]
    const dayMin = min!=undefined? parseInt(min):0
    const dayMax = max!=undefined? parseInt(max):4320
    try{
        if(country||region||travelType||memberType){
            const result = await getPublicMapsCountWithFilter(country, region, travelTypeList, memberType, dayMin, dayMax)
            return result.data?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }else if(key){
            const result = await getPublicMapsCountWithKeyword(key)
            return result.data?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }else{
            const result = await getPublicMapsCount()
            return result.data?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }
    }catch(e){
        return res.json({"error":true, "message":e}, {status:500})
    }
}