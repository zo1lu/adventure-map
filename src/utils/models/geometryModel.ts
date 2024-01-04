import prisma from '@/service/mongodb'
import { geometryInfoType } from '@/data/infoType'
import { geometryTypes } from '@/data/geometry'
//create geometry
const createGeometry = async(mapId:string, geometryInfo:geometryInfoType) => {
    try{
        const{id, title, geometry_type_id, color, stroke, description, geo_data} = geometryInfo
        const newlyCreatedGeometry = await prisma.geometry.create({
            data:{
                id: id,
                title: title != null ? title : undefined,
                geometryTypeId: geometry_type_id,
                color: color,
                stroke: stroke,
                description: description != null ? description : undefined,
                geoData: geo_data,
                mapId: mapId,
            },
            select:{
                id: true,
                title: true,
                geometryTypeId: true,
                color: true,
                stroke: true,
                description: true,
                geoData: true,
            }
        })
        return {"data": newlyCreatedGeometry}
    }catch(e){
        console.log("creating geometry > ",e)
        return {"error":true, "message":"Something wrong when creating geometry"}
    }
}
//get geometry info by id
const getGeometryById = async (geometryId:string) => {
    try{
        const geometryInfo = await prisma.geometry.findUnique({
            where:{
                id: geometryId,
            },
            select:{
                id: true,
                title: true,
                geometryTypeId: true,
                color: true,
                stroke: true,
                description: true,
                geoData: true,
            }
        })
        return {"data": geometryInfo}
    }catch(e){
        console.log("gettting geometry > ",e)
        return {"error":true, "message":"Something wrong when getting geometry"}
    }
}
//update geometry info by id
const updateGeometry = async(geometryInfo: geometryInfoType) => {
    try{
        const {id, title, geometry_type_id, color, stroke, description, geo_data} = geometryInfo
        await prisma.geometry.update({
            where:{
                id: id
            },
            data:{
                title: title != null ? title : undefined,
                geometryTypeId: geometry_type_id,
                color: color,
                stroke: stroke,
                description: description != null ? description : undefined,
                geoData: geo_data,
            }
        })
        return {"success":true, "message":"Successfully update geometry information"}
    }catch(e){
        console.log("updating route > ", e)
        return {"error":true, "message":"Something wrong when updating geometry"}
    }
}
//delete geometry info by id
const deleteGeometryById = async(geometryId:string) => {
    try{
        await prisma.geometry.delete({
            where:{
                id: geometryId
            }
        })
        return {"success":true, "message":"Successfully delete geometry"}
    }catch(e){
        console.log("deleting route > ", e)
        return {"error":true, "message":"Something wrong when deleting geometry"}
    }
}

export {createGeometry, getGeometryById, updateGeometry, deleteGeometryById}