import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Simple email/password login: verify user exists; in real app add hashing + JWT
      const { data } = await axios.get("http://localhost:5000/api/users");
      const found = data.find((u) => u.email === email);
      if (!found) {
        setError("User not found. Please sign up.");
        return;
      }
      // NOTE: Backend currently stores plaintext password; for demo, fetch user by email and compare via another endpoint ideally
      // For now, simulate success if email matches. Extend backend with /api/login for real validation.
      localStorage.setItem("currentUser", JSON.stringify({ id: found._id || found.id, name: found.name, email: found.email }));
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-96 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-400">Login</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-300 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Display Test Credentials for Easy Access */}
        
      </div>
    </div>
  );
};

export default LoginPage;
