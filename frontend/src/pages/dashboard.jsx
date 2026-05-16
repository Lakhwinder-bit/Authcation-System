import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GetOtp } from "../api/auth";
import gettingTime from "../utils/gettingTime";
import toast, { Toaster } from 'react-hot-toast';
import WelcomeToast from "../component/toaster/Welcometoaster";
import logo from "frontend/src/assets/image.png"
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [verified , setVerified] = useState(null)
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
  
   
    // ✅ fix 1: check savedUser not setUser
    if (!token || !savedUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(savedUser)); // ✅ user is now an object
    setVerified(JSON.parse(savedUser));

  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
   
    setUser(null);
    navigate("/logIn");
  };

  function getInitials(name) {
    if (!name) return "?";
    return name.slice(0,1).toUpperCase();
  }
// ✅ Correct
const handelOtp = async () => {
  localStorage.removeItem("user");
    try {
      setOtpLoading(true);
        const res = await GetOtp(user.email)  // 👈 pass email
        console.log(res)

        if (res) {
            navigate("OtpVerify", { state: { email: user.email } })
        }
    } catch (error) {
        alert(error.response?.data?.message || "Failed to send OTP!")
    }
     finally {
    setOtpLoading(false);
  }
}
useEffect(() => {

  let timer1;
  let timer2;

  if (verified?.verified === true) {

    timer1 = setTimeout(() => {
      WelcomeToast();
    }, 1000);

    timer2 = setTimeout(() => {
      toast.success(
        "Account verified successfully",
        {
          style: {
            fontSize: "18px",
          },
        }
      );
    }, 4000);

  } else if (verified?.verified === false) {
 timer1 = setTimeout(() => {
      WelcomeToast();
    }, 1000);
    timer2 = setTimeout(() => {
      toast.error(
        "Account verification pending...",
        {
          style: {
            fontSize: "18px",
          },
        }
      );
    }, 4000);

  }

  // Cleanup
  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };

}, [verified]);


  return (
    <div className="min-h-screen bg-[#f0f0eb]">
<div>
      <Toaster/>
    </div>
      {otpLoading && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-yellow-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium text-sm">Sending OTP...</p>
    </div>
  </div>
)}
      {/* Navbar */}
      <nav className="bg-white md:px-8 px-4 py-3 md:py-4 flex items-center justify-between border-b border-yellow-100">
        <h1 className="md:text-4xl text-2xl font-bold font-mono text-gray-800">
          Welc<span className="text-yellow-400">ome</span>
        </h1>

        {/* ✅ Avatar + Dropdown when logged in */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <>
              {/* Avatar button */}
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className=" cursor-pointer w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm hover:bg-yellow-500 transition"
              >
                {getInitials(user.username)}
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2  bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 text-wrap ">

                  {/* User info */}
                  <div className="px-4 py-2 border-b border-gray-100 text-center">
                    <p className="text-lg font-semibold text-gray-800 capitalize">{user.username}</p>
                    <p className="text-sm text-gray-400 ">{user.email}</p>
                  </div>

                  {/* Verify Account */}
                  <button
                    onClick={async() => {
                      setDropdownOpen(false);
                     await handelOtp()
                      // navigate("/OtpVerify", { state: { email: user.email } });
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition ${verified?.verified ? "hidden" : "block"}`}
                  >
                    Verify Account              
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className=" cursor-pointer w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    🚪 Logout
                  </button>

                </div>
              )}
            </>
          ) : (
            // ✅ Login button when not logged in
            <button
              onClick={() => navigate("/logIn")}
              className="btn-color md:px-4 md:py-2 px-3 py-1 text-sm text-gray-700 rounded-2xl hover:scale-102 ease-in-out transition-all duration-300 shadow-2xl"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl w-full mx-auto md:px-6 px-0">
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center flex-col text-center mt-15 gap-4 w-full">
            <h2 className="lg:text-6xl sm:text-3xl text-2xl  text-gray-400">
             {gettingTime()} <span className="md:text-5xl sm:text-3xl text-3xl font-bold text-yellow-400 capitalize">{user?.username}</span> 
            </h2>
            {
             verified?.verified ? <p className="text-yellow-400 font-bold md:text-2xl text-xl mt-1">Email is verified</p> :
               <p className="text-gray-400 md:text-2xl text-xl font-bold mt-1 text-red-300">Email is Not verified</p>
            }
            
            <p className="text-gray-400 text-xl mt-1">
              Here's your overview for today.
            </p>
           
          </div>

          <div className="w-full relative md:-top-10">
            <img src={logo} alt="hero image" />
          </div>
        </div>
      </main>

    </div>
    
  );

}