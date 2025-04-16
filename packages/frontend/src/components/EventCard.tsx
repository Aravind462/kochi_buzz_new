import React from 'react'
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { IEvent } from '@repo/types/lib/schema/event'

const EventCard: React.FC<{ data: IEvent }> = ({ data }) => {
  return (
    <Card className='shadow-lg'>
        <CardHeader>
            <CardTitle className='flex justify-between items-center'>
                <p className='text-2xl'>{data?.title}</p>
                <Badge variant="secondary">{data?.category}</Badge>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p>Date: {data?.date ? new Date(data.date).toLocaleDateString("en-GB") : "N/A"}</p>
            <p>Venue: {data?.location}</p>
            <p>Price: {data?.price}</p>
        </CardContent>
        <CardFooter>
            <Link href={`/event/${data.id}`}><Button>View Details</Button></Link>
        </CardFooter>
    </Card>
  )
}

export default EventCard