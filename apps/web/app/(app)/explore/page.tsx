'use client';

import { Button } from '@repo/frontend/components/ui/button'
import { Input } from '@repo/frontend/components/ui/input'
import React, { useEffect, useState } from 'react'
import Sidebar, { Filter } from './Sidebar'
import EventCard from '@repo/frontend/components/EventCard'
import { IEvent } from '@repo/types/lib/schema/event'
import { eventServices } from '../../../services/eventServices'
import { FaSearch } from "react-icons/fa";

const page: React.FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const [events, setEvents] = useState<IEvent[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const data = await eventServices.getAllEvents({
        query: {
          filter: {
            title: { contains: search },
            category: filter.category?{ in: filter.category }: undefined,
            from_date: filter.date?{ eq: filter.date }: undefined,
            venue: filter.location?{ contains: filter.location }: undefined,
            price: (filter.minPrice || filter.maxPrice)?{
              gte: filter.minPrice,
              lte: filter.maxPrice,
            }: undefined,
            status: { eq: 'Accepted' }
          }
        }
      });
      console.log(data);
      
      setEvents(data);
    } catch (err) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex mt-10 min-h-screen'>
      <div className='w-1/4 mx-5 p-5'>
        <Sidebar setFilter={setFilter} />
      </div>
      <div className='w-3/4 flex-grow me-10'>
        <div className='flex items-center mx-10'>
          <Input value={search} onChange={(e)=>setSearch(e.target.value)} type='text' placeholder='Search events' className='me-1 p-6 bg-white' />
          <Button onClick={fetchEvents} className='ms-1 p-6'><FaSearch /></Button>
        </div>
        <div className='grid grid-cols-4 gap-3 mt-10'>
          {
            events?.map((event) => (
              <EventCard key={event.id} data={event} />
            )).slice(0,40)
          }
        </div>
      </div>
    </div>
  )
}

export default page