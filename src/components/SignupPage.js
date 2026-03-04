

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        displayName: name.trim(),
      };
      const currentHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
      const candidates = [
        `http://${currentHost}:5000`,
        "http://localhost:5000",
        "http://127.0.0.1:5000",
      ];
      let data;
      let lastError;
      for (const base of candidates) {
        try {
          ({ data } = await axios.post(`${base}/api/signup`, payload, {
            headers: { "Content-Type": "application/json" },
            timeout: 8000,
          }));
          break;
        } catch (errTry) {
          lastError = errTry;
        }
      }
      if (!data) throw lastError || new Error("Network Error");
      localStorage.setItem("currentUser", JSON.stringify({ id: data.user.id, name: data.user.name, email: data.user.email }));
      alert("Signup successful! 📌");
      navigate("/dashboard");
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.error || (status === 409 ? "Email already registered" : (err?.message || "Something went wrong. Please try again."));
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-96 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-400">Sign Up</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-300 font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              placeholder="Enter your name"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
