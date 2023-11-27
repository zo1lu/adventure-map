import React, { ChangeEvent, createElement, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Cropper from 'react-easy-crop'
import { getCroppedImage } from '@/utils/image'
import AlertBox from '../message/AlertBox'
import { ConfirmBox } from '../message/ConfirmBox'
import { imageFilters, originFilter } from '@/data/image'
import ProcessBox from '../message/ProcessBox'
import SuccessBox from '../message/SuccessBox'
import FailBox from '../message/FailBox'

interface ImagePreviewProps {
    target:{
        type: ImageTargetType,
        id: string,
        isNew: Boolean
    },
    isShow:Boolean,
    closeImagePreview:()=>void
}

const ImagePreview = ({target, isShow, closeImagePreview}:ImagePreviewProps) => {
    const type = target.type
    const id = target.id
    const isNew = target.isNew
    const [isHidden, setIsHidden] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [pageNum, setPageNum] = useState<number>(1)
    const filterPreviewRef = useRef<HTMLCanvasElement|null>(null)
    const uploadPreviewRef = useRef<HTMLCanvasElement|null>(null)
    const imageOriginalSize = useRef({width:0, height:0})
    const [isInEditPage, setIsInEditPage] = useState(false)
    const [currentImage, setCurrentImage] = useState<any>("")
    const [imageFilter, setImageFilter] = useState<filterStyleType>(originFilter)
    const [croppedArea, setCroppedArea] = useState<cropAreaPixelType>({width:0, height:0, x:0, y:0})
    const [crop, setCrop] = useState({x:0, y:0})
    const [zoom, setZoom] = useState(1)
    const [newestImage, setNewestImage] = useState<string>("")
    const [message, setMessage] = useState({
        type:"",
        content:"",
    })
    const setCurrentPage = (num:number) => {
        setPageNum(num)
    }
    const selectImage = () => {
        if(imageInputRef.current!= null){
            imageInputRef.current.click();
        }
    }

    const zoomImage = (e:React.ChangeEvent<HTMLInputElement>) => {
        const zoomValue = parseInt(e.target.value)
        setZoom(zoomValue)
    }

    const onCropAreaChange = (croppedArea:cropAreaPercentageType, croppedAreaPixels:cropAreaPixelType) => {
        setCroppedArea(croppedAreaPixels)
        console.log(croppedAreaPixels)
        //console.log(croppedArea)
        //const croppedImg = await getCroppedImage(currentImage, croppedArea)
        //setCurrentImage(croppedImg)
    }

    const onSelectFile = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0){
            const reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.addEventListener("load",()=>{
                // setCurrentImage(reader.result)
                generateProperImage(reader.result)
            })
        }
    }
    const backToSelectPage = () => {
        //show warning
        //discard image
        setMessage(()=>{
            return {
                type:"confirm",
                content:"Do you want to discard current image?"
            }
        })
        
    }
    const forwardToModifyPage = () => {
        // if current image not selected yet show alert
        if(!currentImage){
            setMessage(()=>{
                return {
                    type:"alert",
                    content:"Select image from your folder!"
                }
            })
               
        }else{
            setNewestImage(()=>currentImage)
            setPageNum(()=>2)
        }
    }
    const backToModifyPage = () => {
        setPageNum(()=>2)
    }
    const forwardToUploadPage = () => {
        setPageNum(()=>3)
        //get cropped image and set to newest image
        //but if cropArea not change don't do it again
    }
    const switchToCropSection = () => {
        setIsInEditPage(()=>true)
    }
    const switchToFilterSection = () => {
        setIsInEditPage(()=>false)
        //get cropped image and set to newest image
        //but if cropArea not change don't do it again
    }
    const applyFilter = (filterType:string) => {
        const filterObjectArray = imageFilters.filter((type)=>{
            return type.value == filterType
        })
        setImageFilter(()=>filterObjectArray[0].style)
    }
    const uploadImage = (image:Blob) => {
        return new Promise<{data:{id:string,url:string}}>((resolve, reject)=>{
            const formData = new FormData()
            formData.append('image', image)
            formData.append('id', id)
            formData.append('type', type)
            fetch("/api/image",{
                method:isNew?"POST":"PUT",
                body:formData
            })
            .then((res)=>res.json())
            .then((result)=>{
                return result.data? resolve(result):reject()
            })
            .catch((e)=>{
                return reject(e)
            })
        })
    }
    const uploadImageHandler = async() => {
        //open generating animation
        //generate final image
        setMessage(()=>{
            return {
                type:"process",
                content:"Your Image is uploading...",
            }
        })
        try{
            let finalImage = await getCroppedImage(newestImage, croppedArea, imageFilter)  
            console.log(finalImage)
            let result = await uploadImage(finalImage)
            setMessage(()=>{
                return {
                    type:"success",
                    content:"Successfully upload image!",
                }
            })
            //close image preview page
            closeImagePreviewPage()
            //show image with return data          
            console.log(result)  
        }catch(e){
            setMessage(()=>{
                return {
                    type:"fail",
                    content:"Upload image failed, please try again!",
                }
            })
            //reset image preview page
            resetPage()
        }
        setTimeout(()=>{
            setMessage(()=>{
                return {
                    type:"",
                    content:"",
                }
            })
        },3000)
    }

    const closeMessageBox = () => {
        setMessage(()=>{
            return {
                type:"",
                content:""
            }
        })
    }
    const confirmAction = () => {
        setMessage(()=>{
            return {
                type:"",
                content:""
            }
        })
        resetPage()
    }

    const drawFilterPreviewImage = () => {
        const {width, height, x, y} = croppedArea
        const originalWidth = imageOriginalSize.current.width
        const originalHeight = imageOriginalSize.current.height
        const image = document.createElement('img')
        image.src = currentImage
        if (filterPreviewRef.current!=null){
            const filterPreviewContext = filterPreviewRef.current.getContext("2d");
            width>0?
            filterPreviewContext?.drawImage(image, x, y, width, height, 0, 0, 400, 320)
            :filterPreviewContext?.drawImage(image, 0, 0, originalWidth, originalHeight, 0, 0, 400, 320)
        }
    }
    const drawUploadPreviewImage = () => {
        const {width, height, x, y} = croppedArea
        const originalWidth = imageOriginalSize.current.width
        const originalHeight = imageOriginalSize.current.height
        const image = document.createElement('img')
        image.src = currentImage
        if (uploadPreviewRef.current!=null){
            const uploadPreviewContext = uploadPreviewRef.current.getContext("2d");
            width>0?
            uploadPreviewContext?.drawImage(image, x, y, width, height, 0, 0, 400, 320)
            :uploadPreviewContext?.drawImage(image, 0, 0, originalWidth, originalHeight, 0, 0, 400, 320)
        }
    }
    const resetPage = () => {
        setPageNum(()=>1)
        setNewestImage(()=>"")
        setCurrentImage(()=>"")
        setCroppedArea(()=>{
            return {
                width:0, 
                height:0, 
                x:0,
                y:0} 
        })
        setImageFilter(()=>originFilter)
        setIsInEditPage(()=>false)
        resetCropSetting()
    }
    const resetCropSetting = () => {
        setCrop({x:0, y:0})
        setZoom(1)
        setCroppedArea(()=>{
            return {width:0, height:0, x:0, y:0}
        })
    }
    const closeImagePreviewPage = () => {
        closeImagePreview()
        resetPage()
    }
    const generateProperImage = (imageDataUrl:any) => {
        let originalHeight
        let originalWidth
        let ratio
        const image = document.createElement("img")
        image.src = imageDataUrl
        image.onload = function(this: HTMLImageElement):any{
            originalWidth=this.width
            originalHeight=this.height
            ratio = this.width/this.height
            const newImageUrl = getNewImage(imageDataUrl, originalWidth, originalHeight, ratio)
            setCurrentImage(()=>newImageUrl)
        }
    }
    const getNewImage = (imageDataUrl:string, width:number, height:number, ratio:number) => {
        const newCanvas = document.createElement("canvas")
        const newCtx = newCanvas.getContext("2d")
        const image = document.createElement("img")
        image.src = imageDataUrl
        if(ratio<1.25){
            const newCanvasHeight = height
            const newCanvasWidth = height * 1.25
            newCanvas.setAttribute("width",newCanvasWidth.toString())
            newCanvas.setAttribute("height", newCanvasHeight.toString()) 
            imageOriginalSize.current={
                width:newCanvasWidth,
                height:newCanvasHeight
            }
            const startX = (newCanvasWidth-width)/2
            newCtx?.drawImage(image,0,0,width,height, startX,0, width, height)
            return newCanvas.toDataURL()
        }else if(ratio > 1.25){
            const newCanvasHeight = width * 0.8
            const newCanvasWidth = width 
            newCanvas.setAttribute("width",newCanvasWidth.toString())
            newCanvas.setAttribute("height", newCanvasHeight.toString()) 
            imageOriginalSize.current={
                width:newCanvasWidth,
                height:newCanvasHeight
            }
            const startY = (newCanvasHeight-height)/2
            newCtx?.drawImage(image,0,0,width,height,0, startY, width, height)
            return newCanvas.toDataURL()
        }else{
            return imageDataUrl
        }
    }

    useEffect(()=>{
        drawFilterPreviewImage()
    },[imageFilter])

    useEffect(()=>{
        if(pageNum==2&&!isInEditPage){
            drawFilterPreviewImage()
        }else if(pageNum==3){
            drawUploadPreviewImage()
        }
    },[pageNum,isInEditPage])

    
  return (
    <>
    {message.type=="alert"?<AlertBox message={message.content} closeMessageBox={closeMessageBox}/>
    :message.type=="confirm"?<ConfirmBox message={message.content} closeMessageBox={closeMessageBox} confirmAction={confirmAction} />
    :message.type=="process"?<ProcessBox title={"Uploading..."} message={message.content}/>
    :message.type=="success"?<SuccessBox message={message.content} />
    :message.type=="fail"?<FailBox message={message.content} />
    :null}
    
    <div className='w-screen h-screen bg-gray-900 bg-opacity-30 overflow-hidden absolute top-0 z-20' style={isShow?{display:"block"}:{display:"none"}}>
        <div className='w-[500px] h-[600px] absolute top-[calc(50%-300px)] left-[calc(50%-250px)] bg-white rounded-md'>
            {pageNum==1?
            <div>
                <button className="absolute top-5 left-5" onClick={()=>closeImagePreviewPage()}>
                    <Image 
                        src={"/icons/close-50.png"}
                        width={25}
                        height={25}
                        alt="close-button"
                    />
                </button>
                <button className='text-bold text-blue-800 absolute top-5 right-5' onClick={()=>forwardToModifyPage()}>NEXT</button>

                <div className='w-full h-[500px] flex flex-col justify-between items-center absolute bottom-10'>
                    
                    <div className='w-[400px] h-[320px] m-auto border-black border-2 relative overflow-hidden'>
                        {currentImage?
                            <Image
                                // style={{objectFit:'contain'}}
                                src={currentImage}
                                width={400}
                                height={320}
                                alt='test'
                            />
                            :null
                        }
                    </div>
                    <div>
                        <input ref={imageInputRef} type='file' accept="image/png, image/jpeg" className='hidden' onChange={(e)=>onSelectFile(e)}/>
                        <button className='border-black border-2 rounded-md py-2 px-5 mx-2' onClick={()=>selectImage()}>Select</button>
                    </div>
                </div>
            </div>
            
        :pageNum==2?
        <div>
            <button className="absolute top-5 left-5" onClick={()=>backToSelectPage()}>
                <Image 
                    src={"/icons/back-50.png"}
                    width={25}
                    height={25}
                    alt="back-button"
                />
            </button>
            <button className='text-bold text-blue-800 absolute top-5 right-5' onClick={()=>forwardToUploadPage()}>NEXT</button>
            
            <div className='w-full h-[500px] flex flex-col justify-end items-center absolute bottom-10'>
                {!isInEditPage?
                    <>
                        <div className='w-[400px] h-[320px] m-auto border-black border-2 relative overflow-hidden'>
                            {/* {newestImage?
                                <Image
                                    style={imageFilter}
                                    src={newestImage}
                                    width={400}
                                    height={320}
                                    alt='filter-image'
                                />
                                :null
                            } */}
                            <canvas ref={filterPreviewRef} style={imageFilter} width={400} height={320}></canvas>
                        </div>
                        <div className='w-full px-5 flex gap-5 justify-center'>
                            {imageFilters.map((filter, i)=>{
                                return <button className='w-fit h-fit' onClick={()=>applyFilter(filter.value)} key={i}>
                                <div className='w-16 h-16 rounded-md border-solid border-black border-2 overflow-hidden' >
                                    <Image
                                        className='rounded-md'
                                        style={filter.style}
                                        src={newestImage}
                                        width={60}
                                        height={60}
                                        alt='filter-image'
                                    />
                                </div>
                                <p className='text-xs mt-2'>{filter.name}</p>
                            </button>
                            })}
                        </div>
                    </>
                    :<>
                        <div className='w-[500px] h-[400px] m-auto relative overflow-hidden' style={imageFilter}>
                            <Cropper 
                                image={newestImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={5/4}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropAreaChange={onCropAreaChange}
                                style={{cropAreaStyle: {border:'black 2px solid', width:'404px',height:'324px'} }}
                            />
                        </div>
                        <input className='h-[88px]' type="range" min={1} max={5} defaultValue={1} onChange={(e)=>zoomImage(e)}/>
                    </>
                }
                
                <div className='w-full flex justify-center gap-5'>
                    <button className='py-2 px-5 mx-2 text-xl' style={isInEditPage?{textDecoration:'none'}:{textDecoration:'underline'}} onClick={()=>switchToFilterSection()}>Filter</button>
                    <button className='py-2 px-5 mx-2 text-xl' style={!isInEditPage?{textDecoration:'none'}:{textDecoration:'underline'}} onClick={()=>switchToCropSection()}>Crop</button>
                </div>
            </div>
        </div>
        :
        <div>
            <button className="absolute top-5 left-5" onClick={()=>backToModifyPage()}>
                <Image 
                    src={"/icons/back-50.png"}
                    width={25}
                    height={25}
                    alt="back-button"
                />
            </button>
            <button className="absolute top-5 right-5" onClick={()=>closeImagePreviewPage()}>
                    <Image 
                        src={"/icons/close-50.png"}
                        width={25}
                        height={25}
                        alt="close-button"
                    />
            </button>
            <div className='w-full h-[500px] flex flex-col justify-end items-center absolute bottom-10'>
                <div className='w-[400px] h-[320px] m-auto border-black border-2 relative overflow-hidden'>
                    {/* {newestImage?
                        <Image
                            style={imageFilter}
                            src={newestImage}
                            width={400}
                            height={320}
                            alt='test'
                        />
                        :null
                    } */}
                    <canvas ref={uploadPreviewRef} style={imageFilter} width={400} height={320}></canvas>
                </div>
                <div>
                    <button className='border-black border-2 rounded-md py-2 px-5 mx-2' onClick={()=>uploadImageHandler()}>{isNew?"Upload":"Update"}</button>
                </div>
            </div>
        </div>}
            
            
        </div>
    </div>
    </>
    
  )
}

export default ImagePreview