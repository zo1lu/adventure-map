import { getSpotById, deleteSpotById } from "@/utils/models/spotModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

//get spot info by routeId
export async function GET(req:NextRequest, { params }: { params: { spotId: string }}){
    const test = req.nextUrl.searchParams.get('test')
    try{
        const spotId = params.spotId
        const result = await getSpotById(spotId)
        return result.data?
        res.json(result.data, {status: 200})
        :res.json(result, {status: 400})

    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}

export async function DELETE(req:NextRequest, { params }: { params: { spotId: string }}){
    // const test = req.nextUrl.searchParams.get('test')
    try{
        const spotId = params.spotId
        const result = await deleteSpotById(spotId)
        result.success?
        res.json(result, {status:200})
        :res.json(result, {status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}