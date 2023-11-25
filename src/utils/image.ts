import { resolve } from "path"

const getCroppedImage = (imageSrc:any, crop:cropAreaPixelType) => {
    const dCanvas = document.createElement('canvas')
    const dCtx = dCanvas.getContext('2d')
    dCanvas.width = 500
    dCanvas.height = 400
    const image = document.createElement('img')
    image.setAttribute('src',imageSrc)
    // const sCanvas = document.createElement('canvas')
    // sCanvas.getContext('2d')
    // sCanvas.width = crop.width
    // sCanvas.height = crop.height
    if(dCtx!=null){
        dCtx?.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            500,
            400
        )
    }
    return new Promise((resolve, reject)=>{
        dCanvas.toBlob((file)=>{
            console.log(file)

            resolve(URL.createObjectURL(file))
            , 'image/jpeg'
        })
    })
}

export {getCroppedImage}