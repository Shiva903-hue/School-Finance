import { FileText, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import React, { useState } from "react";
import BankReport from "./Reports/BankReport";
import PeticashReport from "./Reports/PeticashReport";
import PurchaseVoucherReport from "./Reports/PurchaseVoucherReport";
import TransactionVoucherReport from "./Reports/TransactionVoucherReport";
import WithdrawalReport from "./Reports/WithdrawalReport";
import DepositReport from "./Reports/DepositReport";
import UsersReport from "./Reports/UsersReport";
import VendorInfoReport from "./Reports/VendorInfoReport";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Report menu structure with nested items
  const reportCategories = [
    {
      id: 'bank_report',
      label: 'Bank Report',
      path: 'bank-report'
    },
    {
      id: 'petty_cash',
      label: 'Petty Cash',
      path: 'petty-cash'
    },
    {
      id: 'purchase_voucher',
      label: 'Purchase Voucher',
      path: 'purchase-voucher'
    },
    {
      id: 'transaction_voucher',
      label: 'Transaction Voucher',
      path: 'transaction-voucher'
    },
    {
      id: 'self_transaction',
      label: 'Self Transaction',
      hasSubItems: true,
      subItems: [
        {
          id: 'withdrawal_report',
          label: 'Withdrawal Report',
          path: 'self-transaction/withdrawal'
        },
        {
          id: 'deposit_report',
          label: 'Deposit Report',
          path: 'self-transaction/deposit'
        }
      ]
    },
    {
      id: 'user_info',
      label: 'User Info',
      path: 'user-info'
    },
    {
      id: 'vendor_info',
      label: 'Vendor Info',
      path: 'vendor-info'
    }
  ];

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle report selection
  const handleReportSelect = (report, parentLabel = null) => {
    const fullLabel = parentLabel ? `${parentLabel} > ${report.label}` : report.label;
    setSelectedReport({
      ...report,
      fullLabel
    });
  };

  // Render the appropriate report component
  const renderReportContent = () => {
    switch (selectedReport?.id) {
      case 'bank_report':
        return <BankReport />;
      case 'petty_cash':
        return <PeticashReport />;
      case 'purchase_voucher':
        return <PurchaseVoucherReport />;
      case 'transaction_voucher':
        return <TransactionVoucherReport />;
      case 'withdrawal_report':
        return <WithdrawalReport />;
      case 'deposit_report':
        return <DepositReport />;
      case 'user_info':
        return <UsersReport />;
      case 'vendor_info':
        return <VendorInfoReport />;
      default:
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedReport.label}
            </h3>
            <p className="text-gray-600">
              Report content will be displayed here
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            {/* Burger Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
            
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Select a report type to view detailed information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Report Categories */}
          {isSidebarOpen && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-4 py-3">
                <h2 className="text-lg font-bold text-gray-900">Report Types</h2>
                <p className="text-xs text-gray-600 mt-1">Click to select a report</p>
              </div>
              
              <nav className="p-2">
                {reportCategories.map((category) => (
                  <div key={category.id} className="mb-1">
                    {/* Main Category Button */}
                    <button
                      onClick={() => {
                        if (category.hasSubItems) {
                          toggleCategory(category.id);
                        } else {
                          handleReportSelect(category);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        selectedReport?.id === category.id && !category.hasSubItems
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium text-sm">{category.label}</span>
                      {category.hasSubItems && (
                        expandedCategories[category.id] ? (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )
                      )}
                    </button>

                    {/* Sub Items */}
                    {category.hasSubItems && expandedCategories[category.id] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {category.subItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleReportSelect(subItem, category.label)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-left transition-all duration-200 ${
                              selectedReport?.id === subItem.id
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              selectedReport?.id === subItem.id ? 'bg-white' : 'bg-gray-400'
                            }`} />
                            <span className="text-sm font-medium">{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            </div>
          )}

          {/* Main Content - Report Display */}
          <div className={isSidebarOpen ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {selectedReport ? (
                <>
                  {/* Selected Report Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedReport.label}</h2>
                  </div>

                  {/* Report Content Area */}
                  <div className="p-6">
                    {renderReportContent()}
                  </div>
                </>
              ) : (
                /* Initial Welcome Screen */
                <div className="p-8 sm:p-12">
                  <div className="text-center max-w-md mx-auto">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
                      <FileText className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Welcome to Reports Dashboard
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Select a report type from the sidebar to view detailed information.
                      
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}