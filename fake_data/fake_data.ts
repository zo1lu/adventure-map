const mapInfo_fake = {
    title: "Japan Adventure",
    country: "Japan",
    region_or_district: "Shiga-ken, Kyoto Prefecture",
    location: "Japan, Kyoto",
    travel_type: "local-food",
    member_type: "friends-group",
    image: "/images/mapImages/japan_kyoto_01.jpg",
    start_time: "2023-12-10T09:00",
    start_time_zone:"+8",
    end_time: "2023-12-15T18:00",
    end_time_zone:"+8",
    duration: 105, // Duration in hours
    description: "Embarking on an unforgettable adventure to Kyoto, Japan, with my closest friends has been a dream come true. We've immersed ourselves in the rich culture and breathtaking landscapes of Kyoto Prefecture, from the serene temples and lush bamboo forests of Arashiyama to the bustling streets of Gion. The exquisite cuisine, including traditional kaiseki meals and savory street food, has tantalized our taste buds. Our days have been filled with hiking, exploring historic sites, and engaging with the local community. As the sun sets on this remarkable journey, we carry with us memories that will last a lifetime."
};

const spotInfo_fake = {
    title: "Chihkan Tower",
    spot_type: "history",
    location: [120.200125, 23.000856],
    images: ["/images/spotImages/kyoto_snack.jpg"],
    start_time: "2023-11-15T10:00",
    start_time_zone:"+8",
    end_time: "2023-11-15T12:00",
    end_time_zone:"+8",
    duration: 2, // Duration in hours
    description: "As I entered the ancient Chihkan Tower, a sense of awe washed over me. The weathered stone walls whispered stories of centuries past. With each step, I could feel the echoes of history and the spirits of those who came before. The tranquil gardens surrounding the tower offered a serene escape from the bustling city, making it a perfect place for quiet reflection and introspection. The atmosphere here was both enchanting and surreal, creating a memory I will cherish forever."
};

const routeInfo_fake = {
    id:"testRouteId",
    title:"East coast ferry trip",
    image:"",
    depart:[120.20202,24.1222],
    destination:[121.743,24.234],
    route_type:"ferry",
    descrtiption:"Embark on a mesmerizing ferry voyage from Hualien to I-Lan, Taiwan. Drift along the cerulean waters, framed by lush landscapes. As the ferry gracefully navigates, relish panoramic views of the East Rift Valley and the scenic coastline. A serene odyssey, blending natural beauty and maritime adventure, awaits on this picturesque interlude.",
    start_time:"2023-11-15T12:00",
    start_time_zone:"+8",
    end_time:"2023-11-18T12:00",
    end_time_zone:"+8",
    duration:72,
    geo_data:{}
  }
export {mapInfo_fake, spotInfo_fake, routeInfo_fake}