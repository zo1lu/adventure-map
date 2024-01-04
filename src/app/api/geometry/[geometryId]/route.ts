import { getGeometryById } from "@/utils/models/geometryModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

//get route info by routeId
export async function GET(req:NextRequest, { params }: { params: { geometryId: string }}){
    const test = req.nextUrl.searchParams.get('test')
    try{
        const geometryId = params.geometryId
        const result = await getGeometryById(geometryId)
        return result.data?
        res.json(result.data, {status: 200})
        :res.json(result, {status: 400})

    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}