import React from "react";
import { FiLogOut, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import CustomButton from "./CustomButton";

const Navbar = ({ onToggleSidebar, sidebarOpen, theme = "light", onToggleTheme }) => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType") || "User";

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleDashboardClick = () => {
    // Toggle sidebar when available (Admin page has sidebar)
    if (onToggleSidebar) {
      onToggleSidebar();
    }
    // Always navigate to user's dashboard
    navigate(`/${userType.toLowerCase()}`);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Main Dashboard Button - Works across all sections */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleDashboardClick}
              title="Go to Dashboard"
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
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 hover:shadow-md"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              type="button"
            >
              {theme === "dark" ? (
                <>
                  <FiSun className="text-lg" />
                  <span className="text-sm font-medium">Light</span>
                </>
              ) : (
                <>
                  <FiMoon className="text-lg" />
                  <span className="text-sm font-medium">Dark</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate(`/${userType.toLowerCase()}?page=home`)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 hover:shadow-md"
              title="Profile"
              type="button"
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
