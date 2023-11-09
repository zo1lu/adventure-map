
const getLocalDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1 < 10? "0" + ((now.getMonth() + 1).toString()):now.getMonth() + 1
    const date = now.getDate() < 10? "0" + (now.getDate().toString()) : now.getDate()
    const hour = now.getHours() < 10 ? "0" + (now.getHours().toString()) : now.getHours()
    const minute = now.getMinutes() <10 ? "0" + (now.getMinutes().toString()) : now.getMinutes()
    const localDateTime = `${year}-${month}-${date}T${hour}:${minute}`
    return localDateTime
}

const getLocalTimeZone = () => {
    const timeOffset = new Date().getTimezoneOffset()/60*(-1)
    return timeOffset>0?"+"+timeOffset.toString():timeOffset.toString()
}

const timeZoneArray = () => {
    let arr = []
    for (let i=-12; i<=12;i++){
        arr.push(i<1?i.toString():"+"+i.toString())
    }
    return arr
}

const getDurationInHour = (startTime:string, endTime:string, startTimeZone:string, endTimeZone:string) => {

    const startTimeInMs = new Date(startTime).getTime();
    const endTimeInMs = new Date(endTime).getTime(); 
    const timeZoneDifference = parseInt(endTimeZone)*(-1) - parseInt(startTimeZone)*(-1)
    const timeDifferenceInHour = ((endTimeInMs-startTimeInMs)/3600000) + timeZoneDifference
    // console.log(startTime, endTime, startTimeZone, endTimeZone)
    // console.log(startTimeInMs, endTimeInMs, timeZoneDifference)
    return timeDifferenceInHour

}

export {getLocalDateTime, getLocalTimeZone, getDurationInHour}