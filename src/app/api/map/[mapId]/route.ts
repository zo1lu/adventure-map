import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'
import { getMapInfoById, getMapGeoInfoById, getMapGeoDataById } from "@/utils/models/mapModel"

export async function GET(req:NextRequest, { params }: { params: { mapId: string } }){
    const type = req.nextUrl.searchParams.get('type')
    const mapId = params.mapId
    try{
        if(type=="plain"){
            const result = await getMapInfoById(mapId)
            return result.data?
            res.json(result.data, {status:200})
            :res.json(result, {status:400})
        }else if(type=="geo"){
            const result = await getMapGeoInfoById(mapId)
            return result.data?
            res.json(result.data, {status:200})
            :res.json(result, {status:400})
        }else if(type=="geodatacollections"){
            const result = await getMapGeoDataById(mapId)
            return result.data?
            res.json(result.data, {status:200})
            :res.json(result, {status:400})
        }
        //if need get all info at once?
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}