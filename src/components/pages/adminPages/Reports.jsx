// import { Clock, FileText, UserPlus, Users } from "lucide-react";
// import React,{useState} from "react";
// import Transaction from "../adminPages/Reports/Transaction";
// import DepostitSlip from "../adminPages/Reports/DepostitSlip";
// import Status from "../adminPages/Reports/Status";

// export default function Reports() {

//     const [activeSection, setActiveSection] = useState('transaction_report');

//   const menuItems = [
//     { id: 'transaction_report', label: 'Transaction Report', icon: UserPlus },
//     { id: 'deposite_slip', label: 'Deposite Slip', icon: Clock },
//     { id: 'status', label: 'Status', icon: FileText },
//   ];
//   //Render Content
//   const renderContent = ()=>{
//     return(<>
//      {activeSection === "transaction_report" && <Transaction/>}
//      {activeSection === "deposite_slip" && <DepostitSlip/>}
//      {activeSection === "status" && <Status/>}
//     </>
//     )
//   }

//   return (<div className="min-h-screen bg-gray-50 ">
//             {/* Navigation */}
//         <nav className="mt-2 p-2 flex border-b-4 border-gray-300">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveSection(item.id)}
//                 className={` rounded-lg flex items-center p-2 mr-3 text-left  transition-colors duration-200 ${
//                   activeSection === item.id ? 'bg-blue-600 text-white' : 'text-gray-700'
//                 }`}
//               >
//                 <Icon size={20} className="m-2" />
//                 <span>{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>
//          <main className=" overflow-y-auto bg-gray-50">
//           {renderContent()}
//         </main>
//       </div>
   

//   );
// }

import { Clock, FileText, TrendingUp } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import Transaction from "../adminPages/Reports/Transaction";
import DepostitSlip from "../adminPages/Reports/DepostitSlip";
import Status from "../adminPages/Reports/Status";

export default function Reports() {
  const [activeSection, setActiveSection] = useState('transaction_report');

  // Memoize menu items
  const menuItems = useMemo(() => [
    { id: 'transaction_report', label: 'Transaction Report', icon: TrendingUp, color: 'blue' },
    { id: 'deposite_slip', label: 'Deposit Slip', icon: FileText, color: 'green' },
    { id: 'status', label: 'Status', icon: Clock, color: 'purple' },
  ], []);

  // Memoize section change handler
  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  // Render Content with useMemo
  const renderContent = useMemo(() => {
    switch (activeSection) {
      case "transaction_report":
        return <Transaction />;
      case "deposite_slip":
        return <DepostitSlip />;
      case "status":
        return <Status />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Select a report type</p>
          </div>
        );
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">View and analyze your financial reports</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 pb-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold text-sm transition-all duration-200 border-b-2 ${
                    isActive
                      ? `bg-${item.color}-50 text-${item.color}-700 border-${item.color}-600 shadow-sm`
                      : 'text-gray-600 hover:bg-gray-50 border-transparent hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Navigation Tabs - Mobile (Scrollable) */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <nav className="flex gap-2 px-4 pb-4 min-w-max">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`flex flex-col items-center justify-center min-w-[110px] px-4 py-3 rounded-lg font-semibold text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <Icon size={20} className="mb-1.5" />
                  <span className="text-center leading-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Section Indicator - Mobile */}
        <div className="md:hidden mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            {(() => {
              const activeItem = menuItems.find(item => item.id === activeSection);
              const Icon = activeItem?.icon;
              return (
                <>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Currently Viewing</p>
                    <p className="text-sm font-semibold text-gray-900">{activeItem?.label}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Content Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              {menuItems.find(item => item.id === activeSection)?.label}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Detailed information and analytics for your{' '}
              {menuItems.find(item => item.id === activeSection)?.label.toLowerCase()}
            </p>
          </div>

          {/* Dynamic Content */}
          <div className="p-6">
            {renderContent}
          </div>
        </div>
      </main>
    </div>
  );
}