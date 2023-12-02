'use client'
import React, {useState, useRef, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

const LoginPage = () => {
  const router = useRouter()
  const { status } = useSession()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState({"error":true,"content":""})
  let messageColor = message.error?"red":"rgb(85, 230, 63)"


  async function loginHandler(e:React.FormEvent){
    e.preventDefault();
    let email = emailRef.current!=null?emailRef.current.value:""
    let password = passwordRef.current!=null?passwordRef.current.value:""
    try{
      if(!email || !password){
        setMessage(()=>{
          return{"error":true,"content":"Please enter email and password"}
        })
        return
      }else{
        const res = await signIn('credentials',{
          email, password, redirect:false
        })
        if (res!=null && res.error){
          setMessage(()=>{
            return{"error":true,"content":"Invalid Credential"}
          })
          return
        }
        router.replace('/home');
      }
    }catch(e){
      setMessage(()=>{
        return{"error":true,"content":"Something wrong, please try again!"}
      })
    }
  }
  if(status=="unauthenticated"){
    return (
      <>
          <div className='w-full h-screen flex flex-col items-center bg-emerald-950 justify-center relative'>
              <div className='absolute top-0 w-4/5 mx-auto h-20 flex items-center justify-between'>
                <h1 className='w-fit h-fit text-3xl text-neutral-light font-yeseva_one'>Adventue Map</h1>
                <p className='w-fit text-neutral-light text-xl'>
                <Link className='hover:underline' href="/explore">Just Explore &rarr;</Link>
                </p>
              </div>
              <h1 className='text-2xl text-[#fdfdf4] font-prata mb-5'>Let&#39;s get started!</h1>
              <form className="w-fit h-[380px] p-10 flex flex-col items-center bg-white rounded-md shadow-2xl shadow-main-50 hover:shadow-none" onSubmit={loginHandler} method='POST'>
                  <h1 className="text-center mb-4">Login</h1>
                  <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-emerald-950 rounded-md" ref={emailRef} type="email" placeholder="email" />
                  <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-emerald-950 rounded-md" ref={passwordRef} type="password" placeholder="password" name="password" autoComplete="on" />
                  <button className="w-48 h-10 px-3 mt-8 text-neutral-lighter rounded-md bg-main-70" type='submit'>Login</button>
                  <p className='w-48 text-sm  mt-3 text-center' style={{color: messageColor}}>{message.content}</p>
                  <p className='text-sm text-red mt-3'>I don&#39;t have account &rarr;
                  <Link className='underline' href="/signup"> Click here</Link></p>
                  
              </form>
          </div>
      </>
  )
  }else{
    router.replace("/home")
  }
  
}

export default LoginPage