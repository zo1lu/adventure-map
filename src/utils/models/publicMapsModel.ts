import prisma from '@/service/mongodb'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getGetParams } from './image/shareModel'
import {s3} from '@/service/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'


const getPublicMaps = async(pageNum:number, numPerPage:number, userId?:string) => {
    
    try{
        const startRowIndex = numPerPage*(pageNum-1)
        const publicMaps = await prisma.map.findMany({
            skip: startRowIndex,
            take: numPerPage,
            where:{
                isPublic:true,
            },
            select:{
                id:true,
                title:true,
                country:true,
                regionOrDistrict:true,
                author:{
                    select:{
                        id:true,
                        username:true,
                    }
                },
                startTime:true,
                endTime:true,
                duration:true,
                description:true,
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
                },
                likedUserIds:true
            }
        })
        const mapPromises = publicMaps.map(async(mapInfo)=>{
            const isLiked = userId?mapInfo.likedUserIds.includes(userId):false
            if(mapInfo.mapImage!=null){
                const name = mapInfo.mapImage.id
                const params = getGetParams("map", name)
                const command = new GetObjectCommand(params)
                const presignedUrl = await getSignedUrl(s3, command, {expiresIn:3600})
                return {...mapInfo, 
                    isLiked:isLiked, 
                    mapImage:{
                        ...mapInfo.mapImage,
                        url:presignedUrl
                    }}
            }else{
                return {...mapInfo, isLiked:isLiked }}
            }
        )
        const maps = await Promise.all(mapPromises);
        return {"data": maps, "type":"all"}
    }catch(e){
        return{"error":true, message:"something error when getting public maps"}
    }
}

const getPublicMapsWithKeyword = async(pageNum:number, numPerPage:number, keyword:string, userId?:string) => {
    try{
            const startRowIndex = numPerPage*(pageNum-1)
            const filterdMaps = await prisma.map.findMany({
                skip: startRowIndex,
                take: numPerPage,
                where:{
                        isPublic:{
                            equals:true
                        },
                        OR:[
                            {
                                title:{
                                    contains: keyword,
                                    mode: 'insensitive'
                                }
                            },{
                                country:{
                                    contains: keyword,
                                    mode: 'insensitive'
                                }
                            },{
                                regionOrDistrict:{
                                    contains: keyword,
                                    mode: 'insensitive'
                                }
                            },{
                                description:{
                                    contains: keyword,
                                    mode: 'insensitive'
                                }
                            },{
                                travelType:{
                                    name:{
                                        contains: keyword,
                                        mode: 'insensitive'
                                    }
                                }
                            },{
                                memberType:{
                                    name:{
                                        contains: keyword,
                                        mode: 'insensitive'
                                    }
                                }
                            }
                        ]
                    },
                select:{
                    id:true,
                    title:true,
                    country:true,
                    regionOrDistrict:true,
                    author:true,
                    startTime:true,
                    endTime:true,
                    duration:true,
                    description:true,
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
                    },
                    likedUserIds:true
                }    
            })
            const mapPromises = filterdMaps.map(async(mapInfo)=>{
                const isLiked = userId?mapInfo.likedUserIds.includes(userId):false
                if(mapInfo.mapImage!=null){
                    const name = mapInfo.mapImage.id
                    const params = getGetParams("map", name)
                    const command = new GetObjectCommand(params)
                    const presignedUrl = await getSignedUrl(s3, command, {expiresIn:3600})
                    return {...mapInfo, 
                        isLiked:isLiked, 
                        mapImage:{
                            ...mapInfo.mapImage,
                            url:presignedUrl
                        }}
                }else{
                    return {...mapInfo, isLiked:isLiked }}
                }
            )
            const maps = await Promise.all(mapPromises);
            return {"data": maps, "type":"key"}
    }catch(e){
        return{"error":true, message:"something error when getting filtered maps"}
    }
}

const getPublicMapsWithFilter = async(pageNum:number, numPerPage:number, userId?:string, countryName?:string,  regionName?:string, travelTypeIds?:string[], memberTypeId?:string, hourMin?:number , hourMax?:number ) => {
    try{
        const startRowIndex = numPerPage*(pageNum-1)
        const filterdMaps = await prisma.map.findMany({
            skip: startRowIndex,
            take: numPerPage,
            where:{
                    country:{
                        contains: countryName
                    },
                    regionOrDistrict:{
                        contains: regionName
                    },
                    travelType:{
                        id:{
                            in: travelTypeIds?.length==0?undefined:travelTypeIds
                        }
                    },
                    memberType:{
                        id:{
                           equals: memberTypeId
                        }
                    },
                    AND:[
                        {
                            duration:{
                                gte:hourMin
                            }
                        },
                        {
                            duration:{
                                lte:hourMax
                            }
                        },
                        {
                            isPublic:{
                                equals:true
                            },
                        }
                    ]
                },
            select:{
                id:true,
                title:true,
                country:true,
                regionOrDistrict:true,
                author:{
                    select:{
                        id:true,
                        username:true,
                    }
                },
                startTime:true,
                endTime:true,
                duration:true,
                description:true,
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
                },
                likedUserIds:true
            }    
        })
        const mapPromises = filterdMaps.map(async(mapInfo)=>{
            const isLiked = userId?mapInfo.likedUserIds.includes(userId):false
            if(mapInfo.mapImage!=null){
                const name = mapInfo.mapImage.id
                const params = getGetParams("map", name)
                const command = new GetObjectCommand(params)
                const presignedUrl = await getSignedUrl(s3, command, {expiresIn:3600})
                return {...mapInfo, 
                    isLiked:isLiked, 
                    mapImage:{
                        ...mapInfo.mapImage,
                        url:presignedUrl
                    }}
            }else{
                return {...mapInfo, isLiked:isLiked }}
            }
        )
        const maps = await Promise.all(mapPromises);
        return {"data": maps, "type":"filter"}
}catch(e){
    return{"error":true, message:"something error when getting filtered maps"}
}
}

const getPublicMapsCount = async() => {
    try{
        const count = await prisma.map.count({
            where:{
                isPublic:true
            },
        })
        return {"data":{count: count}, "type":"all count"}
    }catch{
        return {"error":true, message:"Something wrong when counting public map number"}
    }
}

const getPublicMapsCountWithKeyword = async(keyword:string) => {
    try{
        const count = await prisma.map.count({
            where:{
                isPublic:{
                    equals:true
                },
                OR:[
                    {
                        title:{
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    },{
                        country:{
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    },{
                        regionOrDistrict:{
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    },{
                        description:{
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    },{
                        travelType:{
                            name:{
                                contains: keyword,
                                mode: 'insensitive'
                            }
                        }
                    },{
                        memberType:{
                            name:{
                                contains: keyword,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
        })
        return {"data":{count: count}, "type":"key count"}
    }catch{
        return {"error":true, message:"Something wrong when counting keyword filtered public map number"}
    }
}

const getPublicMapsCountWithFilter = async(countryName?:string,  regionName?:string, travelTypeIds?:string[], memberTypeId?:string, hourMin?:number, hourMax?:number) => {
    try{
        const count = prisma.map.count({
            where:{
                country:{
                    contains: countryName
                },
                regionOrDistrict:{
                    contains: regionName
                },
                travelType:{
                    id:{
                        in: travelTypeIds?.length==0?undefined:travelTypeIds
                    }
                },
                memberType:{
                    id:{
                       equals: memberTypeId
                    }
                },
                AND:[
                    {
                        duration:{
                            gte:hourMin
                        }
                    },
                    {
                        duration:{
                            lte:hourMax
                        }
                    },
                    {
                        isPublic:{
                            equals:true
                        },
                    }
                ]
            },
        })
        return {"data":{count: count}, "type":"filter count"}
    }catch{
        return {"error":true, message:"Something wrong when counting filtered public map number"}
    }
}

const setMapPublic = async(mapId:string) => {
    try{
        const result = await checkIfAbleToGoPublic(mapId)
        if(!result.result||result.error){
            return{"sucess":false, message:"make sure you're map is ready to public"}
        }
        await prisma.map.update({
            where:{
                id: mapId
            },
            data:{
                isPublic: {
                    set: true
                }
            }
        })
        return {"success":true, message:"Successfully publish map"}
    }catch(e){
        return{"error":true, message:"something error when making map public"}
    }
}

const setMapPrivate = async(mapId:string) => {
    try{
        await prisma.map.update({
            where:{
                id: mapId
            },
            data:{
                isPublic: {
                    set: false
                }
            }
        })
        return {"success":true, message:"Successfully make map private"}
    }catch(e){
        return{"error":true, message:"something error when making map private"}
    }
}

const checkIfAbleToGoPublic = async(mapId:string) => {
    try{
        const mapInfo = await prisma.map.findUnique({
            where:{
                id:mapId
            },
            select:{
                title:true,
                country:true,
                regionOrDistrict:true,
                mapImage:{
                    select:{
                        id:true,
                    }
                },
                startTime:true,
                startTimeZone:true,
                endTime:true,
                endTimeZone:true,
                description:true,
            }
        })
        let result = true
        for (const prop in mapInfo){
            if(mapInfo[prop]==""||mapInfo[prop]==null){
                result = false
            }
        }
        return {"result": result}
    }catch(e){
        return{"error":true, message:"something error when checking if map can go public"}
    }
}

export {
    getPublicMaps, getPublicMapsWithKeyword, getPublicMapsWithFilter, getPublicMapsCount, getPublicMapsCountWithKeyword, getPublicMapsCountWithFilter, setMapPublic, setMapPrivate, checkIfAbleToGoPublic
}