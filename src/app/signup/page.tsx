'use client'
import React, {useState, useRef} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';

const SignUpPage = () => {
  const { status } = useSession()
  const router = useRouter()
  const usernameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState({"error":true,"content":""})
  let messageColor = message.error?"red":"rgb(85, 230, 63)"

  const signup = (body:object) => {
    return new Promise<{success?:string,error?:string, message:string}>((resolve, reject)=>{
      fetch('/api/signup',{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(body)
      })
      .then((res)=>res.json())
      .then((result)=>{
        return resolve(result)
      })
      .catch((e)=>{
        console.log(e)
        return {"error":true,"message":e}
      })
    })
  }

  async function signupHandler(e:React.FormEvent){
    e.preventDefault();
    let email = emailRef.current!=null?emailRef.current.value:""
    let password = passwordRef.current!=null?passwordRef.current.value:""
    let username = usernameRef.current!=null?usernameRef.current.value:""
    try{
      if(!email || !password || !username){
        setMessage(()=>{
          return{"error":true,"content":"Please enter email, username and password"}
        })
        return
      }else{
        const body = {
          username: username,
          email: email,
          password: password
        }
        const result = await signup(body)
        result.success?
        setMessage(()=>{
          return{"error":false,"content":result.message}
        })
        :setMessage(()=>{
          return{"error":true,"content":result.message}
        })
      }
    }catch(e){
      console.log(e)
      setMessage(()=>{
        return{"error":true,"content":"Sign up fail, please try again!"}
      })
    }
    const form = e.target
    setTimeout(()=>{
      form.reset()
    },3000)
  }

    return (
      <>
          <div className='w-full h-screen flex flex-col items-center bg-emerald-950 justify-center relative'>
              <div className='absolute top-0 w-4/5 mx-auto h-20 flex items-center justify-between'>
                <h1 className='w-fit h-fit text-3xl text-neutral-light font-yeseva_one'>Adventue Map</h1>
                <p className='w-fit text-neutral-light text-xl'>
                <Link className='hover:underline' href="/explore">Just Explore &rarr;</Link>
                </p>
              </div>
              <h1 className='text-2xl text-neutral-light  font-prata mb-5'>Join Us</h1>
              <form className="w-fit h-[420px] p-10 flex flex-col items-center bg-white rounded-md shadow-2xl shadow-main-50 hover:shadow-none" onSubmit={signupHandler} method='POST'>
                  <h1 className="text-center mb-4">Signup</h1>
                  <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-emerald-950 rounded-md" ref={emailRef} type="email" placeholder="email" />
                  <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-emerald-950 rounded-md" ref={usernameRef} type="text" placeholder="username" />
                  <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-emerald-950 rounded-md" ref={passwordRef} type="password" placeholder="password" name="password" autoComplete="on" />
                  <button className="w-48 h-10 px-3 mt-8 text-neutral-lighter rounded-md bg-main-70" type='submit'>Sign up</button>
                  <p className='w-48 text-sm  mt-3 text-center' style={{color: messageColor}}>{message.content}</p>
                  <p className='text-sm text-red mt-3'>I already have account &rarr;
                  <Link className='underline' href="/login"> Click here</Link></p>
              </form>
          </div>
      </>
    )
  
}

export default SignUpPage