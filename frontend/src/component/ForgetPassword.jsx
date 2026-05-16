import { useState } from "react";
import InputField from "./InputField";
import { GetOtp, ResendVerifyOTP, ResetPassword } from "../api/auth";

const STEPS = {
  EMAIL: "email",
  OTP: "otp",
  NEW_PASSWORD: "new_password",
  SUCCESS: "success",
};

export default function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState(""); // ✅ resetToken store ਕਰੋ

  // Step 1 — OTP ਭੇਜੋ
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email.");
    setError("");
    setLoading(true);
    try {
      await GetOtp(email);
      setStep(STEPS.OTP);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — OTP verify ਕਰੋ ਅਤੇ resetToken save ਕਰੋ
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter the OTP.");
    setError("");
    setLoading(true);
    try {
      const res = await ResendVerifyOTP({ email, otp });
      setResetToken(res.data.resetToken); // ✅ resetToken save ਕਰੋ
      setStep(STEPS.NEW_PASSWORD);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — resetToken ਨਾਲ password reset ਕਰੋ
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return setError("Please enter a new password.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    setError("");
    setLoading(true);
    try {
      // ✅ otp ਨਹੀਂ, resetToken ਭੇਜੋ
      await ResetPassword({ resetToken, newPassword });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    [STEPS.EMAIL]: "Forgot Password",
    [STEPS.OTP]: "Enter OTP",
    [STEPS.NEW_PASSWORD]: "Set New Password",
    [STEPS.SUCCESS]: "All Done!",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-8 relative animate-fade-in">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold transition-colors"
        >
          ✕
        </button>

        {step !== STEPS.SUCCESS && (
          <div className="flex justify-center gap-2 mb-6">
            {[STEPS.EMAIL, STEPS.OTP, STEPS.NEW_PASSWORD].map((s, i) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s
                    ? "w-6 bg-gray-700"
                    : [STEPS.EMAIL, STEPS.OTP, STEPS.NEW_PASSWORD].indexOf(step) > i
                    ? "w-2 bg-gray-400"
                    : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        <h2 className="text-2xl font-semibold text-gray-600 text-center mb-1">
          {stepTitles[step]}
        </h2>

        {/* Step 1: Email */}
        {step === STEPS.EMAIL && (
          <>
            <p className="text-gray-400 text-sm text-center mb-6">
              We'll send an OTP to your registered email.
            </p>
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <InputField
                label="Email"
                name="email"
                value={email}
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="btn-color btn-logo w-full mt-2 hover:scale-102 transition-all duration-300 shadow-lg"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* Step 2: OTP */}
        {step === STEPS.OTP && (
          <>
            <p className="text-gray-400 text-sm text-center mb-6">
              Check <span className="text-gray-600 font-medium">{email}</span> for your OTP.
            </p>
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <InputField
                label="OTP Code"
                name="otp"
                value={otp}
                type="text"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="btn-color btn-logo w-full mt-2 hover:scale-102 transition-all duration-300 shadow-lg"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-sm text-gray-400 hover:text-gray-700 underline text-center transition-colors"
              >
                Resend OTP
              </button>
            </form>
          </>
        )}

        {/* Step 3: New Password */}
        {step === STEPS.NEW_PASSWORD && (
          <>
            <p className="text-gray-400 text-sm text-center mb-6">
              Choose a strong new password.
            </p>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <InputField
                label="New Password"
                name="newPassword"
                value={newPassword}
                type="password"
                placeholder="New password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="btn-color btn-logo w-full mt-2 hover:scale-102 transition-all duration-300 shadow-lg"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {/* Step 4: Success */}
        {step === STEPS.SUCCESS && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="text-5xl">🎉</div>
            <p className="text-gray-500 text-sm text-center">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={onClose}
              className="btn-color btn-logo w-full mt-2 hover:scale-102 transition-all duration-300 shadow-lg"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}