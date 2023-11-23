import prisma from '@/service/mongodb'
import { mapGeoInfoType, mapInfoType } from '@/data/infoType'
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
//                 public:true,
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
//                 public:mapInfo.public,
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
                public:true,
                mapImage:{
                    select: {
                        id: true,
                        url: true
                    }
                }
                
            },
            
        })
        return {"data": mapInfo}
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
                public: is_public,
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

//create map image
const createMapImageById = async(mapId:string, imageUrl:string) => {
    try{
        const newlyCreatedMapImage = await prisma.mapImage.create({
            data:{
                url: imageUrl,
                mapId: mapId,
            },
            select:{
                id: true,
                url: true,
            }
        })
        return {"data": newlyCreatedMapImage}
    }catch(e){
        console.log("creating map image > ",e)
        return {"error":true, "message":"Something wrong when creating map image"}
    }
}

const getMapImageById = async(imageId:string) => {
    try{
        const mapImage = await prisma.mapImage.findUnique({
            where:{
                id: imageId
            },
            select:{
                id: true,
                url: true,
            }
        })
        return {"data": mapImage}
    }catch(e){
        console.log("getting map image > ",e)
        return {"error":true, "message":"Something wrong when getting map image"}
    }
}

//update map image
const updateMapImageById = async(imageId:string, newImageUrl:string) => {
    try{
        const newMapImageUrl = await prisma.mapImage.update({
            where:{
                id: imageId
            },
            data:{
                url: newImageUrl
            },
            select:{
                url: true
            }
        })
        return {"data":newMapImageUrl,"success":true, "message":"Successfully update map information"}
    }catch(e){
        console.log("updating map image > ",e)
        return {"error":true, "message":"Something wrong when updating map image"}
    }
}

//deleting map image
const deleteMapImageById = async(imageId:string) => {
    try{
        await prisma.mapImage.delete({
            where:{
                id: imageId
            }
        })
    }catch(e){
        console.log("deleting map image > ",e)
        return {"error":true, "message":"Something wrong when deleting map image"}
    }
}

export{createMap, getMapGeoInfoById, updateMapGeoInfoById, getMapInfoById, getMapGeoDataById, updateMapInfoById, deleteMapById, createMapImageById, getMapImageById, updateMapImageById, deleteMapImageById}