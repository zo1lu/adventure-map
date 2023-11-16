'use client'
import React, {useState, useRef} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const SignUpPage = () => {
  const router = useRouter()
  const usernameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [message, setMessage] = useState({"error":true,"content":""})
  let messageColor = message.error?"red":"rgb(85, 230, 63)"
  async function signupHandler(e:React.FormEvent){
    e.preventDefault();
    let email = emailRef.current.value
    let password = passwordRef.current.value
    let username = usernameRef.current.value
    if(!email || !password || !username){
      setMessage(()=>{
        return{"error":true,"content":"Please enter email, username and password"}
      })
      return
    }
}
  return (
    <>
        <div className='w-full h-screen flex flex-col items-center'>
            <form className="w-fit h-[400px] p-5 m-auto flex flex-col items-center" onSubmit={signupHandler} method='POST'>
                <h1 className="text-center mb-4">Signup</h1>
                <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-sky-950 rounded-md" ref={emailRef} type="email" placeholder="email" />
                <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-sky-950 rounded-md" ref={usernameRef} type="text" placeholder="username" />
                <input className="w-48 h-10 p-3 my-1 border-solid border-2 border-sky-950 rounded-md" ref={passwordRef} type="password" placeholder="password" name="password" autoComplete="on" />
                <button className="w-48 h-8 px-3 mt-4 border-solid border-2 border-sky-950" type='submit'>Sign up</button>
                <p className='w-48 text-sm  mt-3 text-center' style={{color: messageColor}}>{message.content}</p>
                <p className='text-sm text-red mt-3'>I already have account &rarr;
                <Link className='underline' href="/login"> Click here</Link></p>
                <p className='text-sm text-red mt-3'>Not interested &rarr;
                <Link className='underline' href="/"> Back Home</Link></p>
            </form>
        </div>
    </>
  )
}

export default SignUpPage