import React, { useState, useEffect } from "react";
import { Filter, X, ArrowUpDown } from "lucide-react";

export default function DepositReport() {
  const [depositInfo, setDepositeInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first, asc = oldest first
  const [showFilters, setShowFilters] = useState(false);



  useEffect(() => {
    async function fetchPettycashData() {
      try {
        const response = await fetch(
          "http://localhost:8001/api/reports/self-transaction-report"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched pettycash report data:", data);
        // Filter only Deposit transactions
        const depositOnly = data.filter(item => item.Txn_type === "Deposit");
        setDepositeInfo(depositOnly);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchPettycashData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...depositInfo];

    // Filter by transaction type
    if (transactionTypeFilter !== "all") {
      filtered = filtered.filter(
        item => item.transaction_type?.toLowerCase() === transactionTypeFilter.toLowerCase()
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(item => {
        if (!item.transaction_date) return false;
        const itemDate = new Date(item.transaction_date);
        const filterDate = new Date(dateFilter);
        
        // Compare only year, month, and day (ignore time)
        return itemDate.getFullYear() === filterDate.getFullYear() &&
               itemDate.getMonth() === filterDate.getMonth() &&
               itemDate.getDate() === filterDate.getDate();
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.transaction_date || 0);
      const dateB = new Date(b.transaction_date || 0);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(filtered);
  }, [depositInfo, transactionTypeFilter, dateFilter, sortOrder]);

  // Clear all filters
  const clearFilters = () => {
    setTransactionTypeFilter("all");
    setDateFilter("");
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };


  return (
    <div className="w-full space-y-4">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          
          {(transactionTypeFilter !== "all" || dateFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Transaction Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <select
                value={transactionTypeFilter}
                onChange={(e) => setTransactionTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="rtgs">RTGS</option>
                <option value="demand draft">Demand Draft</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by Date
              </label>
              <button
                onClick={toggleSortOrder}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
          <span className="font-semibold">{depositInfo.length}</span> deposits
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Index
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Bank Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cheque / DD No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  RTGS No.
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {

                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.bank_name || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{parseFloat(item.Txn_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                     
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.transaction_type || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.transaction_date 
                          ? new Date(item.transaction_date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.cheque_dd_number || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.rtgs_number || '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                    No deposit records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
