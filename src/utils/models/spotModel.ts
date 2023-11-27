import prisma from '@/service/mongodb'
import { spotInfoType } from '@/data/infoType'
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getGetParams, getDeleteParams } from './image/shareModel'
import {s3} from '@/service/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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
                    }
                }
            }
        })
        if(spotInfo!=null && spotInfo.spotImage!=null){
            const name = spotInfo.spotImage.id
            const params = getGetParams("spot", name)
            const command = new GetObjectCommand(params)
            const presignedUrl = await getSignedUrl(s3, command, {expiresIn:600})
            const newSpotInfo = {...spotInfo, spotImage:{
                ...spotInfo.spotImage,
                url:presignedUrl
            }}
            return {"data": newSpotInfo}
        }
        else{
            return {"data": spotInfo}
        }
        
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
        const image = await prisma.spotImage.findUnique({
            where:{
                spotId: spotId
            },
            select:{
                id:true
            }
        })
        if(!image){
            return {"error":true, "message":"Image not found"}
        }
        const imageId = image.id
        const params = getDeleteParams("spot",imageId)
        const command = new DeleteObjectCommand(params)
        await s3.send(command)
        await prisma.spotImage.delete({
            where:{
                id:imageId
            }
        })
        await prisma.spot.delete({
            where:{
                id: spotId,
            }
        })
        return {"success":true, "message":"Successfully delete spot"}
    }catch(e){
        console.log("deleting spot > ", e)
        return {"error":true, "message":"Something wrong when deleting spot"}
    }
}




export {createSpot, getSpotById, updateSpot, deleteSpotById}