import React, { useState } from "react";
import { User } from "lucide-react";
import Sidebar from '../pages/Sidebar';
import DailyTransaction from "../pages/userPages/DailyTransiction";
import VendorTab from "../pages/userPages/Vendor";
import TopNavbar from "../ui/TopNav";
import PetiCash from "../All-Forms/User-Forms/PetiCash";




export default function UserDash() {
  const [activeItem, setActiveItem] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: "VoucherForm", label: "Voucher Entry" },
    { id: "Transaction", label: "Transaction" },
    { id: "AddVendor", label: "Add Vendor" },
    { id: "PetiCash", label: "Petty Cash" },
    { id: "status-view", label: "Status View" },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const renderMain = () => {
    switch (activeItem) {
      case "VoucherForm":
      case "Transaction":
      case "status-view":
        return <DailyTransaction activeItem={activeItem} />;
      case "AddVendor":
        return <VendorTab />;
        case "PetiCash":
        return <PetiCash />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome to User Dashboard
              </h1>
              <p className="text-gray-600 max-w-md">
                Select an option from the sidebar to get started
              </p>
            </div>
          </div>
        );
    }
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
        <main className="flex-1 overflow-auto">
          {renderMain()}
        </main>
      </div>
    </div>
  );
}