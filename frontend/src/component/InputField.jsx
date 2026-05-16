// components/InputField.jsx
import { useState } from "react";

export default function InputField({ label, name, value, type, placeholder, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";


  const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
 
const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);
  
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-400 font-light text-md pl-5">
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          name={name}
          value={value}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full border-0 py-3 px-5 rounded-3xl bg-white focus-visible:outline-0 ${
            error ? "ring-2 ring-red-400" : ""
          }`}
        />

        {isPassword && value.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-4 text-gray-400 text-xs font-medium tracking-wide"
          >
           {showPassword ? <EyeClosed /> : <EyeOpen />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs pl-5">{error}</p>
      )}
    </div>
  );
}