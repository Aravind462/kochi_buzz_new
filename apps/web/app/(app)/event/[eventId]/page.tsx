"use client";

import { Button, buttonVariants } from "@repo/frontend/components/ui/button";
import React, { useEffect, useState } from "react";
import { eventServices } from "../../../../services/eventServices";
import { IEvent } from "@repo/types/lib/schema/event";
import { useParams, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/frontend/components/ui/popover";
import { userServices } from "../../../../services/userServices";
import { IUser } from "@repo/types/lib/schema/user";
import { eventSubscriptionService } from "../../../../services/eventSubscriptionServices";
import { useUser } from "../../../../providers/UserContext";
import ReportModal from "./ReportModal";

const EventDetailsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.role;
  const params = useParams<{ eventId: string }>();

  const [eventData, setEventData] = useState<IEvent>();
  const [organizerData, setOrganizerData] = useState<IUser>();
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

  const getEmbedUrl = (mapsUrl: string): string | null => {
    const match = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match ? `https://www.google.com/maps?q=${match[1]},${match[2]}&output=embed` : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = await eventServices.getById(params.eventId);
        event.venue = getEmbedUrl(event.venue) || event.venue;
        setEventData(event);

        const subscriptions = await eventSubscriptionService.getAllSubscription({
          query: { filter: { event_id: { eq: params.eventId } } },
        });

        setSubscriptionStatus(subscriptions.some((sub) => sub.user_id === user?.id));
        setSubscriptionCount(subscriptions.length);

        const organizer = await userServices.getById(event.organizer_id.toString());
        setOrganizerData(organizer);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [params.eventId, user?.id]);

  const handleSubscriptionToggle = async () => {
    try {
      if (!subscriptionStatus) {
        await eventSubscriptionService.subscribe(eventData.id, user.id);
      } else {
        await eventSubscriptionService.unsubscribe(eventData.id, user.id);
      }
      setSubscriptionStatus(!subscriptionStatus);
      setSubscriptionCount((prev) => prev + (subscriptionStatus ? -1 : 1));
    } catch (error) {
      console.error("Subscription Error", error);
    }
  };

  const handleDelete = async () => {
    try {
      await eventServices.delete(eventData.id.toString());
      alert("Event deleted successfully");
      router.push("/event/manage");
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const handleReportSubmit = async (data: string) => {
    try {
      const newReport = {
        report: data,
        user_id: user.id,
      };
      // Fetch the current event data to preserve existing reports
      const event = await eventServices.getById(eventData.id.toString());
      console.log(event);
      
  
      const updatedReports = Array.isArray(event.reports) ? [...event.reports, newReport] : [newReport];

      console.log(updatedReports);
      
  
      await eventServices.update(eventData.id.toString(), { reports: updatedReports });
      alert("Report submitted successfully");
    } catch (error) {
      console.error("Error submitting report", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col w-3/5 max-w-2xl bg-white px-10 py-12 rounded-2xl shadow-2xl text-lg gap-y-6 my-20">
        <h1 className="text-center text-5xl font-bold text-gray-800 mb-6">{eventData?.title}</h1>
        <p className="text-gray-600">{eventData?.description}</p>

        <div className="flex justify-between border-b pb-2">
          <p className="font-medium text-gray-700">From:</p>
          <p className="text-gray-600">
            {eventData?.from_date
              ? `${new Date(eventData.from_date).toLocaleDateString("en-GB")} ${eventData?.from_time ? `at ${eventData.from_time}` : ""}`
              : "N/A"}
          </p>
        </div>

        <div className="flex justify-between border-b pb-2">
          <p className="font-medium text-gray-700">To:</p>
          <p className="text-gray-600">
            {eventData?.to_date
              ? `${new Date(eventData.to_date).toLocaleDateString("en-GB")} ${eventData?.to_time ? `at ${eventData.to_time}` : ""}`
              : "N/A"}
          </p>
        </div>

        <div className="flex justify-between border-b pb-2">
          <p className="font-medium text-gray-700">Location:</p>
          <p className="text-gray-600">{eventData?.location}</p>
        </div>

        {/* {eventData?.venue && (
          <div className="w-full flex justify-center my-4">
            <iframe
              className="w-full h-64 rounded-lg shadow-md"
              src={eventData.venue}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        )} */}

        <div className="flex justify-between border-b pb-2">
          <p className="font-medium text-gray-700">Expected Attendance:</p>
          <p className="text-gray-600">{subscriptionCount}</p>
        </div>

        <div className="flex justify-between border-b pb-2">
          <p className="font-medium text-gray-700">Price:</p>
          <p className="text-gray-600">{eventData?.price === 0 ? "Free" : `₹${eventData?.price}`}</p>
        </div>

        <div className="flex justify-between pb-2">
          <p className="font-medium text-gray-700">Category:</p>
          <p className="text-gray-600">{eventData?.category}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Popover>
            <PopoverTrigger className={buttonVariants({ variant: "default" })}>Organizer Info</PopoverTrigger>
            <PopoverContent className="w-max">
              <p>Name: {organizerData?.username}</p>
              <p>Email: {organizerData?.email}</p>
            </PopoverContent>
          </Popover>

          {role === "user" && (
            <Button
              className={buttonVariants({ variant: subscriptionStatus ? "destructive" : "default" })}
              onClick={handleSubscriptionToggle}
            >
              {subscriptionStatus ? "Unsubscribe" : "Subscribe"}
            </Button>
          )}

          {(role === "organizer" || role === "admin") && eventData?.status !== "Pending" && (
            <div>
              <Button className="bg-green-600 me-4 w-20" onClick={() => router.push(`/event/${eventData?.id}/edit`)}>
                Edit
              </Button>
              <Button className="bg-red-600 w-20" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>
        {
          role === "user" && (
            <Button
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => setShowReportModal(true)}
            >
              Report
            </Button>
          )
        }
        <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} onSubmit={handleReportSubmit} />
      </div>
    </div>
  );
};

export default EventDetailsPage;
