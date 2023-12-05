import prisma from '@/service/mongodb'
import { mapGeoInfoType, mapInfoType } from '@/data/infoType'
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getGetParams, getDeleteParams } from './image/shareModel'
import {s3} from '@/service/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { firstMapData, publicMapData } from '@/data/user'
import { randomIndex } from '../calculation'
import { createMapImageById } from './image/mapImageModel'
import { getImageBlob } from '../image'
//create map
const createMap = async(userId:string) => {
    try{
        const newlyCreatedMapId = await prisma.map.create({
            data:{
                authorId: userId,
            },
            select:{
                id: true,
            }
        })
        return {"data": newlyCreatedMapId}
    }catch(e){
        console.log("creating map > ",e)
        return {"error":true, "message":"Something wrong when creating map"}
    }
}
const createFirstMap = async(userId:string, username:string) => {
    try{
        const index = randomIndex(1,16)
        const data = firstMapData[index]
        const firstMapId = await prisma.map.create({
            data:{
                authorId: userId,
                title:`${username} 's first travel map`,
                country:data.country,
                regionOrDistrict:data.city,
                center:[data.longitude,data.latitude]
            },
            select:{
                id: true,
            }
        })
        return {"data": firstMapId}
    }catch(e){
        console.log("creating map > ",e)
        return {"error":true, "message":"Something wrong when creating map"}
    }
}
const createPublicMap = async(userId:string) => {
    try{
        const index = randomIndex(1,30)
        const travelRandomIndex = randomIndex(1,15) 
        const travelRandomType = travelRandomIndex<10?`0${travelRandomIndex}`:travelRandomIndex
        const memberRandomType = randomIndex(1,5)
        const data = publicMapData[index]
        const publicMap = await prisma.map.create({
            data:{
                authorId: userId,
                title: data.title,
                country: data.country,
                regionOrDistrict: data.city,
                travelTypeId:`TT${travelRandomType}`,
                memberTypeId:`MT0${memberRandomType}`,
                center:[data.longitude,data.latitude],
                startTime:data.startTime,
                startTimeZone:data.startTimeZone,
                endTime:data.endTime,
                endTimeZone:data.endTimeZone,
                description:data.description,
                duration:data.duration,
                isPublic:true,
            },
            select:{
                id: true,
            }
        })
        const imgSrc = `/images/publicMapImages/${data.image}.jpg`
        const imageBlob = await getImageBlob(imgSrc)
        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer())
        await createMapImageById(publicMap.id, imageBuffer)
        return {"data": publicMap}
    }catch(e){
        console.log("creating map > ",e)
        return {"error":true, "message":"Something wrong when creating map"}
    }
}
// //get map info with ID
// const getMapById = async(mapId:string) => {
//     try{
//         const mapInfo = await prisma.map.findUnique({
//             where:{
//                 id: mapId,
//             },
//             select:{
//                 id: true,
//                 title: true,
//                 country: true,
//                 regionOrDistrict: true,
//                 startTime: true,
//                 startTimeZone: true,
//                 endTime: true,
//                 endTimeZone: true,
//                 duration: true,
//                 description: true,
//                 travelTypeId: true,
//                 memberTypeId: true,
//                 zoom:true,
//                 center:true,
//                 isPublic:true,
//                 geoData: true,
//             },
//             include:{
//                 mapImage:true
//             }
//         })
//         return {"data": mapInfo}
//     }catch(e){
//         console.log("gettting map > ",e)
//         return {"error":true, "message":"Something wrong when getting map"}
//     }
// }

// //updata map info with ID
// const updateMapById = async (mapId:string, mapInfo:mapInfoType) => {
//     try{
//         await prisma.map.update({
//             where:{ id: mapId },
//             data:{
//                 title: mapInfo.title,
//                 country: mapInfo.country,
//                 regionOrDistrict: mapInfo.region_or_district,
//                 startTime: mapInfo.start_time,
//                 startTimeZone: mapInfo.start_time_zone,
//                 endTime: mapInfo.end_time,
//                 endTimeZone: mapInfo.end_time_zone,
//                 duration: mapInfo.duration,
//                 description: mapInfo.description,
//                 travelTypeId: mapInfo.travel_type_id  || null,
//                 memberTypeId: mapInfo.member_type_id  || null,
//                 zoom:mapInfo.zoom,
//                 center:mapInfo.center,
//                 isPublic:mapInfo.public,
//                 geoData: mapInfo.geoData,
//             }
//         })
//         return {"success":true, "message":"Successfully updata map information"}
//     }catch(e){
//         console.log("updating map > ", e)
//         return {"error":true, "message":"Something wrong when updating map"}
//     }
// }

//get map geoinfo with ID

const getMapGeoInfoById = async(mapId:string) => {
    try{
        const mapGeoInfo = await prisma.map.findUnique({
            where:{
                id: mapId,
            },
            select:{
                zoom:true,
                center:true,
                geoData: true,
                isPublic: true
            },
        })
        return {"data": mapGeoInfo}
    }catch(e){
        console.log("gettting map geo > ",e)
        return {"error":true, "message":"Something wrong when getting map geo"}
    }
}

const getMapGeoDataById = async(mapId:string) => {
    try{
        const mapGeoDataCollections = await prisma.map.findUnique({
            where:{
                id: mapId,
            },
            select:{
                zoom:true,
                center:true,
                isPublic: true,
                spots:{
                    select:{
                        geoData:true
                    }
                },
                routes:{
                    select:{
                        geoData:true
                    }
                },
                geometrys:{
                    select:{
                        geoData:true
                    }
                },
            },
        })
        return {"data": mapGeoDataCollections}
    }catch(e){
        console.log("gettting map geo > ",e)
        return {"error":true, "message":"Something wrong when getting map geo"}
    }
}

//updata map geoinfo with ID
const updateMapGeoInfoById = async (mapId:string, mapGeoInfo:mapGeoInfoType) => {
    try{
        const {zoom, center, geo_data} = mapGeoInfo
        await prisma.map.update({
            where:{ 
                id: mapId 
            },
            data:{
                zoom: zoom,
                center: center,
                geoData:  geo_data != null ? geo_data : undefined,
            }
        })
        return {"success":true, "message":"Successfully update map geo information"}
    }catch(e){
        console.log("updating map > ", e)
        return {"error":true, "message":"Something wrong when updating map geo"}
    }
}

//get map info with ID
const getMapInfoById = async(mapId:string) => {
    try{
        const mapInfo = await prisma.map.findUnique({
            where:{
                id: mapId,
            },
            select:{
                title: true,
                country: true,
                regionOrDistrict: true,
                startTime: true,
                startTimeZone: true,
                endTime: true,
                endTimeZone: true,
                duration: true,
                description: true,
                travelTypeId: true,
                memberTypeId: true,
                isPublic:true,
                mapImage:{
                    select: {
                        id: true,
                    }
                }
            },
        })
        if(mapInfo!=null && mapInfo.mapImage!=null){
            const name = mapInfo.mapImage.id
            const params = getGetParams("map", name)
            const command = new GetObjectCommand(params)
            const presignedUrl = await getSignedUrl(s3, command, {expiresIn:600})
            const newMapInfo = {...mapInfo, mapImage:{
                ...mapInfo.mapImage,
                url:presignedUrl
            }}
            return {"data": newMapInfo}
        }else{
            return {"data": mapInfo}
        }
    }catch(e){
        console.log("gettting map > ",e)
        return {"error":true, "message":"Something wrong when getting map"}
    }
}

//updata map info with ID
const updateMapInfoById = async (mapId:string, mapInfo:mapInfoType) => {
    try{
        const {title, country, region_or_district, start_time, start_time_zone, end_time,end_time_zone, duration, description, travel_type_id, member_type_id, is_public} = mapInfo
        await prisma.map.update({
            where:{ 
                id: mapId 
            },
            data:{
                title: title != null ? title : undefined,
                country: country != null ? country : undefined,
                regionOrDistrict: region_or_district != null ? region_or_district : undefined,
                startTime: start_time != null ? start_time : undefined,
                startTimeZone: start_time_zone != null ? start_time_zone : undefined,
                endTime: end_time != null ? end_time : undefined,
                endTimeZone: end_time_zone != null ? end_time_zone : undefined,
                duration: duration != null ? duration : undefined,
                description: description != null ? description : undefined,
                travelTypeId: travel_type_id != null ? travel_type_id : undefined,
                memberTypeId: member_type_id != null ? member_type_id : undefined,
                isPublic: is_public,
            }
        })
        return {"success":true, "message":"Successfully update map information"}
    }catch(e){
        console.log("updating map > ", e)
        return {"error":true, "message":"Something wrong when updating map"}
    }
}

//delete map with ID
const deleteMapById = async (mapId:string) => {
    try{
        const image = await prisma.mapImage.findUnique({
            where:{
                mapId:mapId
            },
            select:{
                id:true
            }
        })
        if(image){
            const imageId = image.id
            const params = getDeleteParams("map",imageId)
            const command = new DeleteObjectCommand(params)
            await s3.send(command)
            await prisma.mapImage.delete({
                where:{
                    id:imageId
                }
            })
        }
        await prisma.map.delete({
            where:{
                id: mapId,
            }
        })
        return {"success":true, "message":"Successfully delete map"}
    }catch(e){
        console.log("deleting map > ", e)
        return {"error":true, "message":"Something wrong when deleting map"}
    }
}

export{createMap, createFirstMap, createPublicMap, getMapGeoInfoById, updateMapGeoInfoById, getMapInfoById, getMapGeoDataById, updateMapInfoById, deleteMapById}