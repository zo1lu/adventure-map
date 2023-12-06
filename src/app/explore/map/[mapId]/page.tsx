import React from 'react'
import { getPublicMapGeoData } from '@/utils/models/publicMapModel'
import PublicMapContainer from '@/components/explore/map/PublicMapContainer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getMapInfoById } from '@/utils/models/mapModel'

const page = async({params}:{params: {mapId:string}}) => {
  const mapId = params.mapId
  const session = await getServerSession(authOptions)

  const result = session&&session.user?await getPublicMapGeoData(mapId,session.user.id):await getPublicMapGeoData(mapId)
  const data = result.data?result.data:null
  const mapResult = await getMapInfoById(mapId)
  const mapData = mapResult.data?mapResult.data:null
  return (
    <>
    {data&&mapData?
    <main className="flex">
      <PublicMapContainer geoData={data} mapData={mapData}/>
    </main>
    :<div className='h-screen w-screen flex'>
      <p className='m-auto'>Map not exist!</p>
    </div> 
    }
      
    </>
  )
}

export default page