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
                public:true,
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
        const mapPromises = publicMaps.map(async(mapInfo)=>{
            const isLiked = userId?mapInfo.likedUserIds.includes(userId):false
            if(mapInfo.mapImage!=null){
                const name = mapInfo.mapImage.id
                const params = getGetParams("map", name)
                const command = new GetObjectCommand(params)
                const presignedUrl = await getSignedUrl(s3, command, {expiresIn:600})
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
        return {"data": maps}
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
                        public:{
                            equals:true
                        },
                        OR:[
                            {
                                title:{
                                    contains: keyword
                                }
                            },{
                                country:{
                                    contains: keyword
                                }
                            },{
                                regionOrDistrict:{
                                    contains: keyword
                                }
                            },{
                                description:{
                                    contains: keyword
                                }
                            },{
                                travelType:{
                                    name:{
                                        contains: keyword
                                    }
                                }
                            },{
                                memberType:{
                                    name:{
                                        contains: keyword
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
            const maps = filterdMaps.map(async(mapInfo)=>{
                const isLiked = userId?mapInfo.likedUserIds.includes(userId):false
                if(mapInfo.mapImage!=null){
                    const name = mapInfo.mapImage.id
                    const params = getGetParams("map", name)
                    const command = new GetObjectCommand(params)
                    const presignedUrl = await getSignedUrl(s3, command, {expiresIn:600})
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
            return {"data": maps}
    }catch(e){
        return{"error":true, message:"something error when getting filtered maps"}
    }
}

const getPublicMapsWithFilter = async(pageNum:number, numPerPage:number, keyword?:string, userId?:string, countryName?:string,  regionName?:string, travelTypeIds?:string[], memberTypeId?:string, hourMin:number = 0, hourMax:number = 4320) => {
    try{
        const startRowIndex = numPerPage*(pageNum-1)
        const filterdMaps = await prisma.map.findMany({
            skip: startRowIndex,
            take: numPerPage,
            where:{
                    public:{
                        equals:true
                    },
                    OR:[
                        {
                            title:{
                                contains: keyword
                            }
                        },{
                            country:{
                                contains: keyword
                            }
                        },{
                            regionOrDistrict:{
                                contains: keyword
                            }
                        },{
                            description:{
                                contains: keyword
                            }
                        },{
                            travelType:{
                                name:{
                                    contains: keyword
                                }
                            }
                        },{
                            memberType:{
                                name:{
                                    contains: keyword
                                }
                            }
                        }
                    ],
                    AND:[
                        {
                            country:{
                                contains: countryName
                            }
                        },{
                            regionOrDistrict:{
                                contains: regionName
                            }
                        },{
                            travelType:{
                                id:{
                                    in: travelTypeIds
                                }
                            }
                        },{
                            memberType:{
                                id:{
                                    contains: memberTypeId
                                }
                            }
                        },{
                            duration:{
                                gte:hourMin
                            }
                        },
                        {
                            duration:{
                                lte:hourMax
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
                const presignedUrl = await getSignedUrl(s3, command, {expiresIn:600})
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
        return {"data": maps}
}catch(e){
    return{"error":true, message:"something error when getting filtered maps"}
}
}

const getPublicMapsCount = async() => {
    try{
        const count = await prisma.map.count({
            where:{
                public:true
            },
        })
        return {"data":{count: count}}
    }catch{
        return {"error":true, message:"Something wrong when counting public map number"}
    }
}

const getPublicMapsCountWithKeyword = async(keyword:string) => {
    try{
        const count = await prisma.map.count({
            where:{
                public:{
                    equals:true
                },
                OR:[
                    {
                        title:{
                            contains: keyword
                        }
                    },{
                        country:{
                            contains: keyword
                        }
                    },{
                        regionOrDistrict:{
                            contains: keyword
                        }
                    },{
                        description:{
                            contains: keyword
                        }
                    },{
                        travelType:{
                            name:{
                                contains: keyword
                            }
                        }
                    },{
                        memberType:{
                            name:{
                                contains: keyword
                            }
                        }
                    }
                ]
            },
        })
        return {"data":{count: count}}
    }catch{
        return {"error":true, message:"Something wrong when counting keyword filtered public map number"}
    }
}

const getPublicMapsCountWithFilter = async(keyword?:string, countryName?:string,  regionName?:string, travelTypeIds?:string[], memberTypeId?:string, hourMin:number = 0, hourMax:number = 4320) => {
    try{
        const count = prisma.map.count({
            where:{
                public:{
                    equals:true
                },
                OR:[
                    {
                        title:{
                            contains: keyword
                        }
                    },{
                        country:{
                            contains: keyword
                        }
                    },{
                        regionOrDistrict:{
                            contains: keyword
                        }
                    },{
                        description:{
                            contains: keyword
                        }
                    },{
                        travelType:{
                            name:{
                                contains: keyword
                            }
                        }
                    },{
                        memberType:{
                            name:{
                                contains: keyword
                            }
                        }
                    }
                ],
                AND:[
                    {
                        country:{
                            contains: countryName
                        }
                    },{
                        regionOrDistrict:{
                            contains: regionName
                        }
                    },{
                        travelType:{
                            id:{
                                in: travelTypeIds
                            }
                        }
                    },{
                        memberType:{
                            id:{
                                contains: memberTypeId
                            }
                        }
                    },{
                        duration:{
                            gte:hourMin
                        }
                    },
                    {
                        duration:{
                            lte:hourMax
                        }
                    }
                ]
            },
        })
        return {"data":{count: count}}
    }catch{
        return {"error":true, message:"Something wrong when counting filtered public map number"}
    }
}

const setMapPublic = async(mapId:string) => {
    try{
        await prisma.map.update({
            where:{
                id: mapId
            },
            data:{
                public: {
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
                public: {
                    set: true
                }
            }
        })
        return {"success":true, message:"Successfully make map private"}
    }catch(e){
        return{"error":true, message:"something error when making map private"}
    }
}

export {
    getPublicMaps, getPublicMapsWithKeyword, getPublicMapsWithFilter, getPublicMapsCount, getPublicMapsCountWithKeyword, getPublicMapsCountWithFilter, setMapPublic, setMapPrivate
}