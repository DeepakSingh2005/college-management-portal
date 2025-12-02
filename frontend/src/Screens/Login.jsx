import React, { useState, useEffect } from "react";
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import CustomButton from "../components/CustomButton";
import axiosWrapper from "../utils/AxiosWrapper";
const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const LoginForm = ({ selected, onSubmit, formData, setFormData, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
  <form
      className="w-full p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 animate-fade-in"
    onSubmit={onSubmit}
  >
    <div className="mb-6">
      <label
          className="block text-gray-700 text-sm font-semibold mb-2"
        htmlFor="email"
      >
        {selected} Email
      </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="h-5 w-5 text-gray-400" />
          </div>
      <input
        type="email"
        id="email"
        required
            className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
        </div>
    </div>
    <div className="mb-6">
      <label
          className="block text-gray-700 text-sm font-semibold mb-2"
        htmlFor="password"
      >
        Password
      </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
      <input
            type={showPassword ? "text" : "password"}
        id="password"
        required
            className="w-full pl-10 pr-12 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
    </div>
    <div className="flex items-center justify-between mb-6">
      <Link
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        to="/forget-password"
      >
        Forgot Password?
      </Link>
    </div>
    <CustomButton
      type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </>
        ) : (
          <>
      Login
      <FiLogIn className="text-lg" />
          </>
        )}
    </CustomButton>
  </form>
);
};

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="flex justify-center gap-4 mb-8">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
          selected === type
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
            : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md border border-gray-200"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(USER_TYPES.STUDENT);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserTypeSelect = (type) => {
    const userType = type.toLowerCase();
    setSelected(type);
    setSearchParams({ type: userType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Normalize email before sending
      const normalizedFormData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        normalizedFormData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Check response structure
      if (response.data && response.data.success && response.data.data && response.data.data.token) {
      const { token } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      dispatch(setUserToken(token));
        toast.success("Login successful!");
        setTimeout(() => {
      navigate(`/${selected.toLowerCase()}`);
        }, 500);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-2xl lg:w-1/2 px-6 py-12 relative z-10">
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            College Management System
        </h1>
          <p className="text-xl text-gray-600 font-medium">
            {selected} Portal
          </p>
        </div>
        <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />
        <LoginForm
          selected={selected}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isLoading={isLoading}
        />
        
        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200 animate-fade-in">
          <p className="text-sm font-semibold text-gray-700 mb-2 text-center">Demo Credentials:</p>
          <div className="space-y-2 text-xs">
            {selected === "Admin" && (
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Admin:</span>
                <span className="font-mono text-blue-700">admin@gmail.com / admin123</span>
              </div>
            )}
            {selected === "Student" && (
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <span className="text-gray-600">Student:</span>
                <span className="font-mono text-green-700">student@demo.com / student123</span>
              </div>
            )}
            {selected === "Faculty" && (
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <span className="text-gray-600">Faculty:</span>
                <span className="font-mono text-purple-700">faculty@demo.com / faculty123</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      />
    </div>
  );
};

export default Login;
