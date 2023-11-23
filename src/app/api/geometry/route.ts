import { createGeometry, deleteGeometryById, updateGeometry } from "@/utils/models/geometryModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

//create geometry
export async function POST(req:NextRequest){
    try{
        const {mapId, geometryInfo} = await req.json()
        const result = await createGeometry(mapId, geometryInfo)
        return result.data?
        res.json(result.data, {status: 200})
        :res.json(result, {status: 400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}
//update geometry
export async function PATCH(req:NextRequest){
    try{
        const geometryInfo  = await req.json()
        const result = await updateGeometry(geometryInfo)
        return result.success?
        res.json(result, {status:200})
        :res.json(result, {status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}
//delete geometry
export async function DELETE(req:NextRequest){
    try{
        const { searchParams } = new URL(req.url);
        const geometryId = searchParams.get("id");
        // const { geometryId } = await req.json()
        const result = await deleteGeometryById(geometryId)
        result.success?
        res.json(result, {status:200})
        :res.json(result, {status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}