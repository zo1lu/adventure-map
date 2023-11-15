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