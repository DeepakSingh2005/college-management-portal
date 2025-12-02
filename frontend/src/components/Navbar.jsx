import React from "react";
import { FiLogOut, FiUser, FiMenu } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import CustomButton from "./CustomButton";

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const router = useLocation();
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType") || "User";

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleToggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      console.warn("onToggleSidebar function not provided");
    }
  };

  const handleDashboardClick = () => {
    // Toggle sidebar when available (gives immediate visual feedback)
    if (onToggleSidebar) onToggleSidebar();
    // Navigate to the user's dashboard route
    navigate(`/${userType.toLowerCase()}`);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Dashboard Toggle Button */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              title={sidebarOpen ? "Hide Dashboard" : "Show Dashboard"}
            >
              <FiMenu className="text-xl" />
            </button>
            
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleDashboardClick}
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <RxDashboard className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {userType} Dashboard
                </h1>
                <p className="text-xs text-gray-500">College Management System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/${userType.toLowerCase()}`)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 hover:shadow-md"
              title="Profile"
            >
              <FiUser className="text-xl" />
            </button>
            <CustomButton 
              variant="danger" 
              onClick={logouthandler}
              className="flex items-center gap-2"
            >
              <FiLogOut className="text-lg" />
              Logout
            </CustomButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
