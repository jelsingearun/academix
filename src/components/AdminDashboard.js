import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentDetails from "./StudentDetails";
import ProfileSettings from "../dashboard/profilesettings"; // Reusing Student Profile Settings
import AccountManagement from "../dashboard/accountmanagement"; // Reusing Student Account Management

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activities, setActivities] = useState([]);

  // Fetch student activities (placeholder)
  useEffect(() => {
    setActivities([
      { id: 1, name: "John Doe", action: "Joined Study Group", date: "23-Mar-2025" },
      { id: 2, name: "Jane Smith", action: "Posted a Query", date: "22-Mar-2025" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h2 className="text-2xl font-extrabold text-blue-400">Admin Dashboard</h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-4 p-4">
        <button onClick={() => setActiveTab("dashboard")} className={`p-2 rounded-lg ${activeTab === "dashboard" ? "bg-blue-500" : "bg-gray-700"} text-white hover:bg-blue-600 transition`}>
          🎓 Student Management
        </button>
        <button onClick={() => setActiveTab("profile")} className={`p-2 rounded-lg ${activeTab === "profile" ? "bg-blue-500" : "bg-gray-700"} text-white hover:bg-blue-600 transition`}>
          🛠 Profile Settings
        </button>
        <button onClick={() => setActiveTab("account")} className={`p-2 rounded-lg ${activeTab === "account" ? "bg-blue-500" : "bg-gray-700"} text-white hover:bg-blue-600 transition`}>
          ⚙ Account Management
        </button>
      </div>

      {/* Display Selected Section */}
      <div className="p-6">
        {activeTab === "dashboard" && (
          <>
            <div className="p-6">
              <button
                onClick={() => navigate("/student-details")}
                className="bg-blue-500 text-white p-3 w-[200px] rounded-lg shadow-lg hover:bg-blue-600 transition"
              >
                👨‍🎓 View All Students
              </button>
            </div>

            {/* Student Activity Logs */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6 mx-4">
              <h3 className="text-xl font-bold mb-4 text-blue-400">📊 Student Activity Logs</h3>
              <table className="w-full border-collapse border border-gray-700">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="p-2 border">Student</th>
                    <th className="p-2 border">Activity</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <tr key={activity.id} className="text-center border border-gray-700">
                        <td className="p-2 border">{activity.name}</td>
                        <td className="p-2 border">{activity.action}</td>
                        <td className="p-2 border">{activity.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-4 text-gray-400">No activities recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "account" && <AccountManagement />}
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm mt-6 p-4">
        Ⓒ {new Date().getFullYear()} EduTech Admin Panel
      </div>
    </div>
  );
};

export default AdminDashboard;
