import MapContainer from "@/components/map/MapContainer";
import { getMapGeoInfoById } from "@/utils/models/mapModel";
import { redirect } from "next/navigation";
//dynamic rendering > render at each request time
export default async function MapPage({ params }: { params: { mapId: string } }) {
  const mapGeoInfoResult = await getMapGeoInfoById(params.mapId)
  
  // if(!mapGeoInfoResult.data){
  //   redirect("/home")
  // }
  //mapGeoInfo={mapGeoInfoResult.data}
  return (
    <>
      <main className="flex">
        <MapContainer mapGeoInfo={mapGeoInfoResult.data}/>
      </main> 
    </>
  );
}