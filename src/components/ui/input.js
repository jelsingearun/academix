import React from "react";

export const Input = ({ name, value, onChange, placeholder }) => {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="p-2 border rounded w-full"
    />
  );
};
