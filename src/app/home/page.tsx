'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const HomePage = () => {
    const mapList = [
      {
        id:"gr001",
        title:"Sunset Magic in Santorini",
        image:"/images/mapImages/greek_santorini-sunset.jpg",
        createdTime:"December 3, 2023, 6:00 PM",
        latestEditTime:"December 3, 2023, 9:30 PM",
        country:"Greece",
        description:"Santorini's iconic white-washed buildings against the backdrop of the Aegean Sea are a sight to behold. The vibrant sunsets over the caldera painted the sky in hues of orange and pink, creating a mesmerizing atmosphere. Exploring the narrow, winding streets and indulging in local cuisine made this journey unforgettable."
      },
      {
        id:"gr002",
        title:"Tranquil Temples of Kyoto",
        image:"/images/mapImages/kyoto_temples.jpg",
        createdTime:"January 15, 2024, 10:00 AM",
        latestEditTime:"January 15, 2024, 4:45 PM",
        country:"Japan",
        description:"Kyoto's ancient temples and traditional tea houses transported me to a world of serenity. Cherry blossoms adorned the landscapes, and the delicate rituals of the Geisha added a touch of elegance. Navigating through the city's rich history and embracing its cultural heritage left me with a profound appreciation for Japan."
      },
      {
        id:"gr003",
        title:"Paradise Found in Maui",
        image:"/images/mapImages/maui_turtle.jpg",
        createdTime:"August 8, 2024, 11:30 AM",
        latestEditTime:"August 8, 2024, 6:15 PM",
        country:"United States",
        description:"Maui's diverse landscapes, from the lush rainforests of Hana to the volcanic craters of Haleakalā, offered a paradise for nature enthusiasts. Snorkeling in crystal-clear waters, relaxing on pristine beaches, and witnessing the sunrise atop Haleakalā were experiences that defined the essence of this Hawaiian gem."
      },
      {
        id:"gr004",
        title:"Vibrant Colors of Marrakech",
        image:"/images/mapImages/marrakech.jpg",
        createdTime:"May 20, 2024, 2:00 PM",
        latestEditTime:"May 20, 2024, 7:45 PM",
        country:"Morocco",
        description:"Marrakech's bustling souks, adorned with vibrant spices and textiles, created a sensory journey through Moroccan culture. The intricate architecture of the Medina, the aromatic flavors of local cuisine, and the lively atmosphere of Jemaa el-Fna square made every moment in this city a celebration of diversity and tradition."
      },
      {
        id:"gr005",
        title:"Adventure Amidst Remarkable Landscapes",
        image:"/images/mapImages/new_zealand.jpg",
        createdTime:"October 10, 2024, 9:00 AM",
        latestEditTime:"October 10, 2024, 3:30 PM",
        country:"New Zealand",
        description:"Queenstown, nestled on the shores of Lake Wakatipu, is an adventurer's paradise. From adrenaline-pumping activities like bungee jumping and skydiving to the serene beauty of Fiordland National Park, the South Island's landscapes provided a perfect blend of excitement and tranquility."
      },
    ]
    const likedMapList = [
      {
        id:"JNL001",
        title:"Exploring the Enchanting Streets of Paris",
        image:"/images/mapImages/paris_street.jpg",
        author:"Emily Thompson",
        country:"France",
        description:" Immerse yourself in the beauty of Parisian culture. From the iconic Eiffel Tower to the charming Montmartre, every corner tells a story. French pastries, art, and the Seine River create an unforgettable tapestry. A journey through the heart of romance.",
        travel_type:"Cultural Exploration",
        start_date:"November 10, 2023",
        start_time_zone:"CET (Central European Time)",
        end_date:"November 17, 2023",
        end_time_zone:"CET (Central European Time)",
        duration:168,
      },
      {
        id:"JNL002",
        title:"Lost in the Colors of Marrakech",
        image:"/images/mapImages/marrakech_colorful.jpg",
        author:"Ahmed Patel",
        country:"Morocco",
        description:"Marrakech's vibrant markets and historic medinas are a sensory delight. The hues of spices, the melody of street vendors, and the architectural wonders of the Bahia Palace make Morocco a treasure trove for the adventurous soul.",
        travel_type:"Cultural and Culinary Exploration",
        start_date:"April 5, 2024",
        start_time_zone:"GMT (Greenwich Mean Time)",
        end_date:"April 12, 2024",
        end_time_zone:"GMT (Greenwich Mean Time)",
        duration:168,
      },
      {
        id:"JJNL003",
        title:"Serenity in Kyoto's Temples",
        image:"/images/mapImages/kyoto_temples_2.jpg",
        author:"Sakura Tanaka",
        country:"Japan",
        description:"Kyoto's temples and cherry blossoms create an ethereal experience. The tranquility of Kinkaku-ji and the elegance of tea ceremonies offer a profound journey into Japan's rich cultural heritage. A poetic exploration of spirituality and beauty.",
        travel_type:"Spiritual Retreat",
        start_date:"June 15, 2024",
        start_time_zone:"JST (Japan Standard Time)",
        end_date:" June 22, 2024",
        end_time_zone:" JST (Japan Standard Time)",
        duration:168,
      },
      {
        id:"JNL004",
        title:"Adventure in New Zealand's Wilderness",
        image:"/images/mapImages/new_zealand_wilderness.jpg",
        author:"Liam Johnson",
        country:"New Zealand",
        description:"Queenstown's adrenaline-pumping activities and Fiordland's breathtaking landscapes redefine adventure. From bungee jumping to exploring Milford Sound, New Zealand's South Island offers an exhilarating escape into nature's wonders.",
        travel_type:"Adventure Expedition",
        start_date:"September 3, 2024",
        start_time_zone:"NZST (New Zealand Standard Time)",
        end_date:"September 10, 2024",
        end_time_zone:"NZST (New Zealand Standard Time)",
        duration:168,
      },
      {
        id:"JNL005",
        title:"Sunset Magic in Santorini",
        image:"/images/mapImages/greek_santorini-white.jpg",
        author:"Isabella Rossi",
        country:"Greece",
        description:"Santorini's white-washed architecture against the backdrop of the Aegean Sea creates a dreamscape. The sunsets over Oia are pure magic, painting the sky in shades of romance. A journey through the Greek islands is a symphony of beauty and relaxation.",
        travel_type:"Romantic Getaway",
        start_date:"August 20, 2024",
        start_time_zone:"EET (Eastern European Time)",
        end_date:"August 27, 2024",
        end_time_zone:"EET (Eastern European Time)",
        duration:168,
      }
    ] 
    //get user data
    const userId = '6559a34bf95550bc42c82261';
    //else redirect to login page
    const createNewMap = async() => {
      //create map in database and redirect to map page
      console.log("Creating new map...")
      const resultJson = await fetch('/api/map',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          "authorId": userId
        })
      })
      //Redirect
      console.log("Redirecting")
    }
  return (
    <div className='w-screen h-screen grid grid-cols-5'>
      
      <div className='flex flex-col gap-3 px-5 py-5'>
        <div className='text-xl col-span-1'>ADVENTURE MAP</div>
        <div>Home Page</div>
        <Link className="hover:underline" href="/explore">Explore</Link>
        <Link className="hover:underline" href="/profile">Profile</Link>
      </div>
      <div className='relative flex flex-col col-span-3 overflow-hidden'>
        <div className='h-full overflow-y-scroll my-10 px-5'>
          <div className='w-full h-fit'> 
            <h3 className='uppercase text-lg'>my maps</h3>
            {mapList.map((mapData, i)=>{
              return <div className='flex gap-3 p-3 my-2 w-full h-fit rounded-md border-2 border-black' key={i} id={mapData.id}>
                <div className='w-[150px] h-[100px] overflow-hidden rounded-md'>
                  <Image 
                    src={mapData.image}
                    width={500}
                    height={500}
                    quality={100}
                    alt={mapData.title.toLowerCase()}
                    className='w-[200px] h-[100px] object-cover'
                  />
                </div>
                
                <div className='flex items-center gap-5 px-5 w-4/5'>
                  <div className='w-4/5 flex flex-col gap-1'>
                    <h3 className='text-lg font-bold'>{mapData.title}</h3>
                    <p className='text-base'>📍{mapData.country}</p>
                    <p className='text-xs text-ellipsis overflow-hidden max-w-[500px] whitespace-nowrap'>{mapData.description}</p>
                  </div>
                  <div className='w-1/5 min-w-[240px]'>
                    <p className='text-xs text-gray-400'>Created: {mapData.createdTime}</p>
                    <p className='text-xs text-gray-400'>Latest Edit: {mapData.latestEditTime}</p>
                  </div>
                </div>
                <button>
                  <Image 
                    src='/icons/trash-can-48.png'
                    width={30}
                    height={30}
                    alt='delete_btn'
                  />
                </button>
              </div>
            })}
          </div>
          <hr className='w-full my-5 border-black border-t-[1px] border-solid'/>
          <div className='w-full h-fit'> 
            <h3 className='uppercase text-lg'>liked maps</h3>
            {likedMapList.map((mapData, i)=>{
                return <div className='flex gap-3 p-3 my-2 w-full h-fit rounded-md border-2 border-black' key={i} id={mapData.id}>
                  <div className='w-[150px] h-[100px] overflow-hidden rounded-md'>
                    <Image 
                      src={mapData.image}
                      width={500}
                      height={500}
                      quality={100}
                      alt={mapData.title.toLowerCase()}
                      className='w-[200px] h-[100px] object-cover'
                    />
                  </div>
                  
                  <div className='flex items-center gap-5 px-5 w-4/5'>
                    <div className='w-4/5 flex flex-col gap-1'>
                      <h3 className='text-lg font-bold'>{mapData.title}</h3>
                      <p className='text-base'>📍{mapData.country}</p>
                      <p className='text-xs text-gray-400'>{mapData.start_date} {mapData.start_time_zone.split(" ")[0]} &harr; {mapData.end_date} {mapData.end_time_zone.split(" ")[0]}</p>
                      <p className='text-xs text-gray-400'>{mapData.duration / 24} Days</p>
                      <p className='text-xs text-ellipsis overflow-hidden max-w-[500px] whitespace-nowrap'>{mapData.description}</p>
                    </div>
                    <div className='w-1/5 min-w-[240px]'>
                      <p className='text-xs text-gray-400'>Author: {mapData.author}</p>
                    </div>
                  </div>
                  <button onClick={()=>{}}>
                    <Image 
                      src='/icons/star-50-fill.png'
                      width={30}
                      height={30}
                      alt='delete_btn'
                    />
                  </button>
                </div>
              })}
          </div>
        </div>
      </div>
      <button className='col-span-1 absolute right-10 top-5 p-3 w-fit h-fit text-xs bg-emerald-950 text-white rounded-md'
      onClick={()=>createNewMap}>Create New</button>
      
    </div>
    
  )
}

export default HomePage