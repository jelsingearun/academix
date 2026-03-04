import React, { useState } from "react";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    profilePic: null, // For storing the uploaded profile picture
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, profilePic: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", profile);
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profile Settings</h2>

      {/* Profile Picture Upload */}
      <div className="mb-6 text-center">
        <label className="block font-semibold text-gray-700 mb-2">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-gray-100 file:text-blue-600 hover:file:bg-gray-200 transition"
        />
        {profile.profilePic && (
          <img
            src={URL.createObjectURL(profile.profilePic)}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full mt-3 mx-auto border-2 border-gray-300 object-cover"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-semibold text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block font-semibold text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your username"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block font-semibold text-gray-700">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Tell something about yourself"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
