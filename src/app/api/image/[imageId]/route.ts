import { deleteMapImageById } from "@/utils/models/image/mapImageModel"
import { deleteSpotImageById } from "@/utils/models/image/spotImageModel"
import { deleteRouteImageById } from "@/utils/models/image/routeImageModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

export async function DELETE(req:NextRequest,{params}:{params:{imageId:string}}){
    try{
        const id = params.imageId
        const type = req.nextUrl.searchParams.get('type')
        let result = type=="map"?await deleteMapImageById(id):
                     type=="spot"?await deleteSpotImageById(id):
                     type=="route"?await deleteRouteImageById(id):
                     {"error":true, "message":"param type not available"}
        
        return result?.success?
        res.json(result,{status:200})
        :res.json(result,{status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}