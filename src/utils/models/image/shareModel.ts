import { randomBytes } from "crypto";
const bucketName = process.env.BUCKET_NAME

const randomImageName = () => randomBytes(32).toString("hex")

const getPutParams = (type:string, name:string, body:Buffer) => {
    return {
        Bucket: bucketName,
        Key: `images/${type}/${name}`,
        Body: body,
        ContentType: 'image/jpg',
    }
}

const getGetParams = (type:string, name:string) => {
    return {
        Bucket: bucketName,
        Key: `images/${type}/${name}`,
    }
}

const getDeleteParams = (type:string, name:string) => {
    return {
        Bucket: bucketName,
        Key: `images/${type}/${name}`,
    }
}

export{getPutParams, getGetParams, getDeleteParams, randomImageName}