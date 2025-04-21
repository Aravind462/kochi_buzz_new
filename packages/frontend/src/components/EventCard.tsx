import React from 'react'
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { IEvent } from '@repo/types/lib/schema/event'

const EventCard: React.FC<{ data: IEvent }> = ({ data }) => {
  return (
    <Card className="flex flex-col justify-between h-full shadow-lg">
        <CardHeader className="min-h-[100px]">
            <CardTitle className="flex justify-between items-center">
                <p className="text-2xl">{data?.title}</p>
                <Badge variant="secondary" className="w-min line-clamp-2 break-words">{data?.category}</Badge>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
            <p>Date: {data?.from_date ? new Date(data.from_date).toLocaleDateString("en-GB") : "N/A"}</p>
            <p>Venue: {data?.venue}</p>
            <p>Price: {data?.price}</p>
        </CardContent>
        <CardFooter>
            <Link href={`/event/${data.id}`}>
                <Button>View Details</Button>
            </Link>
        </CardFooter>
      </Card>
  )
}

export default EventCard