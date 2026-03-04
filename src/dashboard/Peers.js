import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

// Encode user skills and interests into a feature vector
const encodeUser = (user, allSkills, allInterests) => {
  const skillVector = allSkills.map((skill) =>
    user.skills.includes(skill) ? 1 : 0
  );
  const interestVector = allInterests.map((interest) =>
    user.interests.includes(interest) ? 1 : 0
  );
  return tf.tensor1d([...skillVector, ...interestVector]);
};

// Compute cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = tf.sum(tf.mul(vecA, vecB)).dataSync()[0];
  const normA = tf.norm(vecA).dataSync()[0];
  const normB = tf.norm(vecB).dataSync()[0];
  return dotProduct / (normA * normB);
};

// Compute Jaccard similarity for interests
const jaccardSimilarity = (setA, setB) => {
  const intersection = setA.filter((value) => setB.includes(value)).length;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
};

// Recommend peers based on similarity
const recommendPeers = (currentUser, users) => {
  const allSkills = [...new Set(users.flatMap((user) => user.skills))];
  const allInterests = [...new Set(users.flatMap((user) => user.interests))];
  const currentUserVector = encodeUser(currentUser, allSkills, allInterests);

  return users
    .filter((user) => user.id !== currentUser.id) // Exclude self
    .map((user) => {
      const userVector = encodeUser(user, allSkills, allInterests);
      const skillSimilarity = cosineSimilarity(currentUserVector, userVector);
      const interestSimilarity = jaccardSimilarity(
        currentUser.interests,
        user.interests
      );

      // Weighted scoring: 70% Skills + 30% Interests
      const finalScore = 0.7 * skillSimilarity + 0.3 * interestSimilarity;
      return { ...user, similarity: finalScore };
    })
    .sort((a, b) => b.similarity - a.similarity) // Sort by highest similarity
    .slice(0, 5); // Get top 5 recommendations
};

const Peers = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [recommendedPeers, setRecommendedPeers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users and current user from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users"); // Replace with your API
        setUsers(response.data);
        const user = response.data.find((u) => u.id === currentUserId);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  // Compute recommendations when data is loaded
  useEffect(() => {
    if (currentUser && users.length > 0) {
      const recommendations = recommendPeers(currentUser, users);
      setRecommendedPeers(recommendations);
    }
  }, [currentUser, users]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex-1 overflow-y-auto">
      <h3 className="text-lg font-bold mb-3 text-gray-800">Recommended Connections</h3>
      {loading ? (
        <p className="text-gray-500">Loading recommendations...</p>
      ) : recommendedPeers.length > 0 ? (
        recommendedPeers.map((peer) => (
          <div key={peer.id} className="flex items-center gap-4 border-b p-3">
            <img
              src={peer.profilePicture || "https://via.placeholder.com/50"}
              alt="Profile"
              className="rounded-full w-12 h-12 object-cover border-2 border-gray-300"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-700">{peer.name}</p>
              <p className="text-sm text-gray-500">
                Skills: {peer.skills.join(", ")}
              </p>
              <p className="text-sm text-gray-500">
                Interests: {peer.interests.join(", ")}
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Connect
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No recommendations available</p>
      )}
    </div>
  );
};

export default Peers;
