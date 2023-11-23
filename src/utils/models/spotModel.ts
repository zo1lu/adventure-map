import prisma from '@/service/mongodb'
import { spotInfoType } from '@/data/infoType'
//create spot
const createSpot = async(mapId:string, spotInfo:spotInfoType) => {
    try{
        const {id, title, location, spot_type_id, start_time, start_time_zone, end_time, end_time_zone, duration, description, geo_data} = spotInfo
        const newlyCreatedSpot = await prisma.spot.create({
            data:{
                id: id,
                title: title != null ? title : undefined,
                location: location,
                spotTypeId: spot_type_id != null ? spot_type_id : undefined,
                startTime: start_time,
                startTimeZone: start_time_zone,
                endTime: end_time,
                endTimeZone: end_time_zone,
                duration: duration,
                description: description != null ? description : undefined,
                geoData: geo_data,
                mapId: mapId,
            },
            select:{
                id: true,
                title: true,
                location: true,
                spotTypeId: true,
                startTime: true,
                startTimeZone: true,
                endTime: true,
                endTimeZone: true,
                duration: true,
                description: true,
                geoData: true,
                spotImage:{
                    select:{
                        id:true,
                        url:true,
                    }
                }
            }
        })
        return {"data": newlyCreatedSpot}
    }catch(e){
        console.log("creating spot > ",e)
        return {"error":true, "message":"Something wrong when creating spot"}
    }
}
//get spot info by id
const getSpotById = async (spotId:string) => {
    try{
        const spotInfo = await prisma.spot.findUnique({
            where:{
                id: spotId,
            },
            select:{
                id: true,
                title: true,
                location: true,
                spotTypeId: true,
                startTime: true,
                startTimeZone: true,
                endTime: true,
                endTimeZone: true,
                duration: true,
                description: true,
                geoData: true,
                spotImage:{
                    select:{
                        id:true,
                        url:true,
                    }
                }
            }
        })
        return {"data": spotInfo}
    }catch(e){
        console.log("gettting spot > ",e)
        return {"error":true, "message":"Something wrong when getting spot"}
    }
}
//update spot info by id
const updateSpot = async (spotInfo: spotInfoType) => {
    try{
        const {id, title, location, spot_type_id, start_time, start_time_zone, end_time, end_time_zone, duration, description, geo_data} = spotInfo
        await prisma.spot.update({
            where:{
                id:id,
            },
            data:{
                title: title != null ? title : undefined,
                location: location,
                spotTypeId: spot_type_id != null ? spot_type_id : undefined,
                startTime: start_time,
                startTimeZone: start_time_zone,
                endTime: end_time,
                endTimeZone: end_time_zone,
                duration: duration,
                description: description != null ? description : undefined,
                geoData: geo_data,
            }
        })
        return {"success":true, "message":"Successfully update spot information"}
    }catch(e){
        console.log("updating spot > ", e)
        return {"error":true, "message":"Something wrong when updating spot"}
    }
}
//delete spot info by id
const deleteSpotById = async(spotId:string) => {
    try{
        await prisma.spot.delete({
            where:{
                id: spotId
            }
        })
        return {"success":true, "message":"Successfully delete spot"}
    }catch(e){
        console.log("deleting spot > ", e)
        return {"error":true, "message":"Something wrong when deleting spot"}
    }
}

//create spot image
const createSpotImageById = async(spotId:string, imageUrl:string) => {
    try{
        await prisma.spotImage.create({
            data:{
                url:imageUrl,
                spotId: spotId,
            }
        })
    }catch(e){
        console.log("creating spot image > ",e)
        return {"error":true, "message":"Something wrong when creating spot image"}
    }
}
//get spot image
const getSpotImageById = async(imageId: string) => {
    try{
        const spotImage = await prisma.spotImage.findUnique({
            where:{
                id:imageId
            },
            select:{
                id: true,
                url: true,
            }
        })
        return {"data": spotImage}
    }catch(e){
        console.log("getting spot image > ",e)
        return {"error":true, "message":"Something wrong when getting spot image"}
    }

}

//update spot image
const updateSpotImageById = async(imageId:string, newImageUrl:string) => {
    try{
        const newSpotImageUrl = await prisma.spotImage.update({
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
        return {"data":newSpotImageUrl,"success":true, "message":"Successfully update route information"}
    }catch(e){
        console.log("updating spot image > ",e)
        return {"error":true, "message":"Something wrong when updating spot image"}
    }
}

//delete spot image
const deleteSpotImageById = async(imageId:string) => {
    try{
        await prisma.spotImage.delete({
            where:{
                id: imageId
            }
        })
    }catch(e){
        console.log("deleting spot image > ",e)
        return {"error":true, "message":"Something wrong when deleting spot image"}
    }
}

export {createSpot, getSpotById, updateSpot, deleteSpotById, createSpotImageById, getSpotImageById, updateSpotImageById, deleteSpotImageById}