import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Activity from "../dashboard/Activity";
import Peers from "../dashboard/Peers";
import Chat from "./Chat"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h2 className="text-2xl font-extrabold text-blue-400">Academix</h2>
        <button
          onClick={toggleSidebar}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition duration-300"
        >
          👤
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-56 bg-gray-800 p-4 transform ${
          sidebarVisible ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out`}
      >
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => navigate("/profile-settings")}
              className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Profile Settings
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/account-management")}
              className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Account Management
            </button>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="w-full p-2 bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {[  
          { path: "/collaborations", icon: "👥", title: "Collaborations", count: 3, color: "blue" },
          { path: "/studygroup", icon: "📖", title: "Study Groups", count: 2, color: "purple" },
          { path: "/project", icon: "🎯", title: "Projects", count: 4, color: "green" },
          { path: "/queries-written", icon: "📅", title: "Queries", count: 5, color: "red" },
          { path: "/event", icon: "📅", title: "Events", count: "Manage", color: "blue" }, // Corrected path
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center bg-${item.color}-500 text-white p-4 w-full max-w-[180px] h-auto rounded-lg shadow-lg hover:bg-${item.color}-600 transition duration-300 mx-auto`}
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="font-semibold text-sm">{item.title}</span>
            <span className="text-lg font-bold">{item.count}</span>
          </button>
        ))}
      </div>

      {/* Second Row: Activity, Peers, and Chat */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        
        {/* Activity Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg min-h-[224px] max-h-[500px] flex flex-col">
          <h2 className="text-lg font-bold mb-2">Recent Activity</h2>
          <div className="text-sm flex-grow overflow-hidden">
            <Activity />
          </div>
        </div>

        {/* Peers Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg min-h-[224px] max-h-[500px] flex flex-col">
          <h2 className="text-lg font-bold mb-2">Your Peers</h2>
          <div className="text-sm flex-grow overflow-hidden">
            <Peers />
          </div>
        </div>

        {/* Chat Section (Aligned and Fully Functional) */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg min-h-[320px] max-h-[600px] flex flex-col">
          <h2 className="text-lg font-bold mb-2">Chat</h2>
          <div className="text-sm flex-grow overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;