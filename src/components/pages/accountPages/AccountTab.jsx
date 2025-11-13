import React, { useState } from 'react';
import Deposit from '../../All-Forms/Acc-Forms/Deposit';
import BankMasterForm from '../../All-Forms/Acc-Forms/BankMasterForm';
import WithdrawalForm from '../../All-Forms/Acc-Forms/WithdrawalForm';
import MyBank from '../../All-Forms/Acc-Forms/MyBank';
import Sidebar from '../Sidebar';

export default function AccountTab() {
  const [activeItem, setActiveItem] = useState('Create_Bank');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'Create_Bank', label: 'Create Bank' },
    { id: 'Deposit', label: 'Deposit' },
    { id: 'Withdrawal', label: 'Withdrawal' },
    { id: 'MyBank', label: 'My Bank' },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="w-full flex">
      {/* Sidebar */}
      <Sidebar
        title="Account Management"
        navItems={navItems}
        activeItem={activeItem}
        handleItemClick={handleItemClick}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1  w-full">
        {/* Content */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {activeItem === 'Create_Bank' && <BankMasterForm />}
          {activeItem === 'Deposit' && <Deposit />}
          {activeItem === 'Withdrawal' && <WithdrawalForm />}
          {activeItem === 'MyBank' && <MyBank />}
        </div>
      </div>
    </div>
  );
}