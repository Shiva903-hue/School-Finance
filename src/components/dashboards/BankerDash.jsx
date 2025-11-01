import React, { useState } from "react";
import { Building2, Wallet, CreditCard, Landmark } from "lucide-react";
import Deposit from '../All-Forms/Acc-Forms/Deposit';
import BankMasterForm from '../All-Forms/Acc-Forms/BankMasterForm';
import WithdrawalForm from '../All-Forms/Acc-Forms/WithdrawalForm';
import MyBank from '../All-Forms/Acc-Forms/MyBank';
import Sidebar from "../pages/Sidebar";
import TopNavbar from "../ui/TopNav";

export default function BankerDash() {
  const [activeItem, setActiveItem] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'Create_Bank', label: 'Create Bank' },
    { id: 'Deposit', label: 'Deposit' },
    { id: 'Withdrawal', label: 'Withdrawal' },
    { id: 'MyBank', label: 'My Bank' },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsSidebarOpen(false);
  };

  const renderComponent = () => {
    switch (activeItem) {
      case "Create_Bank":
        return <BankMasterForm />;
      case "Deposit":
        return <Deposit />;
      case "Withdrawal":
        return <WithdrawalForm />;
      case "MyBank":
        return <MyBank />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Landmark className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome to Banker Dashboard
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
          title="Account Management"
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
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}