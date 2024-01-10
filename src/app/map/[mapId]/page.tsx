import MapContainer from "@/components/map/MapContainer";
import { getMapGeoDataById } from "@/utils/models/mapModel";
export default async function MapPage({ params }: { params: { mapId: string } }) {

  const mapGeoInfoResult = await getMapGeoDataById(params.mapId)

  return (
    <>
      {mapGeoInfoResult.data?
      <main className="flex">
        <MapContainer data={mapGeoInfoResult.data}/>
      </main> :
      <div className="w-screen h-screen flex">
        <p className="m-auto">Map not exist!</p>
      </div>
      }
      
    </>
  );
}