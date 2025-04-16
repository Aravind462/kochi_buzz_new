'use client';

import React, { useEffect } from 'react'
import Calendar from './Calender'
import ProfileCard from './ProfileCard'
import { useUser } from '../../../providers/UserContext'
import { eventSubscriptionService } from '../../../services/eventSubscriptionServices'
import { eventServices } from '../../../services/eventServices'

const Profile = () => {
    const { user } = useUser();
    const [subbedEvents, setSubbedEvents] = React.useState([]);
    const [events, setEvents] = React.useState([]);
  
    useEffect(()=>{
      async function getUserEventSubs() {
        try {
          const data = await eventSubscriptionService.getAllSubscription({
            query: {
              filter: {
                user_id: { eq: user?.id }
              }
            }
          });
          console.log(user?.id);
          setSubbedEvents(data.map(item => item.event_id));
        } catch (error) {
          console.error("Error fetching eventSubs", error);
        }
      }
  
      if(user?.id) {
        getUserEventSubs();
      }
    }, [user]);
  
    useEffect(()=>{
      if(subbedEvents.length > 0) {
        getUserEvents();
      }
    }, [subbedEvents]);
  
  
    const getUserEvents = async () => {
      try {
        const data = await eventServices.getAllEvents({
          query: {
            filter: {
              id: { in: subbedEvents }
            }
          }
        });
        console.log(subbedEvents);
        
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    }
  
    const calendarEvents = events?.map(event => ({
      id: event.id,
      title: event.title,
      start: `${event.from_date} ${event.from_time || '00:00'}`, // Ensure time is set
      end: `${event.to_date} ${event.to_time || '00:00'}`,
      description: event.description,
    }));
  
    console.log(calendarEvents);
  
  return (
    <div className='flex flex-col items-center min-h-screen'>
      <div className='w-3/5 my-10'>
        <ProfileCard />
      </div>
      <div className='border p-10 shadow-md rounded-md mb-20 bg-white'>
        <h1 className='text-center font-semibold text-3xl mb-5'>My Calendar</h1>
        { calendarEvents.length > 0 ? <Calendar calendarEvents={calendarEvents} /> : <p className='text-center'>No events to show</p> }
      </div>
    </div>
  )
}

export default Profile