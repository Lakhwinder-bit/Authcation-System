// components/AuthForm.jsx
import { useState } from "react";
import InputField from "./InputField";
import ForgotPasswordModal from "./ForgetPassword";

export default function AuthForm({
  isLogin,
  setIsLogin,
  data,
  handleChange,
  handleSubmit,
  loading,
  errors,
}) {
  const [showForgotModal, setShowForgotModal] = useState(false);

  return (
    <>
      <div
        className={`lg:w-1/2 p-6 h-full flex flex-col justify-between transition-all duration-500 ease-in-out ${
          isLogin ? "lg:translate-x-full " : "translate-x-0 "
        }`}
      >
        <div>
          <button className="btn-logo">Crextio</button>
        </div>

        <div className="px-2 flex flex-col lg:px-25">
          <h1 className="md:text-4xl text-2xl text-gray-600 font-semibold text-center">
            {isLogin ? "Welcome Back" : "Create an account"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className={`mt-6 flex flex-col gap-6 transition-all duration-500 ease-in-out ${
              isLogin ? "lg:scale-100 scale-105" : "scale-100"
            }`}
          >
            {!isLogin && (
              <InputField
                label="Full Name"
                name="username"
                value={data.username}
                type="text"
                placeholder="Enter your name"
                onChange={handleChange}
                error={errors.username}
              />
            )}

            <InputField
              label="Email"
              name="email"
              value={data.email}
              type="email"
              placeholder="Enter email"
              onChange={handleChange}
              error={errors.email}
            />

            <div className="flex flex-col gap-1">
              <InputField
                label="Password"
                name="password"
                value={data.password}
                type="password"
                placeholder="Enter password"
                onChange={handleChange}
                error={errors.password}
              />

              {/* Forgot Password link — only shown on login */}
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="self-end text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors duration-200 mt-1"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {errors.api && (
              <div className="bg-red-100 text-red-600 text-sm p-2 rounded-3xl text-center">
                {errors.api}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-color w-full btn-logo mt-2 hover:scale-102 ease-in-out transition-all duration-300 shadow-2xl"
            >
              {loading
                ? isLogin
                  ? "Signing in..."
                  : "Registering..."
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="text-center text-gray-400">
          Have an account?
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 underline text-gray-700"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </>
  );
}