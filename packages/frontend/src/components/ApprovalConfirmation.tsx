import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { FaCheck, FaTimes } from "react-icons/fa";

const ApprovalConfirmation = ({ data, handleEvent, event_id }: any) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {data === "Approve" ? (
          <Button className="bg-green-600">
            <FaCheck className="mr-2" /> Approve
          </Button>
        ) : (
          <Button className="bg-red-600">
            <FaTimes className="mr-2" /> Reject
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {data === "Approve" ? (
            <AlertDialogAction
              className="bg-green-600"
              onClick={() => handleEvent(event_id.toString())}
            >
              Approve
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              className="bg-red-600"
              onClick={() => handleEvent(event_id.toString())}
            >
              Reject
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApprovalConfirmation;
