'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@repo/frontend/components/ui/input';
import { Button } from '@repo/frontend/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@repo/frontend/components/ui/select';
import { eventServices } from '../../../../../services/eventServices';
import { IEvent } from '@repo/types/lib/schema/event';
import { useRouter, useParams } from 'next/navigation';
import Map from '@repo/frontend/components/Map';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@repo/shared/lib/validationSchemas/eventValidation';
import { toast } from 'sonner';
import ButtonSpinner from '@repo/frontend/components/ButtonSpinner';

const Page = () => {
  const router = useRouter();
  const { eventId } = useParams(); // Get event ID from URL
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [eLoc, setELoc] = useState();
  const { register, handleSubmit, formState: { errors, isSubmitting }, control, setValue, watch } = useForm<IEvent>({
    resolver: zodResolver(eventSchema)
  });

  useEffect(() => {
    // Fetch existing event data
    const fetchEvent = async () => {
      try {
        const event = await eventServices.getById(eventId as string);
        console.log(event);
        
        if (event) {
          Object.keys(event).forEach((key) => {
            setValue(key as keyof IEvent, event[key as keyof IEvent]);
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, setValue]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 2) { // Trigger API call when input length is greater than 2
      try {
        // Use the full URL for the backend server running on localhost:3100
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/map/geocode?address=${encodeURIComponent(value)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MMI_API_KEY}`, // Pass the API key in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching geocode data');
        }
        const data = await response.json();
        console.log(data);
        setSuggestions(data.copResults || []); // Assuming copResults contains the results

      } catch (error) {
        console.error('Error fetching geocode data:', error);
        setSuggestions([]); // Clear suggestions on error
      }
    } else {
      setSuggestions([]); // Clear suggestions if input length is less than 3
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setValue("venue", suggestion.formattedAddress, { shouldValidate: true });
    setELoc(suggestion.eLoc);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () =>{
    setTimeout(()=>{
      setIsFocused(false);
    }, 1000);
  }

  const onSubmit = async (data: IEvent) => {
    try {
      const response = await eventServices.update(eventId as string, data);
      if (response) {
        toast.success('Event updated successfully');
        router.push(`/event/${eventId}`);
      }
    } catch (err) {
      toast.error('Error updating event');
      console.log(err);
    }
  };

  const longitude = watch("longitude");
  const latitude = watch("latitude");

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className='flex justify-center items-center'>
      <div className='w-1/2 border p-8 rounded-md shadow-md bg-white my-16'>
        <h1 className='text-center font-bold text-4xl mb-5'>Edit Event</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col text-base font-medium'>
          
          {/* Title */}
          <div className='mb-4'>
            <label className='block mb-1'>Title</label>
            <Input {...register("title", { required: "Required" })} type="text" className='w-full px-3 py-2 border rounded-md' />
            {errors.title && <p className='text-red-600 text-xs mt-2'>{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className='mb-4'>
            <label className='block mb-1'>Description</label>
            <textarea {...register("description", { required: "Required" })} rows={3} className='w-full px-3 py-2 border rounded-md'></textarea>
            {errors.description && <p className='text-red-600 text-xs'>{errors.description.message}</p>}
          </div>

          {/* From Date & Time */}
          <div className='mb-4'>
            <label className='block mb-1'>From Date & Time</label>
            <div className='flex space-x-3'>
              <Input {...register("from_date", { required: "Required" })} type="date" className='w-1/2 px-3 py-2 border rounded-md' />
              <Input {...register("from_time", { required: "Required" })} type="time" className='w-1/2 px-3 py-2 border rounded-md' />
            </div>
            <div className='flex space-x-1'>
              {errors.from_date && <p className='text-red-600 text-xs mt-2'>{ errors.from_date.message }</p>}
              {(errors.from_date && errors.from_time) && <p className='text-red-600 text-xs mt-2'>&</p>}
              {errors.from_time && <p className='text-red-600 text-xs mt-2'>{ errors.from_time.message }</p>}
            </div>
          </div>

          {/* To Date & Time */}
          <div className='mb-4'>
            <label className='block mb-1'>To Date & Time</label>
            <div className='flex space-x-3'>
              <Input {...register("to_date", { required: "Required" })} type="date" className='w-1/2 px-3 py-2 border rounded-md' />
              <Input {...register("to_time", { required: "Required" })} type="time" className='w-1/2 px-3 py-2 border rounded-md' />
            </div>
            <div className='flex space-x-1'>
              {errors.to_date && <p className='text-red-600 text-xs mt-2'>{ errors.to_date.message }</p>}
              {(errors.to_date && errors.to_time) && <p className='text-red-600 text-xs mt-2'>&</p>}
              {errors.to_time && <p className='text-red-600 text-xs mt-2'>{ errors.to_time.message }</p>}
            </div>
          </div>

          {/* Venue */}
          <div className='mb-4'>
            <label className='block mb-1'>Venue</label>
              <Input {...register("venue", { required: "Required" })} onFocus={handleFocus} onBlur={handleBlur} onChange={handleInputChange} type="text" className='w-full px-3 py-2 border rounded-md' />
            {errors.venue && <p className='text-red-600 text-xs mt-2'>{errors.venue.message}</p>}
          </div>

          {/* Display Suggestions */}
          <div className='z-10'>
            {isFocused && suggestions.length > 0 && (
              <ul className="bg-white border border-gray-300 w-full rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.formattedAddress}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Location */}
          {/* <div className='mb-4'>
            <label className='block mb-1'>Location</label>
            <Input {...register("location", { required: "Required" })} type="text" className='w-full px-3 py-2 border rounded-md' />
            {errors.location && <p className='text-red-600 text-xs mt-2'>{errors.location.message}</p>}
          </div> */}

          {/* Map */}
          <div className='my-4'>
            <label className='block mb-1'>Location</label>
            <Map eLoc={eLoc} setLatLng={({ latitude, longitude }: any) => {
                setValue("latitude", latitude);
                setValue("longitude", longitude);
              }} lat={latitude} lng={longitude} />
          </div>

          {/* Category */}
          <div className='mb-4'>
            <label className='block mb-1'>Category</label>
            <Controller 
              name="category"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full px-3 py-2 border rounded-md'>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conference & Seminars">Conference & Seminars</SelectItem>  
                    <SelectItem value="Workshops & Training">Workshops & Training</SelectItem>
                    <SelectItem value="Meetups & Networking">Meetups & Networking</SelectItem>
                    <SelectItem value="Concerts & Live Music">Concerts & Live Music</SelectItem>
                    <SelectItem value="Cultural & Festivals">Cultural & Festivals</SelectItem>
                    <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                    <SelectItem value="Exhibition & Expos">Exhibitions & Expos</SelectItem>
                    <SelectItem value="Food & Drinks">Food & Drink Events</SelectItem>
                    <SelectItem value="Theatre & Comedy">Theatre & Comedy</SelectItem>
                    <SelectItem value="Nightlife & Party">Nightlife & Parties</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className='text-red-600 text-xs mt-2'>{errors.category.message}</p>}
          </div>

          {/* Price */}
          <div className='mb-4'>
            <label className='block mb-1'>Price (₹)</label>
            <Input 
              {...register("price", { required: "Required", valueAsNumber: true, min: { value: 0, message: "Price must be positive" } })} 
              type="number" 
              className='w-full px-3 py-2 border rounded-md' 
            />
            {errors.price && <p className='text-red-600 text-xs mt-2'>{errors.price.message}</p>}
          </div>

          {/* Submit Button */}
          <div className='mt-5 flex '>
            <Button className='w-full py-2 text-base mx-2 bg-green-600' type="submit" disabled={isSubmitting}>{ isSubmitting? <ButtonSpinner /> : "Update Event" }</Button>
            <Button className='w-full py-2 text-base mx-2 bg-red-600' type='button' onClick={()=>router.push('/event/manage')}>Cancel</Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Page;
