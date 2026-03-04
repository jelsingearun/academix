import React, { useState } from "react";

const AccountManagement = () => {
  const [twoStepVerification, setTwoStepVerification] = useState(false);
  const [multiStepVerification, setMultiStepVerification] = useState(false);
  
  const [loginSessions, setLoginSessions] = useState([
    { id: 1, device: "Windows PC", location: "New York, USA", lastLogin: "2025-02-01 10:30 AM" },
    { id: 2, device: "Android Phone", location: "Los Angeles, USA", lastLogin: "2025-02-03 8:15 PM" },
    { id: 3, device: "MacBook Pro", location: "London, UK", lastLogin: "2025-02-02 5:00 PM" },
  ]);

  const handleLogout = (id) => {
    setLoginSessions(loginSessions.filter(session => session.id !== id));
    alert("Logged out from the selected device.");
  };

  const handleLogoutAll = () => {
    setLoginSessions([]);
    alert("Logged out from all other devices.");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Account Management</h2>

      {/* Login Sessions */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Active Login Sessions</h3>
        <ul>
          {loginSessions.length > 0 ? (
            loginSessions.map((session) => (
              <li key={session.id} className="border-b py-3 flex justify-between items-center">
                <div>
                  <p className="text-gray-700"><strong>Device:</strong> {session.device}</p>
                  <p className="text-gray-500"><strong>Location:</strong> {session.location}</p>
                  <p className="text-gray-500"><strong>Last Login:</strong> {session.lastLogin}</p>
                </div>
                <button 
                  onClick={() => handleLogout(session.id)} 
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No active sessions.</p>
          )}
        </ul>
        {loginSessions.length > 1 && (
          <button 
            onClick={handleLogoutAll} 
            className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout from All Devices
          </button>
        )}
      </div>

      {/* Security Settings */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Security Settings</h3>

        {/* Two-Step Verification Toggle */}
        <div className="flex justify-between items-center border-b py-3">
          <p className="text-gray-700">Enable 2-Step Verification</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={twoStepVerification} 
              onChange={() => setTwoStepVerification(!twoStepVerification)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Multi-Step Verification Toggle */}
        <div className="flex justify-between items-center border-b py-3">
          <p className="text-gray-700">Enable Multi-Step Verification</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={multiStepVerification} 
              onChange={() => setMultiStepVerification(!multiStepVerification)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
