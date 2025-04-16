'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button} from './ui/button'
import { FaRegBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/frontend/components/ui/popover"
import { useUser } from "../../../../apps/web/providers/UserContext"
import { authService } from "../../../../apps/web/services/authServices"

const Header: React.FC = () => {
  const { user, setUser } = useUser();
  const role = user?.role;
  // const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setAccessToken(localStorage.getItem("access-token"));
  //   }
  // }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <nav className='flex justify-between px-8 py-6 items-center shadow-lg bg-white'>
        <div className='flex-1'>
          <h1>Kochi Buzz App</h1>
        </div>
        <div className='flex-1 flex justify-center text-xl items-center mt-1'>
          <Link href="/" className="px-2 text-gray-700 hover:text-black">Home</Link>
          <Link href="/explore" className="px-2 text-gray-700 hover:text-black">Explore</Link>

          {/* Only organizers and admins can see 'Add Event' */}
          {(role === "organizer" || role === "admin") && (
            <Link href="/event/add" className="px-2 text-gray-700 hover:text-black">Add Event</Link>
          )}

          {/* Only organizers and admins can see 'Manage Events' */}
          {(role === "organizer" || role === "admin") && (
            <Link href="/event/manage" className="px-2 text-gray-700 hover:text-black">Manage Events</Link>
          )}

          {/* Only admins can see 'Admin Panel' */}
          {role === "admin" && (
            <Link href="/admin" className="px-2 text-gray-700 hover:text-black">Admin Panel</Link>
          )}
        </div>
        {
          user?
          <div className='flex-1 flex justify-end items-center'>
            <FaRegBell className='me-5 text-xl' />
            <Popover>
              <PopoverTrigger><CgProfile className='text-3xl' title='Profile' /></PopoverTrigger>
              <PopoverContent className='flex flex-col w-min'>
                <Link href={'/profile'}>Profile</Link>
                <Link href={'/login'} onClick={handleLogout}>Logout</Link>
              </PopoverContent>
            </Popover>

            <Link href={'/profile'}></Link>
          </div>
          :
          <div className='flex-1 flex justify-end items-center'>
            <Link href={'/login'}><Button>Login</Button></Link>
          </div>
        }
    </nav>
  )
}

export default Header