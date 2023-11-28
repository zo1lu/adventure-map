import { createSpot, deleteSpotById, updateSpot } from "@/utils/models/spotModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

//create spot
export async function POST(req:NextRequest){
    try{
        const {mapId, spotInfo} = await req.json()
        const result = await createSpot(mapId, spotInfo)
        return result.data?
        res.json(result.data, {status:200})
        :res.json(result, {status: 400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}
//update spot
export async function PATCH(req:NextRequest){
    try{
        const spotInfo  = await req.json()
        const result = await updateSpot(spotInfo)
        return result.success?
        res.json(result, {status:200})
        :res.json(result, {status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}

export async function DELETE(req:NextRequest){
    try{
        const { searchParams } = new URL(req.url);
        const spotId = searchParams.get("id");
        //const { spotId } = await req.json()
        const result = spotId?await deleteSpotById(spotId):{"error":true, "message":"spot is not exist"}
        return result.success?
        res.json(result, {status:200})
        :res.json(result, {status:400})
    }catch(e){
        // console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}
