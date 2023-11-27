import prisma from '@/service/mongodb'
import { getDeleteParams, getGetParams, getPutParams, randomImageName } from './shareModel'
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import {s3} from '@/service/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
//create spot image
const createSpotImageById = async(spotId:string,  imageData:Buffer) => {
    try{
        const name = randomImageName()
        const params = getPutParams("spot", name, imageData)
        const command = new PutObjectCommand(params)
        await s3.send(command)
        const getParams = getGetParams("spot",name)
        const getCommand = new GetObjectCommand(getParams)
        const presignedUrl = await getSignedUrl(s3, getCommand, {expiresIn:600})
        const newImageInfo = await prisma.spotImage.create({
            data:{
                id: name,
                spotId: spotId,
            }
        })
        const newImageData = {
            id: newImageInfo.id,
            url: presignedUrl
        }
        return {"data": newImageData, "success":true, "message":"Successfully create map image"}
    }catch(e){
        console.log("creating spot image > ",e)
        return {"error":true, "message":"Something wrong when creating spot image"}
    }
}


//update spot image
const updateSpotImageById = async(imageId:string,  imageData:Buffer) => {
    try{
        const params = getPutParams("spot", imageId, imageData)
        const command = new PutObjectCommand(params)
        await s3.send(command)
        const getParams = getGetParams("spot", imageId)
        const getCommend = new GetObjectCommand(getParams)
        const presignedUrl = await getSignedUrl(s3, getCommend, {expiresIn:600})
        const newImageData = {
            id:imageId,
            url:presignedUrl
        }
        return {"data":newImageData,"success":true, "message":"Successfully update spot information"}
    }catch(e){
        console.log("updating spot image > ",e)
        return {"error":true, "message":"Something wrong when updating spot image"}
    }
}

//delete spot image
const deleteSpotImageById = async(imageId:string) => {
    try{
        const image = await prisma.spotImage.findUnique({
            where:{
                id:imageId
            }
        })
        if(!image){
            return {"error":true, "message":"Image not found"}
        }
        const params = getDeleteParams("spot",imageId)
        const command = new DeleteObjectCommand(params)
        await s3.send(command)
        await prisma.spotImage.delete({
            where:{
                id: imageId
            }
        })
        return {"success":true, "message":"Successfully delete spot image"}
    }catch(e){
        console.log("deleting spot image > ",e)
        return {"error":true, "message":"Something wrong when deleting spot image"}
    }
}

//get spot image
// const getSpotImageById = async(imageId: string) => {
//     try{
//         const spotImage = await prisma.spotImage.findUnique({
//             where:{
//                 id:imageId
//             },
//             select:{
//                 id: true,
//                 url: true,
//             }
//         })
//         return {"data": spotImage}
//     }catch(e){
//         console.log("getting spot image > ",e)
//         return {"error":true, "message":"Something wrong when getting spot image"}
//     }

// }
export {createSpotImageById, updateSpotImageById, deleteSpotImageById}