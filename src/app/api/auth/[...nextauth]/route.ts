
import NextAuth from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { getUser } from "@/utils/models/userModel";

const authOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{},
            async authorize(credentials){
                const {email, password} = credentials
                try{
                    const user = await getUser(email, password)
                    return user
                }catch(e){
                    return null
                }
            }
        })
    ],
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn:"/login"
    },
    callbacks:{
        async jwt({ token, user, account }) {
            if(user && account){
                token.name = user.username
            }
            return token
        },
        async session({session, token}){
            session.user.id = token.sub
            return session
        },
    }
}
const handler = NextAuth(authOptions)
  
export { handler as GET, handler as POST , authOptions}