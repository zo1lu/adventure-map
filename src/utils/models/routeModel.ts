import prisma from '@/service/mongodb'
import { routeInfoType } from '@/data/infoType'
//create route
const createRoute = async(mapId:string, routeInfo:routeInfoType) => {
    try{
        const{id, title, depart, destination, route_type_id, start_time, start_time_zone, end_time, end_time_zone, duration, description, geo_data} = routeInfo
        const newlyCreatedRoute = await prisma.route.create({
            data:{
                id: id,
                title: title != null ? title : undefined,
                depart: depart,
                destination: destination,
                routeTypeId: route_type_id,
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
                depart: true,
                destination: true,
                routeTypeId: true,
                startTime: true,
                startTimeZone: true,
                endTime: true,
                endTimeZone: true,
                duration: true,
                description: true,
                geoData: true,
                routeImage:{
                    select:{
                        id:true,
                        url:true,
                    }
                }
            },
        })
        return {"data": newlyCreatedRoute}
    }catch(e){
        console.log("creating route > ",e)
        return {"error":true, "message":"Something wrong when creating route"}
    }
}
//get route info by id
const getRouteById = async (routeId:string) => {
    try{
        const routeInfo = await prisma.route.findUnique({
            where:{
                id: routeId,
            },
            select:{
                id: true,
                title: true,
                depart: true,
                destination: true,
                routeTypeId: true,
                startTime: true,
                startTimeZone: true,
                endTime: true,
                endTimeZone: true,
                duration: true,
                description: true,
                geoData: true,
                routeImage:{
                    select:{
                        id: true,
                        url: true,
                    }
                }
            },
            
        })
        return {"data": routeInfo}
    }catch(e){
        console.log("gettting route > ",e)
        return {"error":true, "message":"Something wrong when getting route"}
    }
}
//update route info by id
const updateRoute = async (routeInfo: routeInfoType) => {
    try{
        const{id, title, depart, destination, route_type_id, start_time, start_time_zone, end_time, end_time_zone, duration, description, geo_data} = routeInfo
        await prisma.route.update({
            where:{
                id: id
            },
            data:{
                title: title != null ? title : undefined,
                depart: depart,
                destination: destination,
                routeTypeId: route_type_id,
                startTime: start_time,
                startTimeZone: start_time_zone,
                endTime: end_time,
                endTimeZone: end_time_zone,
                duration: duration,
                description: description != null ? title : undefined,
                geoData: geo_data,
            }
        })
        return {"success":true, "message":"Successfully update route information"}
    }catch(e){
        console.log("updating route > ", e)
        return {"error":true, "message":"Something wrong when updating route"}
    }
}
//delete route info by id
const deleteRouteById = async(routeId:string) => {
    try{
        await prisma.map.delete({
            where:{
                id: routeId,
            }
        })
        return {"success":true, "message":"Successfully delete route"}
    }catch(e){
        console.log("deleting route > ", e)
        return {"error":true, "message":"Something wrong when deleting route"}
    }
}

//create route image
const createRouteImageById = async(routeId:string, imageUrl:string) => {
    try{
        await prisma.routeImage.create({
            data:{
                url: imageUrl,
                routeId: routeId,
            }
        })
    }catch(e){
        console.log("creating route image > ",e)
        return {"error":true, "message":"Something wrong when creating route image"}
    }
}

const getRouteImageById = async(imageId:string) => {
    try{
        const routeImage = await prisma.routeImage.findUnique({
            where:{
                id: imageId
            },
            select:{
                id: true,
                url: true,
            }
        })
        return {"data": routeImage}
    }catch(e){
        console.log("getting route image > ",e)
        return {"error":true, "message":"Something wrong when getting route image"}
    }
}

//deleting route image
const deleteRouteImageById = async(imageId:string) => {
    try{
        await prisma.routeImage.delete({
            where:{
                id: imageId
            }
        })
    }catch(e){
        console.log("deleting route image > ",e)
        return {"error":true, "message":"Something wrong when deleting route image"}
    }
}

export{ createRoute, getRouteById, updateRoute, deleteRouteById, createRouteImageById, getRouteImageById, deleteRouteImageById}