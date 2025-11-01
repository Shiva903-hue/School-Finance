import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import school from "../../assets/school.png";

export default function TopNavbar({
  title = "School Finance",
  isSidebarOpen = false,
  setIsSidebarOpen,
  showMenuButton = true,
}) {
  const toggleSidebar = () => {
    if (setIsSidebarOpen) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
      <nav className="flex items-center justify-between p-3 md:p-4">
        {/* Left Section - Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          {showMenuButton && setIsSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          )}

          {/* Logo & Brand */}
          <img
            src={school}
            alt="School Finance Logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover"
          />
          <span className="text-lg md:text-xl font-extrabold text-blue-700">
            {title}
          </span>
        </div>

        {/* Right Section - Logout Button */}
        <Link to="/">
          <button
            className="py-1.5 px-3 md:py-2 md:px-5 border rounded-lg 
                       transition-all duration-200 text-xs md:text-sm font-medium 
                       hover:bg-red-50 text-red-600 border-red-500 bg-white 
                       hover:shadow-md active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Log Out
          </button>
        </Link>
      </nav>
    </header>
  );
}
