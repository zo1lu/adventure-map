import { createRoute, deleteRouteById, getRouteById, updateRoute } from "@/utils/models/routeModel"
import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'

//create route
export async function POST(req:NextRequest){
    try{
        const {mapId, routeInfo} = await req.json()
        const result = await createRoute(mapId, routeInfo)
        return result.data?
        res.json(result.data, {status: 200})
        :res.json(result, {status: 400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}
//get route info
// export async function GET(req:NextRequest){
//     try{
//         const { routeId } = await req.json()
//         const result = await getRouteById(routeId)
//         return result.data?
//         res.json(result.data, {status: 200})
//         :res.json(result, {status: 400})
//     }catch(e){
//         console.log(e)
//         return res.json({"error":true, "message":e}, {status:500})
//     }
// }
//update route
export async function PATCH(req:NextRequest){
    try{
        const routeInfo  = await req.json()
        console.log = routeInfo
        const result = await updateRoute(routeInfo)
        return result.success?
        res.json(result, {status:200})
        :res.json(result, {status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}
//delete route
export async function DELETE(req:NextRequest){
    try{
        const { routeId } = await req.json()
        const result = await deleteRouteById(routeId)
        result.success?
        res.json(result, {status:200})
        :res.json(result, {status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}