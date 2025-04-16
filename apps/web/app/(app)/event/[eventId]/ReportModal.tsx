"use client";

import React, { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportText: string) => void;
}

const reportReasons = [
  "Inappropriate Content",
  "Spam",
  "False Information",
  "Other",
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    const reportText = selectedReason === "Other" ? customReason : selectedReason;
    if (!reportText) {
      alert("Please select or enter a report reason.");
      return;
    }
    onSubmit(reportText);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Report Event</h2>
        <p className="text-gray-600 mb-2">Select a reason:</p>

        {reportReasons.map((reason) => (
          <label key={reason} className="block mb-2">
            <input
              type="radio"
              name="reportReason"
              value={reason}
              className="mr-2"
              onChange={() => setSelectedReason(reason)}
            />
            {reason}
          </label>
        ))}

        {selectedReason === "Other" && (
          <input
            type="text"
            placeholder="Enter your reason..."
            className="w-full border p-2 mt-2"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        <div className="flex justify-end mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleSubmit}>
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
