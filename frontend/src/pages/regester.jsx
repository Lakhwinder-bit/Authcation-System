// pages/RegestionPage.jsx
import { useState } from "react";
import AuthForm from "../component/AuthForm";
import AuthImage from "../component/AuthImage";
import { RegestionApi, SignIn } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/validation";

export default function RegestionPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    // clear that field's error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // run validation
    const formErrors = validateForm(data, isLogin);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    let skipFinally = false;

    try {
      if (isLogin) {
        const res = await SignIn({
          email: data.email,
          password: data.password,
        });
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      } else {
        const res = await RegestionApi(data);
        console.log("Full response:", res);
        skipFinally = true;
        setTimeout(() => {
          setLoading(false);
          setIsLogin(true);
        }, 1000);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrors({ api: err?.response?.data?.message || "Something went wrong" });
    } finally {
      if (!skipFinally) setLoading(false);
    }
  };

  return (
    <main className="bg-[#a4abb6] lg:p-15 px-10 py-10 h-[100vh] flex justify-center align-center">
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-xl">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium text-sm animate-pulse">
            {isLogin ? "Signing in..." : "Creating your account..."}
          </p>
        </div>
      )}

      <div className="bg-gradient-to-t from-yellow-100 to-yellow-50 rounded-4xl lg:flex w-full">
        <AuthForm
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          data={data}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          errors={errors}
        />
        <AuthImage isLogin={isLogin} />
      </div>
    </main>
  );
}