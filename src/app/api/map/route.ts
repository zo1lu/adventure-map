import { NextRequest } from "next/server"
import { NextResponse as res } from 'next/server'
import { createMap, deleteMapById, getMapGeoInfoById, getMapInfoById ,updateMapGeoInfoById, updateMapInfoById } from "@/utils/models/mapModel"
//create map
export async function POST(req:NextRequest){
    try{
        const { authorId } = await req.json()
        const result = await createMap(authorId)
        const orignUrl = req.url.split("api")[0]
        // res.json({url: new URL(`/map/${result.data.id}`, orignUrl)})
        // res.redirect(new URL(`/map/${result.data.id}`, orignUrl), {status: 300})
        return result.data? 
        res.json(result.data, {status: 200})
        :res.json(result, {status: 400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}
//get map info depends on type> all||geo||plain
// export async function GET(req:NextRequest){
//     const type = req.nextUrl.searchParams.get('type')
//     try{
//         const { mapId } = await req.json()
//         if(type=="plain"){
//             const result = await getMapInfoById(mapId)
//             return result.data?
//             res.json(result.data, {status:200})
//             :res.json(result, {status:400})
//         }else if(type=="geo"){
//             const result = await getMapGeoInfoById(mapId)
//             return result.data?
//             res.json(result.data, {status:200})
//             :res.json(result, {status:400})
//         }
//         //if need get all info at once?
//     }catch(e){
//         console.log(e)
//         return res.json({"error":true, "message":e}, {status:500})
//     }
// }
//update partially the current map
export async function PATCH(req:NextRequest){
    const type = req.nextUrl.searchParams.get('type')
    try{
        const { mapId, mapData } = await req.json()
        if(type=="plain"){
            const result = await updateMapInfoById(mapId, mapData)
            return result.success?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }else if(type=="geo"){
            const result = await updateMapGeoInfoById(mapId, mapData)
            return result.success?
            res.json(result, {status:200})
            :res.json(result, {status:400})
        }
        //if need get all info at once?
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}

//delete current map
export async function DELETE(req:NextRequest){
    try{
        const { mapId } = await req.json()
        const result = await deleteMapById(mapId)
        const orignUrl = req.url.split("api")[0]
        return result.success? 
        res.redirect(new URL(`/home`, orignUrl), {status: 300})
        :res.json(result, {status:400})
    }catch(e){
        console.log(e)
        return res.json({"error":true, "message":e}, {status:500})
    }
}