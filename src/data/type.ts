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