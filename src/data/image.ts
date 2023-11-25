const originFilter = {
    filter:""
}
const classicFilter = {
    filter:"grayscale(2) contrast(1)"
}
const vividFilter = {
    filter:"saturate(1.2) contrast(1.3)"
}
const imageFilters = [
    {
        name:"Origin",
        style:originFilter,
        value:"origin"
    },{
        name:"Classic",
        style:classicFilter,
        value:"classic"
    },{
        name:"Vivid",
        style:vividFilter,
        value:"vivid"
    }
]

export {originFilter, classicFilter, vividFilter, imageFilters}