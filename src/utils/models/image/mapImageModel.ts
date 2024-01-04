import prisma from '@/service/mongodb'
import { getDeleteParams, getGetParams, getPutParams, randomImageName } from './shareModel'
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import {s3} from '@/service/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
//create map image
const createMapImageById = async(mapId:string, imageData:Buffer) => {
    try{
        const name = randomImageName()
        const params = getPutParams("map", name, imageData)
        const command = new PutObjectCommand(params)
        await s3.send(command)
        const getParams = getGetParams("map",name)
        const getCommand = new GetObjectCommand(getParams)
        const presignedUrl = await getSignedUrl(s3, getCommand, {expiresIn:3600})
        const newImageInfo = await prisma.mapImage.create({
            data:{
                id: name,
                mapId: mapId,
            }
        })
        const newImageData = {
            id: newImageInfo.id,
            url: presignedUrl
        }
        return {"data": newImageData, "success":true, "message":"Successfully create map image"}
    }catch(e){
        console.log("creating map image > ",e)
        return {"error":true, "message":"Something wrong when creating map image"}
    }
}

//update map image
const updateMapImageById = async(imageId:string, imageData:Buffer) => {
    try{
        const params = getPutParams("map", imageId, imageData)
        const command = new PutObjectCommand(params)
        await s3.send(command)
        const getParams = getGetParams("map", imageId)
        const getCommend = new GetObjectCommand(getParams)
        const presignedUrl = await getSignedUrl(s3, getCommend, {expiresIn:3600})
        const newImageData = {
            id:imageId,
            url:presignedUrl
        }
        return {"data":newImageData, "success":true, "message":"Successfully update map image"}
    }catch(e){
        console.log("updating map image > ",e)
        return {"error":true, "message":"Something wrong when updating map image"}
    }
}

//deleting map image
const deleteMapImageById = async(imageId:string) => {
    try{
        const image = await prisma.mapImage.findUnique({
            where:{
                id:imageId
            }
        })
        if(!image){
            return {"error":true, "message":"Image not found"}
        }
        const params = getDeleteParams("map",imageId)
        const command = new DeleteObjectCommand(params)
        await s3.send(command)
        await prisma.mapImage.delete({
            where:{
                id: imageId
            }
        })
        return {"success":true, "message":"Successfully delete map image"}
    }catch(e){
        console.log("deleting map image > ",e)
        return {"error":true, "message":"Something wrong when deleting map image"}
    }
}

// const getMapImageById = async(imageId:string) => {
//     try{
//         const mapImage = await prisma.mapImage.findUnique({
//             where:{
//                 id: imageId
//             },
//             select:{
//                 id: true,
//                 url: true,
//             }
//         })
//         return {"data": mapImage}
//     }catch(e){
//         console.log("getting map image > ",e)
//         return {"error":true, "message":"Something wrong when getting map image"}
//     }
// }

export {createMapImageById, updateMapImageById, deleteMapImageById}