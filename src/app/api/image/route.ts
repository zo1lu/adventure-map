import { createMapImageById, updateMapImageById } from "@/utils/models/image/mapImageModel"
import { createSpotImageById, updateSpotImageById } from "@/utils/models/image/spotImageModel"
import { createRouteImageById, updateRouteImageById } from "@/utils/models/image/routeImageModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

export async function POST(req:NextRequest){
    try{
        const formData = await req.formData()
        const id = formData.get("id") as string
        const type = formData.get("type") as string
        const image = formData.get("image") as Blob
        const uploadImage = Buffer.from(await image.arrayBuffer())
        let result = type=="map"?await createMapImageById(id, uploadImage):
                     type=="spot"?await createSpotImageById(id, uploadImage):
                     type=="route"?await createRouteImageById(id, uploadImage):
                     {"error":true, "message":"param type not available"}
        return result?.data?
        res.json(result, {status: 200})
        :res.json(result, {status: 400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}

export async function PUT(req:NextRequest){
    try{
        const formData = await req.formData()
        const id = formData.get("id") as string
        const type = formData.get("type") as string
        const image = formData.get("image") as Blob
        const uploadImage = Buffer.from(await image.arrayBuffer())
        let result = type=="map"?await updateMapImageById(id, uploadImage):
                     type=="spot"?await updateSpotImageById(id, uploadImage):
                     type=="route"?await updateRouteImageById(id, uploadImage):
                     {"error":true, "message":"param type not available"}
        return result?.data?
        res.json(result, {status: 200})
        :res.json(result, {status: 400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}

