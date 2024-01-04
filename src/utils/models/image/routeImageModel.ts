import prisma from '@/service/mongodb'
import { getDeleteParams, getGetParams, getPutParams, randomImageName } from './shareModel'
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import {s3} from '@/service/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

//create route image
const createRouteImageById = async(routeId:string, imageData:Buffer) => {
    try{
        const name = randomImageName()
        const params = getPutParams("route", name, imageData)
        const command = new PutObjectCommand(params)
        await s3.send(command)
        const getParams = getGetParams("route",name)
        const getCommand = new GetObjectCommand(getParams)
        const presignedUrl = await getSignedUrl(s3, getCommand, {expiresIn:3600})
        const newImageInfo = await prisma.routeImage.create({
            data:{
                id: name,
                routeId: routeId,
            }
        })
        const newImageData = {
            id: newImageInfo.id,
            url: presignedUrl
        }
        return {"data": newImageData, "success":true, "message":"Successfully create route image"}
    }catch(e){
        console.log("creating route image > ",e)
        return {"error":true, "message":"Something wrong when creating route image"}
    }
}


//update route image
const updateRouteImageById = async(imageId:string, imageData:Buffer) => {
    try{
        const params = getPutParams("route", imageId, imageData)
        const command = new PutObjectCommand(params)
        await s3.send(command)
        const getParams = getGetParams("route", imageId)
        const getCommend = new GetObjectCommand(getParams)
        const presignedUrl = await getSignedUrl(s3, getCommend, {expiresIn:3600})
        const newImageData = {
            id:imageId,
            url:presignedUrl
        }
        return {"data":newImageData,"success":true, "message":"Successfully update route information"}
    }catch(e){
        console.log("updating route image > ",e)
        return {"error":true, "message":"Something wrong when updating route image"}
    }
}

//deleting route image
const deleteRouteImageById = async(imageId:string) => {
    try{
        const image = await prisma.routeImage.findUnique({
            where:{
                id:imageId
            }
        })
        if(!image){
            return {"error":true, "message":"Image not found"}
        }
        const params = getDeleteParams("route",imageId)
        const command = new DeleteObjectCommand(params)
        await s3.send(command)
        await prisma.routeImage.delete({
            where:{
                id: imageId
            }
        })
        return {"success":true, "message":"Successfully delete route image"}
    }catch(e){
        console.log("deleting route image > ",e)
        return {"error":true, "message":"Something wrong when deleting route image"}
    }
}
// const getRouteImageById = async(imageId:string) => {
//     try{
//         const routeImage = await prisma.routeImage.findUnique({
//             where:{
//                 id: imageId
//             },
//             select:{
//                 id: true,
//                 url: true,
//             }
//         })
//         return {"data": routeImage}
//     }catch(e){
//         console.log("getting route image > ",e)
//         return {"error":true, "message":"Something wrong when getting route image"}
//     }
// }
export { createRouteImageById, updateRouteImageById, deleteRouteImageById}