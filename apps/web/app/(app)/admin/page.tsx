'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@repo/frontend/components/ui/button';
import { eventServices } from '../../../services/eventServices';
import { IEvent } from '@repo/types/lib/schema/event';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { notificationServices } from '../../../services/notificationServices';
import { userServices } from '../../../services/userServices';
import { INotification } from '@repo/types/lib/schema/notification';
import { reportServices } from '../../../services/reportServices';
import { IReport } from '@repo/types/lib/schema/report';

const AdminPanel: React.FC = () => {
  const router = useRouter();
  const [pendingEvents, setPendingEvents] = useState<IEvent[]>([]);
  const [reportedEvents, setReportedEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<IReport[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pending = await eventServices.getAllEvents({
          query: {
            filter: {
              status: { eq: "Pending" }
            }
          }
        });
        console.log(pending);
        
        const response = await reportServices.getAll();
        setReports(response);

        if(response.length > 0) {
          const reported = await eventServices.getAllEvents({
            query: {
              filter: {
                id: { in: response.map(report=>report.event_id) }
              }
            }
          });
          setReportedEvents(reported);
        }
        setPendingEvents(pending);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (eventId: string) => {
    try {
      const eventResponse = await eventServices.update(eventId, { status: 'Accepted' });
      const userResponse = await userServices.getAll({
        filter: {
          role: { eq: 'user' }
        }
      })
      console.log(eventResponse);
      
      if(eventResponse) {
        setPendingEvents((prev) => prev.filter((event) => event.id.toString() !== eventId));
        if (userResponse) {
          const notifications = userResponse.map((user) => ({
            user_id: user.id as number,
            event_id: Number(eventId),
            type: "New Event"
          }));
          const response = await notificationServices.bulkCreate(notifications);
          console.log(response);
        }
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async (eventId: string) => {
    try {
      await eventServices.update(eventId, { status: 'Rejected' });
      setPendingEvents((prev) => prev.filter((event) => event.id.toString() !== eventId));
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  const handleDeleteReported = async (eventId: string) => {
    try {
      await eventServices.delete(eventId);
      setReportedEvents((prev) => prev.filter((event) => event.id.toString() !== eventId));
    } catch (error) {
      console.error('Error deleting reported event:', error);
    }
  };

  if (loading) return <p className="text-center min-h-screen text-xl">Loading admin data...</p>;

  return (
    <div className="p-6 min-h-screen ">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Pending Events Section */}
      <section className="mb-10 bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Pending Events</h2>
        {pendingEvents.length === 0 ? (
          <p className="text-gray-500">No pending events</p>
        ) : (
          <div className="space-y-4">
            {pendingEvents?.map((event) => (
              <div key={event.id} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center hover:bg-gray-100 hover:cursor-pointer" onClick={()=>router.push(`/event/${event.id}`)}>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.venue} | {event.from_date.toString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button className='bg-green-600' onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(event.id.toString());
                  }}>
                    <FaCheck className="mr-2" /> Approve
                  </Button>
                  <Button className='bg-red-600' onClick={(e) => {
                    e.stopPropagation();
                    handleReject(event.id.toString())
                  }}>
                    <FaTimes className="mr-2" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reported Events Section */}
      <section className='bg-white p-5 rounded-lg shadow-md'>
        <h2 className="text-xl font-semibold mb-3">Reported Events</h2>
        {reportedEvents.length === 0 ? (
          <p className="text-gray-500">No reported events</p>
        ) : (
          <div className="space-y-4">
            {reportedEvents?.map((event) => (
              <div key={event.id} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center hover:bg-gray-200 hover:cursor-pointer" onClick={()=>router.push(`/event/${event.id}`)}>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.venue} | {event.from_date.toString()}</p>
                  {
                    reports.filter(report => report.event_id === event.id).map(report=>(
                      <p key={report.id} className="text-sm text-red-500">Reported for: {report.report}, by: {report.user_id}</p>
                    ))
                  }
                  
                </div>
                <Button className='bg-red-600' onClick={(e) =>{
                  e.stopPropagation();
                  handleDeleteReported(event.id.toString());
                  }}>
                  <FaTrash className="mr-2" /> Delete Event
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
