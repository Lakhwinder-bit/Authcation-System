import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerifyOTP } from "../api/auth"; // ✅ your api file

export default function OtpVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email; // ✅ get email from registration

  // ✅ Step 3: Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ✅ Step 4: Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Step 5: Handle verify
const handleVerify = async () => {
    const otpString = otp.join("");
    // console.log("Email:", email);
    // console.log("OTP:", otpString);

    if (otpString.length < 6) {
      setError("Please enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await VerifyOTP({ email, otp: otpString });
      // console.log("Full Response:", res.data); // 👈 check what comes back
      
      // ✅ Fix: save verified and navigate
      if (res) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
        
        navigate("/"); // ✅ go to home
      } else {
        setError("Verification failed. Try again.");
      }

    } catch (err) {
      console.log("Error:", err.response?.data);
      setError(err.response?.data?.message || "Wrong OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main>
        <section className="main-section">
          <section className="bg-[#a4abb6] lg:p-15 px-5 py-5  h-[100vh] flex justify-center align-center">
            <div className="bg-gradient-to-t from-yellow-100 to-yellow-50 rounded-4xl">
              <div className="lg:flex w-full h-full">

                {/* FORM PANEL */}
                <div className="lg:w-1/2  p-6 h-full flex flex-col justify-between  ">
                  <div>
                    <button className="btn-logo">Crextio</button>
                  </div>

                  <div className="px-2  flex flex-col lg:px-25">
                    <div className="flex items-center flex-col gap-1 mb-6">
                      <h1 className="text-4xl text-gray-600 font-semibold">
                        Enter OTP
                      </h1>
                      <h3 className="text-md text-gray-500 text-center mt-1">
                        We sent a 6-digit code to
                      </h3>
                      {/* ✅ Show email */}
                      <p className="text-yellow-600 font-medium">{email}</p>
                    </div>

                    <div className="flex flex-col gap-3 mb-6">
                      <label className="text-gray-400 font-light text-md pl-1">
                        Enter OTP
                      </label>
                      <div className="flex justify-between gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <input
                            key={i}
                            ref={(el) => (inputRefs.current[i] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otp[i]}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className="w-full lg:h-14 h-10 text-center lg:text-2xl text-xl font-bold border-0 rounded-2xl bg-white focus-visible:outline-2 focus-visible:outline-yellow-400 transition-all duration-200"
                          />
                        ))}
                      </div>
                    </div>

                    {/* ✅ Show error */}
                    {error && (
                      <p className="text-red-500 text-sm text-center mb-2">
                        {error}
                      </p>
                    )}

                    {/* ✅ Verify button */}
                    <button
                      onClick={handleVerify}
                      className="btn-color w-full lg:text-lg text-sm py-2 rounded-4xl  mt-2 hover:scale-102 ease-in-out transition-all duration-300 shadow-2xl"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>

                
                  </div>
                      <div className="text-center text-sm text-gray-400">
                      Wrong email?{" "}
                      <a href="/" className="underline text-gray-700">
                        Go back
                      </a>
                    </div>
                </div>

                {/* IMAGE PANEL */}
                <div className="lg:w-1/2 lg:block hidden h-full">
                  <img
                    className="w-full h-full object-cover opacity-70 rounded-3xl"
                    src="https://images.unsplash.com/photo-1607000975574-0b425df6975a?q=80&w=1074&auto=format&fit=crop"
                    alt="logo-image"
                  />
                </div>

              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}