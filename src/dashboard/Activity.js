import React, { useState } from "react";

const Activity = () => {
  const [collaborationRequests, setCollaborationRequests] = useState([
    {
      id: 1,
      from: "Alex Johnson",
      project: "Data Structures Project",
      status: "pending",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      from: "Sarah Wilson",
      project: "Machine Learning Study Group",
      status: "pending",
      timestamp: "1 day ago"
    }
  ]);

  const handleAcceptRequest = (requestId) => {
    setCollaborationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "accepted" }
          : req
      )
    );
  };

  const handleDeclineRequest = (requestId) => {
    setCollaborationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "declined" }
          : req
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white text-xs px-3 py-1 rounded-full font-medium";
      case "accepted":
        return "bg-gradient-to-r from-green-500 to-green-400 text-white text-xs px-3 py-1 rounded-full font-medium";
      case "declined":
        return "bg-gradient-to-r from-red-500 to-red-400 text-white text-xs px-3 py-1 rounded-full font-medium";
      default:
        return "bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-medium";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "declined":
        return "Declined";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-gray-900 bg-opacity-90 p-4 rounded-2xl shadow-lg backdrop-blur-md flex-1 w-full max-w-md overflow-y-auto">
      <div className="space-y-2">
        {collaborationRequests.map((request) => (
          <div key={request.id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg shadow-sm hover:bg-gray-700 transition duration-300">
            <span className="text-2xl">👥</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-200">Collaboration request</p>
              <p className="text-sm text-gray-400">From {request.from}</p>
              <p className="text-xs text-gray-500">{request.project}</p>
              <p className="text-xs text-gray-500">{request.timestamp}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={getStatusBadge(request.status)}>
                {getStatusText(request.status)}
              </span>
              {request.status === "pending" && (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
