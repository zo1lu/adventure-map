import MapContainer from "@/components/map/MapContainer";
import { getMapGeoInfoById } from "@/utils/models/mapModel";
import { redirect } from "next/navigation";
import { useEffect } from "react";
//dynamic rendering > render at each request time
export default async function MapPage({ params }: { params: { mapId: string } }) {
  // const mapGeoInfoResult = await getMapGeoInfoById(params.mapId)
  // const data = await Promise.all([mapGeoInfoResult])
  // if(!mapGeoInfoResult.data){
  //   redirect("/home")
  // }
  //mapGeoInfo={mapGeoInfoResult.data}
  // useEffect(()=>{

  // },[])
  return (
    <>
      <main className="flex">
        <MapContainer />
      </main> 
    </>
  );
}