import React from 'react'
import LogoutButton from '../logout btn/LogoutBtn'
import Link from 'next/link'
import { LuUserCircle2 } from "react-icons/lu";

function LoginNavbar() {
  return (
    <div className='w-full max-w-xs z-10 mx-auto bg-transparent backdrop-blur-md mt-20 flex gap-2 border-2 shadow-sm rounded-md mb-5 justify-center items-center p-3'>
        <div>
            <Link href="/stats" title='Stats'>
                <LuUserCircle2 size={24} className='hover:-translate-y-1 -translate-x-1 duration-200' />
            </Link>
        </div>
        <div>
            <LogoutButton />
        </div>
    </div>
  )
}

export default LoginNavbar