import { getRouteById } from "@/utils/models/routeModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

//get route info by routeId
export async function GET(req:NextRequest, { params }: { params: { routeId: string }}){
    try{
        const routeId = params.routeId
        const result = await getRouteById(routeId)
        return result.data?
        res.json(result.data, {status: 200})
        :res.json(result, {status: 400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}