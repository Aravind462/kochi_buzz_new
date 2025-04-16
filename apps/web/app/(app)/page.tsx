'use client';

import EventCard from '@repo/frontend/components/EventCard';
import React, { useEffect, useState } from 'react'
import { IEventSubscription } from '@repo/types/lib/schema/eventSubscription';
import { eventSubscriptionService } from '../../services/eventSubscriptionServices';
import { eventServices } from '../../services/eventServices';
import { IEvent } from '@repo/types/lib/schema/event';

const HomePage: React.FC = () => {
  const [subData, setSubData] = useState<IEventSubscription[]>([]);
  const [popularEvents, setPopularEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const subscriptions = await eventSubscriptionService.getAllSubscription();
        setSubData(subscriptions);
      } catch (error) {
        console.error("Error fetching event subscriptions", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [])

  useEffect(()=>{
    const subArray = subData.map(item => item.event_id);

    async function fetchData() {
      try {
        const events = await eventServices.getAllEvents({
          query: {
            filter: {
              id: { in: subArray },
              status: { eq: "Accepted" }
            }
          }
        });
        setPopularEvents(events);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [subData])

  return (
    <div className='mx-20 mt-14 min-h-screen'>
      <h1 className='text-center text-5xl'>Welcome To Kochi Buzz</h1>
      <p className='text-center text-gray-500 italic mt-3'>"Discover events. Explore Kochi."</p>
      <div className='mt-5'>
        <p className='text-2xl font-semibold ms-2 mb-4'>Events near you</p>
        <div className='grid grid-cols-4 gap-2'>
          {
            popularEvents.map((data) => (
              <EventCard key={data.id} data={data} />
            )).slice(0, 4)
          }
        </div>
      </div>
      <div className='my-10'>
        <p className='text-2xl font-semibold ms-2 mb-4'>Trending in Kochi</p>
        <div className='grid grid-cols-4 gap-2'>
          {
            popularEvents?.map((data) => (
              <EventCard key={data.id} data={data} />
            )).slice(0, 4)
          }
        </div>
      </div>
    </div>
  )
}

export default HomePage