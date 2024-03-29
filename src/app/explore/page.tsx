'use client'
import React, {useEffect, useState, useRef} from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { memberTypes, travelTypes } from '@/data/map'
import continents from '@/data/countryOfRegion.json'
import regions from '@/data/citiesObject.json'
import MapItem from '@/components/explore/mapItem'
import LoginBox from '@/components/message/LoginBox'
import { arrayRange } from '@/utils/calculation'
const dayRangeName = {
  1:"1-2 Days",
  2:"3-5 Days",
  3:"6-7 Days",
  4:"8-10 Days",
  5:"11-15 Days",
  6:"15-30 Days",
  7:"1-3 Months",
  8:">3 Months",
}
const currentNumberStyle = {
  backgroundColor:"#022c22",
  color:"#fdfdf4"
}
const numberStyle = {
  backgroundColor:"#e0e0ce",
  color:"black"
}
const selectedStyle = { border: "2px solid black" }
const unselectedStyle = { border: "1px solid black" }
const ExplorePage = () => {
  const { data:session } = useSession()
  const router = useRouter()  
  const [data, setData] = useState<object[]>([])
  ///
  const [keyword, setKeyword] = useState("")
  const [hourMinMax, setHourMinMax] = useState([0,4320])
  const [dayRange, setDayRange] = useState(3)
  const [countryName, setCountryName] = useState("")
  const [regionName, setRegionName] = useState("")
  const [travelTypeToggles, setTravelTypeToggles] = useState({
    TT01:false,
    TT02:false,
    TT03:false,
    TT04:false,
    TT05:false,
    TT06:false,
    TT07:false,
    TT08:false,
    TT09:false,
    TT10:false,
    TT11:false,
    TT12:false,
    TT15:false,
    TT13:false,
    TT14:false,

  })
  const [memberTypeId, setMemberTypeId] = useState("")
  ///
  const [currentPageNum, setCurrentPageNum] = useState(1)
  const perPageElement = useRef(8) 
  ///
  const [regionList, setRegionList] = useState<string[]>([])
  const [dataSize, setDataSize] = useState(8)
  const [pageNum, setPageNum] = useState(1)
  const [pageArray, setPageArray] = useState([1])
  
  const [message, setMessage] = useState({
    type:"",
    content:""
  })

  const [isFilterPageOpen, setIsFilterPageOpen] = useState(false)
  const [isSearchFieldOpen, setIsSearchFieldOpen] = useState(false)
  const searchResultRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const search = () => {
    //get newest data and data count
    if(keyword==""){
      return
    }
    getData(1)
    getDataSize()
    setCurrentPageNum(()=>1)
  }
  const changeTravelType = (travelTypeId:string)=>{
    const id = travelTypeId
    switch (id){
      case "TT01":
        setTravelTypeToggles((current)=>{
          return {...current, TT01:!travelTypeToggles.TT01}
        })
        break
      case "TT02":
        setTravelTypeToggles((current)=>{
          return {...current, TT02:!travelTypeToggles.TT02}
        })
        break
      case "TT03":
        setTravelTypeToggles((current)=>{
          return {...current, TT03:!travelTypeToggles.TT03}
        })
        break
      case "TT04":
        setTravelTypeToggles((current)=>{
          return {...current, TT04:!travelTypeToggles.TT04}
        })
        break
      case "TT05":
        setTravelTypeToggles((current)=>{
          return {...current, TT05:!travelTypeToggles.TT05}
        })
        break
      case "TT06":
        setTravelTypeToggles((current)=>{
          return {...current, TT06:!travelTypeToggles.TT06}
        })
        break
      case "TT07":
        setTravelTypeToggles((current)=>{
          return {...current, TT07:!travelTypeToggles.TT07}
        })
        break
      case "TT08":
        setTravelTypeToggles((current)=>{
          return {...current, TT08:!travelTypeToggles.TT08}
        })
        break
      case "TT09":
        setTravelTypeToggles((current)=>{
          return {...current, TT09:!travelTypeToggles.TT09}
        })
        break
      case "TT10":
        setTravelTypeToggles((current)=>{
          return {...current, TT10:!travelTypeToggles.TT10}
        })
        break
      case "TT11":
        setTravelTypeToggles((current)=>{
          return {...current, TT11:!travelTypeToggles.TT11}
        })
        break
      case "TT12":
        setTravelTypeToggles((current)=>{
          return {...current, TT12:!travelTypeToggles.TT12}
        })
        break
      case "TT13":
        setTravelTypeToggles((current)=>{
          return {...current, TT13:!travelTypeToggles.TT13}
        })
        break
      case "TT14":
        setTravelTypeToggles((current)=>{
          return {...current, TT14:!travelTypeToggles.TT14}
        })
        break
      case "TT15":
        setTravelTypeToggles((current)=>{
          return {...current, TT15:!travelTypeToggles.TT15}
        })
        break
    }

  }
  const changeMemberTypeId = (typeName:string) => {
    setMemberTypeId(()=>typeName)
  }
  const toggleFilterPage = () => {
    setIsFilterPageOpen(()=>!isFilterPageOpen)
  }
  const goToPage = (num:number) => {
    if(num<=pageNum){
      setCurrentPageNum(()=>num)
    }
  }
  const goToPrePage =()=> {
    if(currentPageNum>1){
      setCurrentPageNum(()=>currentPageNum-1)
    }
  }
  const goToNextPage = ()=> {
    if(currentPageNum<pageNum){
      setCurrentPageNum(()=>currentPageNum+1)
    }
  }
  const getPageArray = (currentPageNum:number, totalPageNum:number) => {
    
    if(totalPageNum<5&&totalPageNum>1){
      return arrayRange(1,totalPageNum,1)
    }else if(totalPageNum==1){
      return [1]
    }else{
      if(currentPageNum<3){
        return arrayRange(1,5,1)
      }else if(currentPageNum > totalPageNum-2){
        return arrayRange(totalPageNum-4,totalPageNum,1)
      }else{
        return arrayRange(currentPageNum-2,currentPageNum+2,1)
      }
    }
  }
  const getDayMinMax = (dayRange:number) => {
    return dayRange==1?[0,48]
          :dayRange==2?[48,120]
          :dayRange==3?[120,168]
          :dayRange==4?[168,240]
          :dayRange==5?[240,360]
          :dayRange==6?[360,720]
          :dayRange==7?[720,2160]
          :dayRange==8?[2160,4320]
          :[0,4320]
  }
  const getTravelTypeList = (travelTypeToggles:object) => {
    const keys = Object.keys(travelTypeToggles)
    const list:string[] = []
    keys.forEach((key)=>{
      if(travelTypeToggles[key]==true){
        list.push(key)
      }
    })
    return list.length>0?list.join(","):""
  }
  const getQueryString = () => {
    
    const key = keyword
    const country = countryName
    const region = regionName
    const travel = getTravelTypeList(travelTypeToggles)
    const member = memberTypeId
    const min = hourMinMax[0]
    const max = hourMinMax[1]
    return `key=${key}&country=${country}&region=${region}&travel=${travel}&member=${member}&min=${min}&max=${max}`
  }
  const dataRequest = (currentPageNum:number) => {  
    const page = currentPageNum
    const perPage = perPageElement.current
    const user = session?session.user.id:""
    const string = getQueryString()  

    return new Promise<{"data"?:object[],"error"?:Boolean}>((resolve, reject)=>{
      fetch(`/api/public/maps/list?page=${page}&perPage=${perPage}&user=${user}&${string}`)
      .then(res=>res.json())
      .then((data)=>{
        return data.data? resolve(data):reject(data)
      })
      .catch((e)=>reject(e))
    })
  }

  const dataSizeRequest = () => {
    const string = getQueryString()  
    return new Promise<{"data"?:{"count":number},"error"?:Boolean}>((resolve, reject)=>{
      fetch(`/api/public/maps/count?${string}`)
      .then(res=>res.json())
      .then((data)=>{
        return data.data? resolve(data):reject(data)
      })
      .catch((e)=>reject(e))
    })
  }
  
  const getData = async(currentPageNum:number) => {
    setIsLoading(()=>true)
    try{
      const data = await dataRequest(currentPageNum)
      if(data!=null&&data.data!=undefined&&data.data.length>0){
        setData(()=>{
          return data.data
        })
      }
      else{
        setData(()=>[])
      }
      setIsLoading(()=>false)
    }catch(e){
      console.log(e)
      setData(()=>[])
      setIsLoading(()=>false)
    }
  }
  const getDataSize = async() => {
    try{
      const data = await dataSizeRequest()
      if(data!=null&&data.data!=undefined&&data.data.count>0){
        setDataSize(()=>{
          return data.data.count
        })
      }
    }catch(e){
      console.log(e)
    }
  }
  const logout = async() => {
    try{
      await signOut({redirect:false})
      getData(1)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(()=>{
    perPageElement.current = window.innerWidth>1200?8:
                              window.innerWidth>800?6:
                              window.innerWidth>600?4:8
    getData(1)
    getDataSize()
  },[])

  useEffect(()=>{
    getData(currentPageNum)
  },[currentPageNum])

  useEffect(()=>{
    
    setPageArray(()=>getPageArray(currentPageNum, pageNum))
  },[currentPageNum, pageNum])

  useEffect(()=>{
    let mod = dataSize%perPageElement.current
    let pageNumbers = dataSize/perPageElement.current
    setPageNum(()=>mod>0?pageNumbers+1:pageNumbers)
  },[dataSize])

  useEffect(()=>{
    if(countryName!=""&&regions[countryName]){
      setRegionList(()=>{
        return regions[countryName]
      })
    }else{
      setRegionList(()=>{
        return []
      })
    }
  },[countryName])

  // const goToMap = (mapId:string) => {
  //   //check id member login
  //   router.push(`/explore/map/${mapId}`)
  //   //if login redirect to map page else
  // }
  
  const checkIsLogin = () => {
    if(session==null){
      setMessage(()=>{
          return {type:"confirm","content":"Login to like map"}
      })
      return false
    }else{
      return true
    }
  }
  const closeMessageBox = () => {
      setMessage(()=>{
          return {
              type:"",
              content:""
          }
      })
  }
  const keyContentChangeHandler = (type:string, value:string) => {
    switch (type){
      case "keyword":
        setKeyword(()=>value)
        break
      case "country":
        setCountryName(()=>value)
        break
      case "region":
        setRegionName(()=>value)
        break 
      case "dayRange":
        setDayRange(()=>parseInt(value))
        setHourMinMax(()=>getDayMinMax(parseInt(value)))
        break
    }
  }
  const clearSearchField = () => {
    setKeyword(()=>"")
  }
  const resetFilter = () => {
    setCountryName(()=>"")
    setRegionName(()=>"")
    setDayRange(()=>3)
    setTravelTypeToggles(()=>{
      return {
        TT01:false,
        TT02:false,
        TT03:false,
        TT04:false,
        TT05:false,
        TT06:false,
        TT07:false,
        TT08:false,
        TT09:false,
        TT10:false,
        TT11:false,
        TT12:false,
        TT15:false,
        TT13:false,
        TT14:false,
      }
    })
    setMemberTypeId(()=>"")
    setHourMinMax(()=>[0,4320])
  }
  const toggleSearchField = () => {
    setIsSearchFieldOpen(()=>!isSearchFieldOpen)
    isSearchFieldOpen?setIsFilterPageOpen(()=>false):null
  }
  return (
    <>
        <div className='w-screen h-screen sm:hidden flex bg-main-70 justify-center items-center'>
            <p className='text-white m-auto'>View in landscape mode</p>
        </div>
        <div className='w-full h-screen hidden sm:flex flex-col items-center justify-center relative'>
            {message.type=="confirm"?<LoginBox message={message.content} closeMessageBox={closeMessageBox} />:null}
            
            <div className='top-0 w-full h-20 sticky bg-main-70'>
              <div className='sm:w-[90%] md:w-4/5 h-full mx-auto flex items-center justify-between'>
                <Link className='w-fit h-fit text-3xl text-neutral-light font-yeseva_one' href="/">Adventure Map</Link>
                <div className='flex gap-5 items-center'>
                  {session?
                  <>
                    <p className='w-fit text-xl text-neutral-light'>
                    <Link className='hover:underline ' href="/home">&rarr; Home </Link>
                    </p>
                    <button className="rounded-md bg-neutral-light text-main-70 px-5 py-2" onClick={()=>logout()}>
                      logout
                    </button>
                  </>
                  :<Link className='rounded-md bg-neutral-light text-main-70 px-5 py-2' href="/login">Login</Link>}
                </div>
              </div>
              
              
            </div>
            <div className='w-full h-screen overflow-y-scroll'>
              <div ref={searchRef} className='sm:w-[90%] md:w-4/5 max-w-[1200px] h-[100px] m-auto mt-3 flex justify-between items-center'>
                <div className='h-fit w-7/12 flex xl:flex-row flex-col xl:items-end xl:gap-5 gap-1'>
                  <h1 className='font-prata text-4xl'>Explore</h1>
                  <h3 className='text-lg mb-1'>Find a travel journal inspired you!</h3>
                </div>
                <div className='w-5/12 h-fit'>
                    {/* search */}
                  <div className='w-full flex items-center gap-3 justify-end'>
                      {isSearchFieldOpen?
                      <>
                        <div className="flex items-center w-[200px] h-10 px-3 border-2 border-main-70 rounded-md">
                          <input value={keyword} className="w-full focus:outline-none" type="text" placeholder='country, travel type...' onChange={(e)=>keyContentChangeHandler("keyword",e.target.value)}/>
                          {keyword!=""?
                            <button onClick={()=>clearSearchField()}>
                              <Image 
                              src={'/icons/cross-50.png'}
                              width={25}
                              height={25}
                              alt="filter"/>
                            </button>
                            :null
                          }
                        </div>
                        <button className='h-10 font-bold rounded-md text-main-70 border-2 border-main-70 px-5 py-2' onClick={()=>search()}>Search</button>
                        <button onClick={()=>toggleFilterPage()}>
                          <Image 
                          src={'/icons/filter-24.png'}
                          width={30}
                          height={30}
                          alt="filter"/>
                        </button>
                      </>
                      :<></>
                    }
                    <button onClick={()=>toggleSearchField()}>
                        <Image 
                        src={isSearchFieldOpen?'/icons/cross-60.png':'/icons/search-48.png'}
                        width={30}
                        height={30}
                        alt="search"/>
                      </button>
                  </div>
                </div>
        
              </div> 
              {isFilterPageOpen?
                  <div className='sm:w-[90%] md:w-4/5 max-w-[1200px] m-auto grid grid-cols-3 grid-rows-3 py-3 gap-3 items-start relative'>
                    {/* location */}
                    <div className='flex flex-col col-span-2'>
                      <p className='font-bold'>&#10033;Location</p>
                      <div className='flex pl-3 gap-5'>
                        <div className='flex items-center'>
                          <p className="text-xl">&rarr;</p>
                          <select value={countryName} className='w-80 h-10 focus:outline-none font-bold text-xl appearance-none'onChange={(e)=>keyContentChangeHandler("country",e.target.value)}>
                            <option className='text-xs' value="">Country</option>
                            {continents.map((continent,i)=>{
                              return <optgroup className='text-xs' label={continent.name} key={i}>
                                {continent.countries.map((country,j)=>{
                                  return <option key={j} value={country.name}>{country.name}</option>
                                })}
                              </optgroup>
                            })}
                          </select>
                        </div>
                        <div className='flex items-center'>
                          <p className="text-xl">&rarr;</p>
                          <select value={regionName} className='w-80 h-10 focus:outline-none font-bold text-xl appearance-none' onChange={(e)=>keyContentChangeHandler("region",e.target.value)}>
                            <option className='text-xs' value="">Region</option>
                            {regionList.length>0&&regionList.map((region,i)=>{
                              return <option className='text-xs' key={i} value={region}>{region}</option>
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    {/* day range */}
                    <div>
                      <p className='font-bold'>&#10033;Day Range</p>
                      <div className='pl-3'>
                        
                        <p className='text-xl font-bold'>
                          {dayRangeName[dayRange]}
                        </p>
                        <input value={dayRange.toString()} className="w-40 h-[2px] bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-main-70 dark:bg-gray-700" type="range" min={1} max={8} defaultValue={3} onChange={(e)=>{
                          keyContentChangeHandler("dayRange",e.target.value)
                        }}/> 
                      </div>
                    </div>
                    
                    {/* travel type */}
                    <div className='col-span-3'>
                      <p className='font-bold'>&#10033;Travel Type</p>
                      <div className='w-fit h-fit flex flex-wrap gap-1 pl-3'>
                        {travelTypes.map((travelType, i)=>{
                          return <label key={i} className='box-border border-[1px] border-main-70 rounded-md px-3 py-1 ' htmlFor={travelType.id} style={travelTypeToggles[travelType.id]?selectedStyle:unselectedStyle}>
                          <input id={travelType.id} className="hidden" type="checkbox" name="travel-type" value={travelType.id} onChange={(e)=>changeTravelType(e.target.value)}/>
                          {travelType.name}
                        </label>
                        })}
                      </div>
                    </div>
                    <div className='col-span-3'>
                        {/* member type */}
                      <p className='font-bold'>&#10033;Member Type</p>
                      <div className='w-fit h-fit flex flex-wrap gap-1 pl-3'>
                        {memberTypes.map((memberType, i)=>{
                          return <label key={i} className='border-[1px] border-main-70 rounded-md px-3 py-1' htmlFor={memberType.id} style={memberTypeId==memberType.id?selectedStyle:unselectedStyle}>
                          <input id={memberType.id} className="hidden" type="radio" name="member-type" value={memberType.id} onChange={(e)=>changeMemberTypeId(e.target.value)}/>
                          {memberType.name}
                        </label>
                        })}
                      </div>
                    </div>
                    
                    <button className="h-8 flex items-center gap-1 absolute top-5 right-5" onClick={()=>{resetFilter()}}>
                      <Image 
                      src={'/icons/reset-30.png'}
                      width={20}
                      height={20}
                      alt="filter"/>
                      clear filter
                    </button>
                  </div>
                :null}  
            
              {/* <hr className='w-3/5 m-auto border-main-70 mt-10'/> */}
              <div ref={searchResultRef} className='sm:w-[90%] md:w-4/5 max-w-[1200px] h-fit xl:h-[calc(95%-80px)] m-auto pt-5 pb-5 flex flex-col gap-5'>
                <div className='h-[calc(100%-32px)] flex flex-wrap gap-2'>
                  {isLoading?
                  <div className='m-auto'>
                    <svg className="animate-spin h-5 w-5 mr-3 bg-main-70" viewBox="0 0 40 40"></svg>
                  </div>:
                  !isLoading&&data.length>0?
                  data.map((map, i)=>{
                    return <MapItem data={map} key={i} session={session} checkIsLogin={checkIsLogin}/>
                  })
                  :<p className='m-auto'>No result</p>
                }
                </div>
                  {data.length>0?
                      <div className='w-full h-8 flex justify-center items-center gap-1'>
                      <button className="font-bold text-xl" onClick={()=>goToPrePage()}>&larr;</button>
                    {pageArray.map((num,i)=>{
                      return <div className="w-8 h-8 rounded-full bg-neutral-dark text-main-70 text-center cursor-pointer" style={currentPageNum==num?currentNumberStyle:numberStyle} key={i} onClick={()=>goToPage(num)}><p className='w-8 h-8 leading-8 text-center' >{num}</p></div>
                    })}
                    <button className="font-bold text-xl" onClick={()=>goToNextPage()}>&rarr;</button>
                  </div>:null
                }
                
              </div>
              
            </div>
            {/* <div className='fixed bottom-20 right-40' onClick={()=>backToSearch()}>^^:-pBacktosearch</div> */}
        </div>
    </>
  )
}

export default ExplorePage