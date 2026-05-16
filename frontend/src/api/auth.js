// api/auth.js
import axios from "axios";

const BASE_URL = "https://authcation-system-backend.onrender.com/api/auth";

export const RegestionApi = async (data) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw { response: { status: res.status, data: result } };
  }
  return result;
};

export const VerifyOTP = async (data) => {
  const res = await axios.post(`${BASE_URL}/verify-email`, data);
  return res;
};

export const SignIn = async (data) => {
  const res = await axios.post(`${BASE_URL}/log-in`, data);
  return res;
};

export const GetOtp = async (email) => {
  const res = await axios.post(`${BASE_URL}/get-otp`, { email });
  return res;
};


 export const ResendVerifyOTP = async(data) =>{
  const res = await axios.post(`${BASE_URL}/verify-otp-reset`,data);
  return res;
}



// ── Forgot Password ──────────────────────────────────────────
// Sends a reset-password request with the verified OTP + new password.
// Adjust the endpoint path to match your backend route.
export const ResetPassword = async (data) => {
  const res = await axios.post(`${BASE_URL}/reset-password`, data);
  return res;
};