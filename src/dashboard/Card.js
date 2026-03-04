import React from "react";

const Card = ({ title, count, icon }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 rounded-xl shadow-lg flex items-center gap-4 transition-transform transform hover:scale-105 duration-300">
      <span className="text-3xl bg-gray-700 p-3 rounded-full">{icon}</span>
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-gray-300 text-sm">{count}</p>
      </div>
    </div>
  );
};

export default Card;
