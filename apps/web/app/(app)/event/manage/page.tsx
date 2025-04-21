"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/frontend/components/ui/button";
import { useRouter } from "next/navigation";
import { IEvent } from "@repo/types/lib/schema/event";
import { eventServices } from "../../../../services/eventServices";
import { useUser } from "../../../../providers/UserContext";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"Accepted" | "Pending" | "Rejected">("Accepted");
  const [eventData, setEventData] = useState<IEvent[]>([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const data = await eventServices.getAllEvents({
                query: {
                    filter: {
                      organizer_id: { eq: user?.role === "organizer" ? user?.id : undefined },
                      status: { eq: activeTab }
                    }
                }
            });
            console.log(data);
            
            setEventData(data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    }
    fetchEvents();
  }, [activeTab]);


  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-5">
        {["Accepted", "Pending", "Rejected"].map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? "default" : "outline"}
            onClick={() => setActiveTab(status as "Accepted" | "Pending" | "Rejected")}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} Events
          </Button>
        ))}
      </div>

      {/* Events Table */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        {eventData?.length > 0 ? (
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b">
                <th className="p-3">Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {eventData?.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-100" onClick={()=>router.push(`/event/${event.id}`)}>
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{event.from_date.toString()}</td>
                  <td className="p-3">{event.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-5">No {activeTab} events found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
