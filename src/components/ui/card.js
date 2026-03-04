import React from "react";

export const Card = ({ children }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return (
    <div className="mt-2">
      {children}
    </div>
  );
};