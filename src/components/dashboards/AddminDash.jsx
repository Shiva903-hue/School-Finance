import React, { useState, useCallback, useMemo } from "react";
import { FileText, Users, Wallet } from "lucide-react";
import Usercreation from '../All-Forms/Admin-Forms/Usercreation';
import Reports from '../pages/adminPages/Reports';
import Balance from '../pages/adminPages/Balance';
import Sidebar from '../pages/Sidebar';
import TopNavbar from '../ui/TopNav';

export default function AdminDash() {
  const [activeItem, setActiveItem] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Memoize navigation items
  const navItems = useMemo(() => [
    { id: 'reports', label: 'Reports' },
    { id: 'balance', label: 'Balance' },
    { id: 'userManager', label: 'User Manager' },
  ], []);

  // Memoize render function
  const renderComponent = useMemo(() => {
    switch (activeItem) {
      case "reports":
        return <Reports />;
      case "balance":
        return <Balance />;
      case "userManager":
        return <Usercreation />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome to Admin Dashboard
              </h1>
              <p className="text-gray-600 max-w-md">
                Select an option from the sidebar to get started
              </p>
            </div>
          </div>
        );
    }
  }, [activeItem]);

  // Memoize item click handler
  const handleItemClick = useCallback((itemId) => {
    setActiveItem(itemId);
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <TopNavbar 
        title="School Finance"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        showMenuButton={true}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Sidebar */}
        <Sidebar
          title="Admin Menu"
          navItems={navItems}
          activeItem={activeItem}
          handleItemClick={handleItemClick}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-gray-50">
          {renderComponent}
        </main>
      </div>
    </div>
  );
}