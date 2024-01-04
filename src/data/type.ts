type routeType = "walk"|"bike"|"car"|"bus"|"tram"|"train"|"ferry"|"plane"

type currentItemObject = {
    status:"none"|"new"|"old"|"queue"
    id:string,
    type:"spot"|"route"|"linestring"|"polygon"|"circle"|"none"
  }

type drawModeType = "cursor"|"hand"|"mark"|"route"|"LineString"|"Polygon"|"Circle"|"brush"

type geometryMode = "LineString"|"Polygon"|"Circle";

type sourceType = "vector"|"mark"|"route"

type edgeLocationType = number[][]
type spotLocationType = number[]

type selectionTypes = {
    id:string, 
    value:string, 
    name:string
  }
type currentItemType = "none"|"spot"|"route"|"linestring"|"polygon"|"circle"

type currentStatusType = "none"|"queue"|"new"|"old"

type selectedFeatureType = "none"|"spot"|"route"|"linestring"|"polygon"|"circle"

type selectedFeature = {
  type: selectedFeatureType,
  id:string,
}
type ImageTargetType = "map"|"spot"|"route"|"geometry"|""
type curretnImageTargetType = {
  type: ImageTargetType
  id: string,
  isNew:Boolean
}

type cropAreaPercentageType = {
  x: number,
  y: number,
  width: number,
  height: number
}

type cropAreaPixelType = {
  width: number,
  height: number
  x: number,
  y: number,
}

type filterStyleType = {
  filter:string
}


type myMapDataType = {
    id:string,
    title:string,
    country:string,
    regionOrDistrict:string,
    description:string,
    isPublic:Boolean,
    createdAt:string,
    updatedAt:string,
    mapImage?:{
        id:string,
        url:string,
    },
    memberType?:{
        name:string
    },
    travelType?:{
        name:string
    },
    startTime:string,
    startTimeZone:string,
    endTime:string,
    endTimeZone:string,
    duration:number
}

type likeMapDataType = {
  id:string,
  title:string,
  country:string,
  regionOrDistrict:string,
  startTime:string,
  startTimeZone:string,
  endTime:string,
  endTimeZone:string,
  duration:number,
  author:{
      username:string,
  },
  description:string,
  mapImage?:{
      id:string,
      url:string,
  },
  memberType?:{
      name:string
  },
  travelType?:{
      name:string
  },
}

type mapDataType = {
  title:string,
  country:string,
  regionOrDistrict:string,
  memberTypeId?:string,
  travelTypeId?:string,
  description:string,
  startTime:string,
  startTimeZone:string,
  endTime:string,
  endTimeZone:string,
  duration:number,
  mapImage?:{
    id:string,
    url:string
  }
}