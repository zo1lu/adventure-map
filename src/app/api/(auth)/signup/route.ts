import { checkIsEmailAndUsernameExist, createUser } from "@/utils/models/userModel"
import { NextRequest, NextResponse as res } from "next/server"

export async function POST(req:NextRequest){
    try{
        const {email, username, password} = await req.json()
        const checkResult = await checkIsEmailAndUsernameExist(email, username)
        if(checkResult.error){
            return res.json(checkResult, {status:400})
        }
        const result = await createUser(username, email, password)
        return result.success?
        res.json(result, {status: 200})
        :res.json(result, {status: 400})
    }catch(e){
        console.log(e)
        res.json({"error":true,"message":e}, {status: 500})
    }
}