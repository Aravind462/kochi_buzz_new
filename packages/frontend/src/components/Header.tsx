'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button} from './ui/button'
import { FaRegBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/frontend/components/ui/popover"
import { useUser } from "../../../../apps/web/providers/UserContext"
import { authService } from "../../../../apps/web/services/authServices"
import { useRouter } from 'next/navigation'
import { notificationServices } from '../../../../apps/web/services/notificationServices';
import { eventServices } from '../../../../apps/web/services/eventServices';
import { INotification } from '@repo/types/lib/schema/notification';

interface INotificationWithEventTitle extends INotification {
  event_title?: string;
}

const Header: React.FC = () => {
  const [notifications, setNotifications] = useState<INotificationWithEventTitle[]>();
  const { user, setUser } = useUser();
  const router = useRouter();
  const role = user?.role;
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationServices.getAll({
          filter: {
            user_id: { eq : user?.id },
            is_read: { eq : false }
          }
        });

        if(response.length > 0) {
          const events = await fetchEventDetails(response.map(item => item.event_id));
          if(events?.length as number > 0) {
            const updatedNotifications = response?.map(notification => {
              const event = events?.find(event => event.id === notification.event_id);
              return {
                ...notification,
                event_title: event?.title
              };
            });
            setNotifications(updatedNotifications as INotificationWithEventTitle[]);
          }
        }
      } catch (error) {
        console.error(error)
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchEventDetails = async (eventId: number[]) => {
    try {
      const response = await eventServices.getAllEvents({
        query: {
          filter: {
            id: { in : eventId }
          }
        }
      });
      return response;
    } catch (error) {
      console.error(error)
    }
  }

  const updateNotificationstatus = async (data: INotificationWithEventTitle) => {
    try {
      const response = await notificationServices.update(data?.id?.toString() as string, { is_read: true });
      if(response) {
        const updatedNotifications = notifications?.filter(notification => notification.event_id !== data.event_id);
        setNotifications(updatedNotifications as INotificationWithEventTitle[]);
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleNotificationClick = (data: INotificationWithEventTitle) => {
    setPopoverOpen(false);
    router.push(`/event/${data?.event_id}`);
    updateNotificationstatus(data);
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <nav className='flex justify-between px-8 py-6 items-center shadow-lg bg-white h-min'>
      <div>
        <img src="https://cdn-icons-png.flaticon.com/128/16462/16462118.png" className='w-14 ms-5' alt="" />
      </div>
      <div className='flex justify-center text-xl items-center mt-1'>
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
        <div className='flex justify-end items-center'>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
              <FaRegBell className='me-5 text-xl' onClick={() => setPopoverOpen((prev) => !prev)} />
              {
                notifications? notifications?.length > 0 &&
                <span className="absolute top-11 right-20 block h-2 w-2 rounded-full bg-red-500" />
                : <div></div>
              }
            </PopoverTrigger>
            <PopoverContent className='w-72 me-16 mt-2'>
              {
                notifications? notifications?.length > 0 ?
                <div>
                  <h1 className='text-lg m-1 mb-2'>Notifications</h1>
                  {
                    notifications?.map(item=>(
                      <div
                        key={item.id}
                        className='flex justify-between items-center px-2 py-2 hover:bg-gray-200 rounded-md cursor-pointer'
                        onClick={()=>handleNotificationClick(item)}
                      >
                        <p>{item.type}</p>
                        <p>{item.event_title}</p>
                      </div>
                    ))
                  }
                </div>
                : <p>No new notifications</p>
                : <p>No new notifications</p>
              }
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <CgProfile className='text-3xl' title='Profile' />
            </PopoverTrigger>
            <PopoverContent className='flex flex-col w-min text-gray-700 me-3 mt-1'>
              <Link href={'/profile'} className='hover:text-black'>Profile</Link>
              <Link href={'/login'} className='hover:text-black' onClick={handleLogout}>Logout</Link>
            </PopoverContent>
          </Popover>
          <Link href={'/profile'}></Link>
        </div>
        :
        <div className='flex justify-end items-center'>
          <Link href={'/login'}><Button>Login</Button></Link>
        </div>
      }
    </nav>
  )
}

export default Header