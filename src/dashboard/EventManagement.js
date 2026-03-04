import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Standard Date Format: DD-MM-YYYY
};

const EventManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [events, setEvents] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    category: "",
    speakers: "",
    location: "",
    audienceLevel: "General",
    registrationLink: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast.error("Please fill in all required fields!", { position: "top-right" });
      return;
    }

    axios.post("http://localhost:5000/api/events", { ...newEvent, date: formatDate(newEvent.date) })
      .then(({ data }) => {
        setEvents([data, ...events]);
        setNewEvent({
          title: "",
          description: "",
          date: "",
          time: "",
          category: "",
          speakers: "",
          location: "",
          audienceLevel: "General",
          registrationLink: "",
        });
        setIsFormVisible(false);
        toast.success("Event posted successfully! 🎉", { position: "top-right" });
      })
      .catch(() => toast.error("Failed to post event", { position: "top-right" }));
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/events").then(({ data }) => setEvents(data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col items-center p-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-indigo-700">📅 Events</h2>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          {isFormVisible ? "Close Form" : "➕ Post an Event"}
        </button>
      </div>

      {/* Display Available Events */}
      <div className="w-full max-w-4xl mt-8">
        <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Upcoming Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 transform hover:scale-105 transition"
            >
              <h4 className="text-xl font-semibold text-gray-800">{event.title}</h4>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <p className="text-gray-700"><strong>📅 Date:</strong> {event.date}</p>
              <p className="text-gray-700"><strong>⏰ Time:</strong> {event.time}</p>
              <p className="text-gray-700"><strong>📌 Category:</strong> {event.category || "N/A"}</p>
              <p className="text-gray-700"><strong>🎤 Speakers:</strong> {event.speakers || "N/A"}</p>
              <p className="text-gray-700"><strong>📍 Location:</strong> {event.location}</p>
              <p className="text-gray-700"><strong>🎯 Audience Level:</strong> {event.audienceLevel}</p>
              {event.registrationLink && (
                <p className="text-blue-600 font-semibold">
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                    🔗 Register Here
                  </a>
                </p>
              )}
              <button
                onClick={() => toast.info(`Organizer details sent!`, { position: "top-right" })}
                className="mt-3 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                🤝 Connect with Organizer
              </button>
              <button
                onClick={() => axios.delete(`http://localhost:5000/api/events/${event._id}`).then(() => setEvents(events.filter(e => e._id !== event._id)))}
                className="mt-3 ml-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Event Posting Form */}
      {isFormVisible && (
        <div className="w-full max-w-3xl bg-white p-6 mt-8 rounded-xl shadow-lg animate-fadeIn">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4">📌 Post a New Event</h3>

          {["title", "description", "category", "speakers", "location", "registrationLink"].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 font-semibold capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
              <Input name={field} value={newEvent[field]} onChange={handleInputChange} placeholder={`Enter ${field}...`} />
            </div>
          ))}

          {/* Date & Time Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold">📅 Event Date:</label>
              <Input name="date" type="date" value={newEvent.date} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">⏰ Event Time:</label>
              <Input name="time" type="time" value={newEvent.time} onChange={handleInputChange} />
            </div>
          </div>

          {/* Audience Level */}
          <label className="block text-gray-700 font-semibold">🎯 Audience Level:</label>
          <select name="audienceLevel" value={newEvent.audienceLevel} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg mb-4">
            <option value="General">General</option>
            <option value="Beginners">Beginners</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <Button onClick={addEvent} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
            🚀 Post Event
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
