import prisma from '@/service/mongodb'

const getPublicMapGeoData = async(mapId:string, userId?:string) => {
    try{
        const publicMapGeoData = await prisma.map.findUnique({
            where:{
                id: mapId
            },
            select:{
                center:true,
                zoom:true,
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
                likedUserIds:true
            },
        })
        const isLiked = userId?publicMapGeoData?.likedUserIds.includes(userId):false
        const result = {...publicMapGeoData, isLiked: isLiked}
        return {"data":result}
    }catch(e){
        return{"error":true, message:"something error when getting public map geoInfo"}
    }
}

export {getPublicMapGeoData}