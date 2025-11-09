import React, { useState } from 'react';
import BankMasterForm from '../../All-Forms/Acc-Forms/BankMasterForm';
import MyBank from '../../All-Forms/Acc-Forms/MyBank';

export default function Account() {
  const [activeItem, setActiveItem] = useState('Create_Bank');

  const navItems = [
    { id: 'Create_Bank', label: 'Create Bank' },
    { id: 'MyBank', label: 'Banks' },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };

  return (
    <div className="w-full">
      {/* Tab Navigation - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-sm border-b sticky top-0 z-20 mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 p-3 min-w-max md:min-w-0 md:flex-wrap md:justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full whitespace-nowrap transition-all duration-200 font-medium text-sm sm:text-base ${
                  activeItem === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-2 sm:px-4 lg:px-6">
        {activeItem === 'Create_Bank' && <BankMasterForm />}
        {/* {activeItem === 'Deposit' && <Deposit />} */}
        {/* {activeItem === 'Withdrawal' && <WithdrawalForm />} */}
        {activeItem === 'MyBank' && <MyBank />}
      </div>
    </div>
  );
}