import prisma from '@/service/mongodb'
import bcrypt from "bcryptjs"
import { createFirstMap, createPublicMap } from './mapModel'


const createUser = async(username:string, email:string, password:string) => {
    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data:{
                username: username,
                email: email,
                hashedPassword: hashedPassword,
            },
            select:{
                id:true,
            }
        })
        await createFirstMap(newUser.id, username)
        return {"success":true, "message":"Successfully create user"}
    }catch(e){
        console.log(e)
        return {"error":true, "message":"Something wrong when creating user"}
    }
    
}

const checkIsEmailAndUsernameExist = async(email:string, username:string) => {
    try{
        const user = await prisma.user.findMany({
            where:{
                OR:[
                    {
                        email: {
                            equals: email
                        }
                    },{
                        username: {
                            equals: username
                        }
                    }
                ]
            }
        })
        console.log(user)
        return user.length!=0 ? {"error":true, "message":"email or username already exist!"}:{"error":false, "message":"you can use this email and username"}
    }catch(e){
        return {"error":true, "message":"something wrong when checking email unigue"}
    }
}

const getUser = async(email:string, password:string) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                email: email,
            },
            select:{
                id:true,
                email: true,
                username: true,
                hashedPassword:true
            }
        })
        if(user?.hashedPassword!=null){
            const match = await bcrypt.compare(password, user?.hashedPassword)
            const authenticatedUser = {id:user.id, username:user.username, email:user.email}
            return match? authenticatedUser : null
        } 
    }catch(e){
        console.log(e)
        return null
    }
}

export{createUser, checkIsEmailAndUsernameExist, getUser}