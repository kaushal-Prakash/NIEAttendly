'use client'
import LogoutButton from '../logout btn/LogoutBtn'
import Link from 'next/link'
import { LuUserCircle2 } from "react-icons/lu";
import gsap from 'gsap';
import { useEffect } from 'react';

function LoginNavbar() {

  useEffect(()=>{
    const t1 = gsap.timeline();
    t1.fromTo(".login-nav-container",
      {opacity:0,y:50},
      {opacity:1,y:0,duration:1}
    ).fromTo(".login-nav-optn",
      {opacity:0,x:-20,perspective:300},
      {opacity:1,x:0,perspective:0,stagger:0.3}
    )
  },[])

  return (
    <div className='w-full login-nav-container max-w-xs z-10 mx-auto bg-transparent backdrop-blur-md mt-20 flex gap-2 border-2 shadow-sm rounded-md mb-5 justify-center items-center p-3'>
        <div className='login-nav-optn'>
            <Link href="/stats" title='Stats'>
                <LuUserCircle2 size={24} className='hover:-translate-y-1 -translate-x-1 duration-200' />
            </Link>
        </div>
        <div className='login-nav-optn'>
            <LogoutButton />
        </div>
    </div>
  )
}

export default LoginNavbar