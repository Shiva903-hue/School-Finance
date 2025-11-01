// import React, { useState } from 'react';
// import { Building2, Wallet, CreditCard, Landmark, Menu, X } from 'lucide-react';
// import Deposit from '../../All-Forms/Acc-Forms/Deposit';
// import BankMasterForm from '../../All-Forms/Acc-Forms/BankMasterForm';
// import WithdrawalForm from '../../All-Forms/Acc-Forms/WithdrawalForm';
// import MyBank from '../../All-Forms/Acc-Forms/MyBank';
// import Sidebar from '../Sidebar';

// export default function AccountTab() {
//   const [activeItem, setActiveItem] = useState('Create_Bank');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const navItems = [
//     { id: 'Create_Bank', label: 'Create Bank', icon: Building2 },
//     { id: 'Deposit', label: 'Deposit', icon: Wallet },
//     { id: 'Withdrawal', label: 'Withdrawal', icon: CreditCard },
//     { id: 'MyBank', label: 'My Bank', icon: Landmark },
//   ];

//   const handleItemClick = (itemId) => {
//     setActiveItem(itemId);
//     setIsSidebarOpen(false); // Close sidebar on mobile after selection
//   };

//   return (
//     <div className="w-full flex">
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
//         aria-label="Toggle sidebar"
//       >
//         {isSidebarOpen ? (
//           <X className="w-6 h-6" />
//         ) : (
//           <Menu className="w-6 h-6" />
//         )}
//       </button>

//       {/* Overlay for mobile */}
//       {isSidebarOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:sticky top-0 left-0 h-screen bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 z-40 ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:translate-x-0 w-64`}
//       >
//         <div className="p-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//             <Landmark className="w-6 h-6 text-blue-600" />
//             Account Management
//           </h2>
//           <nav className="space-y-2">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => handleItemClick(item.id)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-left ${
//                     activeItem === item.id
//                       ? 'bg-blue-600 text-white shadow-md'
//                       : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.label}</span>
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 lg:ml-0 w-full">
//         {/* Content */}
//         <div className="px-4 py-6 sm:px-6 lg:px-8">
//           {activeItem === 'Create_Bank' && <BankMasterForm />}
//           {activeItem === 'Deposit' && <Deposit />}
//           {activeItem === 'Withdrawal' && <WithdrawalForm />}
//           {activeItem === 'MyBank' && <MyBank />}
//         </div>
//       </div>
//     </div>
//   );
// }


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