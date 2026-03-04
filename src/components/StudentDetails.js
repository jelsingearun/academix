import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDetails = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  // Fetch students from MongoDB
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users");
        setStudents(data.map((u) => ({
          id: u._id || u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          restricted: u.restricted,
        })));
      } catch (err) {
        console.error("Failed to load students", err);
      }
    };

    fetchStudents();
  }, []);

  // Restrict/Unrestrict a student
  const toggleRestriction = async (id, restricted) => {
    const updatedStudents = students.map((student) =>
      student.id === id ? { ...student, restricted: !restricted } : student
    );
    setStudents(updatedStudents);

    try {
      await axios.patch(`http://localhost:5000/api/users/${id}`, { restricted: !restricted });
    } catch (error) {
      console.error("Error updating user restriction:", error);
    }
  };

  // Delete a student
  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-blue-400">👨‍🎓 Student Details</h2>

      {/* Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="text-center border border-gray-700">
                  <td className="p-2 border">{student.id}</td>
                  <td className="p-2 border">{student.name || "N/A"}</td>
                  <td className="p-2 border">{student.email}</td>
                  <td className="p-2 border">{student.phone || "N/A"}</td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button
                      onClick={() => toggleRestriction(student.id, student.restricted)}
                      className={`px-3 py-1 rounded-lg text-white ${
                        student.restricted ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"
                      } transition`}
                    >
                      {student.restricted ? "✅ Unrestrict" : "🚫 Restrict"}
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-gray-400">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDetails;
