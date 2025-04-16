import { Button } from '@repo/frontend/components/ui/button';
import { Checkbox } from '@repo/frontend/components/ui/checkbox';
import { Input } from '@repo/frontend/components/ui/input';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@repo/frontend/components/ui/select';

export interface Filter {
    category?: string[];
    date?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
}

interface SidebarProps {
    setFilter: (filters: Filter) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setFilter }) => {
    const { register, handleSubmit, control, reset, watch } = useForm<Filter>({
        defaultValues: {
            category: [],
            date: '',
            location: '',
            minPrice: 0,
            maxPrice: 10000
        }
    });

    const categoryOptions = [
        "Conference & Seminars", "Workshops & Training", "Meetups & Networking", "Concerts & Live Music",
        "Cultural & Festivals", "Sports & Fitness", "Exhibitions & Expos", "Food & Drink Events",
        "Theatre & Comedy", "Nightlife & Parties"
    ];
    
    const locationOptions = [
        "Kakkanad", "Edappally", "Vyttila", "Kadavanthra", "Fort Kochi", "Marine Drive", "Palarivattom",
        "MG Road", "Panampilly Nagar", "Thevara", "Thrippunithura", "Aluva"
    ];

    const onSubmit = (data: Filter) => {
        console.log("Applied Filters:", data);
        setFilter(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-max mt-5 px-10'>
            {/* Category */}
            <div>
                <h1 className='font-semibold text-xl'>Category</h1>
                <div className='mt-2 ms-1'>
                    {categoryOptions.map((item) => (
                        <Controller
                            key={item}
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <div className='flex items-center'>
                                    <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                            const updatedCategories = checked
                                                ? [...(field.value || []), item]
                                                : field.value?.filter((val) => val !== item);
                                            field.onChange(updatedCategories);
                                        }}
                                    />
                                    <label className='ms-2'>{item}</label>
                                </div>
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Date */}
            <div className='mt-5'>
                <h1 className='font-semibold text-xl'>Date</h1>
                <div className='mt-2 ms-1'>
                    <Input type="date" {...register("date")} />
                </div>
            </div>

            {/* Location */}
            <div className='mt-5'>
                <h1 className='font-semibold text-xl'>Location</h1>
                <div className='mt-2 ms-1'>
                    <Controller 
                        name="location" 
                        control={control} 
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="location" className='font-normal'>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locationOptions.map((loc) => (
                                        <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className='mt-5'>
                <h1 className='font-semibold text-xl'>Price</h1>
                <div className='flex mt-2 ms-1'>
                    <Input type='number' {...register("minPrice")} placeholder='Min' />
                    <p className='p-1'>-</p>
                    <Input type='number' {...register("maxPrice")} placeholder='Max' />
                </div>
            </div>

            {/* Buttons */}
            <Button type='submit' className='mt-5'>Apply Filters</Button>
            <Button type='button' className='mt-5' onClick={() =>{
                reset();
                handleSubmit(onSubmit)();
            }}>Reset</Button>
        </form>
    );
}

export default Sidebar;
