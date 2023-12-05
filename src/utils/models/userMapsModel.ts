import prisma from '@/service/mongodb'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getGetParams } from './image/shareModel'
import {s3} from '@/service/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const getUserMaps = async(userId:string) => {
    try{
        const userMaps = await prisma.map.findMany({
            where:{
                authorId:userId
            },
            select:{
                id:true,
                title:true,
                country:true,
                regionOrDistrict:true,
                isPublic:true,
                startTime:true,
                startTimeZone:true,
                endTime:true,
                endTimeZone:true,
                duration:true,
                createdAt:true,
                updatedAt:true,
                travelType:{
                    select:{
                        name:true
                    }
                },
                memberType:{
                    select:{
                        name:true
                    }
                },
                mapImage:{
                    select:{
                        id:true
                    }
                }
            }
        })
        const userMapPromises = userMaps.map(async(map)=>{
            if(map.mapImage!=null){
                const name = map.mapImage?.id
                const params = getGetParams("map", name)
                const command = new GetObjectCommand(params)
                const presignedUrl = await getSignedUrl(s3, command, {expiresIn:600})
                const newMapInfo = {...map, mapImage:{...map.mapImage, url:presignedUrl}}
                return newMapInfo
            }else{
                return map
            }
        });
        const userMapCollections = await Promise.all(userMapPromises);
        return {"data": userMapCollections}
    }catch(e){
        console.log(e)
        return {"error":true, "message":"Something wrong when getting user maps"}
    }
}

const getLikedMaps = async (userId:string) => {
    try{
        const userLikedMaps = await prisma.user.findUnique({
            where:{
                id: userId,
            },
            include:{
                likedMaps:{
                    select:{
                        id:true,
                        title:true,
                        country:true,
                        regionOrDistrict:true,
                        startTime:true,
                        startTimeZone:true,
                        endTime:true,
                        endTimeZone:true,
                        duration:true,
                        description:true,
                        author:{
                           select:{
                                username:true
                           } 
                        },
                        travelType:{
                            select:{
                                name:true
                            }
                        },
                        memberType:{
                            select:{
                                name:true
                            }
                        },
                        mapImage:{
                            select:{
                                id:true
                            }
                        }
                    }
                }
            }
        })
        if(userLikedMaps){
            const userLikedMapPromises = userLikedMaps.likedMaps.map(async(map)=>{
                if(map.mapImage!=null){
                    const name = map.mapImage?.id
                    const params = getGetParams("map", name)
                    const command = new GetObjectCommand(params)
                    const presignedUrl = await getSignedUrl(s3, command, {expiresIn:600})
                    const newMapInfo = {...map, mapImage:{...map.mapImage, url:presignedUrl}}
                    return newMapInfo
                }else{
                    return map
                }
            })
            const userLikedMapCollections = await Promise.all(userLikedMapPromises)
            return {"data": userLikedMapCollections}
        }else{
            return {"data": []}
        }
        
    }catch(e){
        console.log(e)
        return {"error":true, "message":"Something wrong when getting user liked maps"}
    }
}

const likedAMap = async(userId:string, mapId:string) => {
    try{
        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                likedMaps:{
                    connect:{
                        id: mapId
                    }
                }
            }
        })
        return {"success":true, "message":"Successfully like a map"}
    }catch(e){
        console.log("liking map > ",e)
        return {"error":true, "message":"Something wrong when liking map"}
    }
}
const unLikeAMap = async(userId:string, mapId:string) => {
    try{
        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                likedMaps:{
                    disconnect:{
                        id: mapId
                    }
                }
            }
        })
        return {"success":true, "message":"Successfully remove like"}
    }catch(e){
        console.log("liking map > ",e)
        return {"error":true, "message":"Something wrong when remove like"}
    }
}

export {getUserMaps, getLikedMaps, likedAMap, unLikeAMap}