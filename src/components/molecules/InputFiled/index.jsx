import React from "react";

export const InputField = ({
  label,
  caption,
  placeholder,
  type,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4 flex flex-col items-start ">
      <label htmlFor="username" className="font-semibold mb-2">
        {label}
      </label>
      <p className="font-light text-xs mb-1">{caption}</p>
      <input
        required
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
