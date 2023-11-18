'use client'
import React, {useState, useRef, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState({"error":true,"content":""})
  let messageColor = message.error?"red":"rgb(85, 230, 63)"
  async function loginHandler(e:React.FormEvent){
    e.preventDefault();
    let email = emailRef.current.value
    let password = passwordRef.current.value
    if(!email || !password){
      setMessage(()=>{
        return{"error":true,"content":"Please enter email and password"}
      })
      return
    }
  }
  
  return (
    <div className='w-full h-screen flex flex-col items-center'>
        <form className="w-fit h-[400px] p-5 m-auto flex flex-col" onSubmit={loginHandler} method='POST'>
            <h1 className="text-center mb-4">Login</h1>
            <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-sky-950 rounded-md" ref={emailRef} type="email" placeholder="email"/>
            <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-sky-950 rounded-md" ref={passwordRef} type="password" placeholder="password" autoComplete="on"/>
            <button className="w-48 h-8 px-3 mt-4 border-solid border-2 border-sky-950" >Login</button>
            <p className='text-sm text-red mt-3'>Not sign up yet?  
            <Link className='underline' href="/signup"> Click here</Link></p>
            <p className='w-48 text-sm text-red mt-3' style={{color: messageColor}}>{message.content}</p>
        </form>
    </div>
)
}

export default LoginPage