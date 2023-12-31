
const getCroppedImage = (imageSrc:any, crop:cropAreaPixelType, filter:filterStyleType) => {
    const dCanvas = document.createElement('canvas')
    const dCtx = dCanvas.getContext('2d')
    dCanvas.width = 500
    dCanvas.height = 400
    //add filter to context
    const image = document.createElement('img')
    image.setAttribute('src', imageSrc)
    if(dCtx!=null){
        
        dCtx.filter = filter.filter
        dCtx.fillStyle = "white"
        dCtx.fillRect(0,0,500,400)
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
        return new Promise<Blob>((resolve, reject)=>{
            dCanvas.toBlob((file)=>{
                if(file!=null){
                    resolve(file)
                }else{
                    reject(console.log("generate final image error"))
                }
                
            }, 'image/jpeg', 0.95)
        })
    }else if(dCtx==null){
        console.log("final image not generated")
       return
    }
}

const getImageBlob = (imageSrc:string) => {
    const dCanvas = document.createElement('canvas')
    const dCtx = dCanvas.getContext('2d')
    dCanvas.width = 500
    dCanvas.height = 400
    const image = document.createElement('img')
    image.setAttribute('src', imageSrc)
    dCtx?.drawImage(image,0,0,500,400)
    return new Promise<Blob>((resolve, reject)=>{
        dCanvas.toBlob((file)=>{
            if(file!=null){
                resolve(file)
            }else{
                reject(console.log("generate final image error"))
            }
            
        }, 'image/jpeg', 0.95)
    })
}

export {getCroppedImage, getImageBlob}