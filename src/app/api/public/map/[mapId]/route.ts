import { getPublicMapGeoData } from "@/utils/models/publicMapModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

export async function GET(req:NextRequest, { params }: { params: { mapId: string } }){
    const userId = req.nextUrl.searchParams.get('user')
    const mapId = params.mapId
    try{
        const result = userId?await getPublicMapGeoData(mapId, userId):await getPublicMapGeoData(mapId)
        return result.data?
        res.json(result.data, {status:200})
        :res.json(result, {status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}