import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ProjectsHub = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    startDate: "",
    endDate: "",
    level: "",
    contactEmail: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [projects, setProjects] = useState([]);

  // Calculate total duration in days
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " days";
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.contactEmail || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields!", { position: "top-right" });
      return;
    }

    axios.post("http://localhost:5000/api/projects", formData)
      .then(({ data }) => {
        setProjects([data, ...projects]);
        toast.success("Project posted successfully! 🎉", { position: "top-right" });
        setFormData({
          title: "",
          description: "",
          technologies: "",
          startDate: "",
          endDate: "",
          level: "",
          contactEmail: "",
        });
        setIsFormVisible(false);
        // Re-fetch to reflect any server-side defaults/transformations
        axios.get("http://localhost:5000/api/projects").then(({ data: list }) => setProjects(list)).catch(() => {});
      })
      .catch(() => toast.error("Failed to post project", { position: "top-right" }));
  };

  // Handle deleting a project
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/projects/${id}`)
      .then(() => {
        setProjects(projects.filter((project) => project._id !== id));
        toast.info("Project deleted!", { position: "top-right" });
      })
      .catch(() => toast.error("Failed to delete", { position: "top-right" }));
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/projects").then(({ data }) => setProjects(data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-blue-700">🚀 Projects Hub</h2>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          {isFormVisible ? "Close Form" : "➕ Post a Project"}
        </button>
      </div>

      {/* Display Projects */}
      <div className="w-full max-w-4xl mt-8">
        <h3 className="text-2xl font-semibold text-blue-700 mb-4">Available Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 transform hover:scale-105 transition"
            >
              <h4 className="text-xl font-semibold text-gray-800">{project.title}</h4>
              <p className="text-gray-600 mt-2">{project.description}</p>
              <p className="text-gray-700"><strong>Technologies:</strong> {project.technologies}</p>
              <p className="text-gray-700"><strong>Level:</strong> {project.level}</p>
              <p className="text-gray-700"><strong>Start Date:</strong> {project.startDate}</p>
              <p className="text-gray-700"><strong>End Date:</strong> {project.endDate}</p>
              <p className="text-gray-700 font-bold"><strong>Duration:</strong> {calculateDuration(project.startDate, project.endDate)}</p>
              <button
                onClick={() => handleDelete(project._id)}
                className="mt-3 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Project Form */}
      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white p-6 mt-8 rounded-xl shadow-lg transform transition-all animate-fadeIn"
        >
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">📌 Post a New Project</h3>

          {["title", "description", "technologies", "contactEmail"].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 font-semibold capitalize">{field}</label>
              <input
                type={field === "contactEmail" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                placeholder={`Enter ${field}...`}
              />
            </div>
          ))}

          {/* Date Selection */}
          {["startDate", "endDate"].map((dateField, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 font-semibold">{dateField === "startDate" ? "Start Date" : "End Date"}</label>
              <input
                type="date"
                name={dateField}
                value={formData[dateField]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          ))}

          {/* Display Total Duration */}
          {formData.startDate && formData.endDate && (
            <p className="text-lg font-bold text-blue-700 mb-4">
              ⏳ Total Duration: {calculateDuration(formData.startDate, formData.endDate)}
            </p>
          )}

          <button
            type="submit"
            className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            🚀 Submit Project
          </button>
        </form>
      )}
    </div>
  );
};

export default ProjectsHub;
