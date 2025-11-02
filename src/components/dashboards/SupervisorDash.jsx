import React, { useState } from "react";
import { User } from "lucide-react";
import Account from "../pages/accountPages/Account";
import PendingApproval from '../pages/adminPages/PendingApprovle';
import Balance2 from '../pages/adminPages/Balance2';
import Sidebar from "../pages/Sidebar";
import TopNavbar from "../ui/TopNav";

export default function SupervisorDash() {
  const [activeItem, setActiveItem] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { id: 'pendingApproval', label: 'Pending Approval' },
    { id: 'Balance', label: 'Balance' },
    { id: 'account', label: 'Account' },
  ];

  const renderComponent = () => {
    switch (activeItem) {
      case "pendingApproval":
        return <PendingApproval />;
      case "Balance":
        return <Balance2 />;
      case "account":
        return <Account />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome to Supervisor Dashboard
              </h1>
              <p className="text-gray-600 max-w-md">
                Select an option from the sidebar to get started
              </p>
            </div>
          </div>
        );
    }
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsSidebarOpen(false);
  };

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
        {/* Sidebar */}
        <Sidebar
          title="Supervisor Menu"
          navItems={navLinks}
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
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}