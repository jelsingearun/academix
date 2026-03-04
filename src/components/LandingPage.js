import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white font-sans">
      {/* Navbar */}
      <header className="bg-gray-900 shadow-md py-5">
        <div className="container mx-auto flex justify-between items-center px-8">
          <h1 className="text-2xl font-extrabold text-blue-400">EduTech</h1>
          <div>
            <button
              className="px-5 py-2 text-white border border-gray-500 rounded-lg mr-4 hover:bg-gray-700 transition duration-300"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight">
            Find Your Perfect <span className="text-blue-400">EduTech Partner</span>
          </h1>
          <p className="text-lg text-gray-300 mt-4">
            Connect with like-minded students, collaborate on projects, and excel in your academic journey through AI-powered peer matching.
          </p>
          <div className="mt-8">
            <button
              className="px-6 py-3 bg-blue-600 rounded-lg text-lg hover:bg-blue-700 transition duration-300 mr-4"
              onClick={() => navigate("/signup")}
            >
              Get Started Now
            </button>
            <button
              className="px-6 py-3 bg-gray-700 text-white border border-gray-500 rounded-lg text-lg hover:bg-gray-600 transition duration-300"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-blue-400">
            Why Choose EduTech?
          </h2>
          <p className="text-gray-300 text-center mt-4 mb-10">
            Discover the features that make our platform unique and effective.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-blue-400 text-5xl mb-4">👥</div>
              <h3 className="text-xl font-semibold">Smart Matching</h3>
              <p className="text-gray-300 mt-2">
                Our AI-powered system connects you with peers who complement your skills and learning style.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-blue-400 text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold">Study Groups</h3>
              <p className="text-gray-300 mt-2">
                Form or join study groups based on your courses and academic interests.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-blue-400 text-5xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold">Project Collaboration</h3>
              <p className="text-gray-300 mt-2">
                Find teammates for academic projects and research initiatives.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-blue-400 text-5xl mb-4">💡</div>
              <h3 className="text-xl font-semibold">Skill Enhancement</h3>
              <p className="text-gray-300 mt-2">
                Learn from peers and share your knowledge in a collaborative environment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
