import { JsonObject } from "@prisma/client/runtime/library"
import { GeoJSONFeature, GeoJSONFeatureCollection } from 'ol/format/GeoJSON.js';
type mapGeoInfoType = {
    zoom: number,
    center: [number,number],
    geo_data: JsonObject | null,
  }
  
type mapInfoType = {
  title: string | null,
  country: string  | null,
  region_or_district: string | null,
  start_time: string,
  start_time_zone: string,
  end_time: string,
  end_time_zone: string,
  duration: number,
  description: string  | null,
  travel_type_id: string  | null,
  member_type_id: string  | null,
  is_public: boolean,
}

type routeInfoType = {
  id:string,
  title:string  | null,
  depart:number[],
  destination:number[],
  route_type_id:string,
  start_time: string,
  start_time_zone: string,
  end_time: string,
  end_time_zone: string,
  duration: number,
  description: string | null,
  geo_data: JsonObject | null,
}

type spotInfoType = {
  id:string,
  title:string | null,
  location:number[],
  spot_type_id: string | null,
  start_time: string,
  start_time_zone: string,
  end_time: string,
  end_time_zone: string,
  duration: number,
  description: string | null,
  geo_data: JsonObject | null,
}

type geometryInfoType = {
  id:string,
  title:string | null,
  geometry_type_id:string,
  color:string,
  stroke:number,
  description:string | null,
  geo_data: JsonObject | null,
}
type geoDataType = {
    "markFeatures": string,
    "routeFeatures": string,
    "vectorFeatures": string,
}

type geoDataCollectionType = {
  "geometrys": {geoData:string}[],
  "routes": {geoData:string}[],
  "spots": {geoData:string}[],
}
type geoDataCollectionName = "geometrys" | "routes" | "spots"

export type {mapGeoInfoType, mapInfoType, routeInfoType, spotInfoType, geometryInfoType, geoDataType, geoDataCollectionType, geoDataCollectionName}