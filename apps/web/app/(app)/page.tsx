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
  const [nearbyEvents, setNearbyEvents] = useState<IEvent[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [latLng, setLatLng] = useState<{ latitude: number, longitude: number }>();

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const subscriptions = await eventSubscriptionService.getAllSubscription();

        if(subscriptions.length > 0){
          // Step 1: Count how many times each event_id appears
          const eventCountMap = new Map<number, number>();

          subscriptions.forEach((sub) => {
            const count = eventCountMap.get(sub.event_id) || 0;
            eventCountMap.set(sub.event_id, count + 1);
          });

          // Step 2: Create a Map to store one representative subscription per event_id
          const uniqueSubsMap = new Map<number, typeof subscriptions[0]>();

          subscriptions.forEach((sub) => {
            if (!uniqueSubsMap.has(sub.event_id)) {
              uniqueSubsMap.set(sub.event_id, sub);
            }
          });

          // Step 3: Convert to array and sort by event count (descending)
          const sortedUniqueSubs = [...uniqueSubsMap.values()].sort((a, b) => {
            const countA = eventCountMap.get(a.event_id) || 0;
            const countB = eventCountMap.get(b.event_id) || 0;
            return countB - countA;
          });

          // Step 4: Set the result
          setSubData(sortedUniqueSubs);
        }
      } catch (error) {
        console.error("Error fetching event subscriptions", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [])

  useEffect(()=>{
    const subArray = subData?.map(item => item.event_id);
    
    async function fetchData() {
      try {
        const primaryEvents = await eventServices.getAllEvents({
          query: {
            filter: {
              id: { in: subArray },
              status: { eq: "Accepted" }
            }
          }
        });        

        let allEvents = [...primaryEvents];

        if (primaryEvents.length < 4 && subArray.length != 0) {
          const additionalEvents = await eventServices.getAllEvents({
            filter: {
              status: { eq: "Accepted" },
              id: { nin: subArray }, // avoid duplicates
            },
            limit: 4 - primaryEvents.length, // get only the number you need
          });

          console.log(additionalEvents);
          
          
          allEvents = [...primaryEvents, ...additionalEvents];
        }
        
        setPopularEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [subData])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current location:", latitude, longitude);
          setLatLng({ latitude, longitude }); // or update your state here
        },
        (error) => {
          setLatLng({ latitude: 10.0159, longitude: 76.3419 })
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  

  useEffect(() => {
    const fetchNearbyEvents = async () => {
      try {
        const response = await eventServices.getNearbyEvents({
            latitude: latLng?.latitude,
            longitude: latLng?.longitude
        });
        setNearbyEvents(response);
      } catch(error) {
        console.error("Error while fetching nearby events", error)
      }
    }

    if(latLng) {
      fetchNearbyEvents();
    }
  }, [latLng])

  return (
    <div className='mx-20 mt-14 min-h-screen'>
      <h1 className='text-center text-5xl'>Welcome To Kochi Buzz</h1>
      <p className='text-center text-gray-500 italic mt-3'>"Discover events. Explore Kochi."</p>
      <div className='mt-5'>
        <p className='text-2xl font-semibold ms-2 mb-4'>Events near you</p>
        <div className='grid grid-cols-4 gap-2'>
          {
            nearbyEvents?.map((data) => (
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