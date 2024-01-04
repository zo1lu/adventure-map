import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'
import { getPublicMaps, getPublicMapsWithFilter, getPublicMapsWithKeyword } from "@/utils/models/publicMapsModel"
export async function GET(req:NextRequest){
    const page = req.nextUrl.searchParams.get('page') || undefined
    const perPage = req.nextUrl.searchParams.get('perPage') || undefined
    const user = req.nextUrl.searchParams.get('user') || undefined
    const key = req.nextUrl.searchParams.get('key') || undefined
    const country = req.nextUrl.searchParams.get('country') || undefined
    const region = req.nextUrl.searchParams.get('region') || undefined
    const travelType = req.nextUrl.searchParams.get('travel') || undefined
    const memberType = req.nextUrl.searchParams.get('member') || undefined
    const min = req.nextUrl.searchParams.get('min') || undefined
    const max = req.nextUrl.searchParams.get('max') || undefined

    const pageNum = page?parseInt(page):1
    const perPageNum = perPage?parseInt(perPage):8
    const travelTypeList = travelType?travelType.split(","):[]
    const dayMin = min!=undefined? parseInt(min):0
    const dayMax = max!=undefined? parseInt(max):4320

    try{
        if(country||region||travelType||memberType){
            const result = await getPublicMapsWithFilter(pageNum, perPageNum, user, country, region, travelTypeList, memberType, dayMin, dayMax)
            return result.data?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }else if(key){
            const result = await getPublicMapsWithKeyword(pageNum, perPageNum, key, user)
            return result.data?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }else{
            const result = await getPublicMaps(pageNum, perPageNum, user)
            return result.data?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }
    }catch(e){
        return res.json({"error":true, "message":e}, {status:500})
    }
}