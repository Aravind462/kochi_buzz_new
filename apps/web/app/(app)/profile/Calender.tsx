'use client';

import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import React from 'react'
import { createViewWeek, createViewMonthGrid, viewMonthGrid, CalendarEventExternal } from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/calendar.css'
import { useRouter } from 'next/navigation';

const Calender = ({ calendarEvents }: any) => {
  const router = useRouter();
  
  const calendar = useNextCalendarApp({
    views: [
      createViewWeek(),
      createViewMonthGrid()
    ],
    defaultView: viewMonthGrid.name,
    events: calendarEvents,
    plugins: [createEventModalPlugin()],
    callbacks: {
      onDoubleClickEvent(event) {
        console.log('event clicked', event);
        router.push(`/event/${event.id}`);
      }
    }
  })

  return (
    <ScheduleXCalendar calendarApp={calendar} />
  )
}

export default Calender