import React, { useState, useEffect } from "react";
import { Filter, X, ArrowUpDown } from "lucide-react";

export default function TransactionVoucherReport() {
  const [purchaseInfo, setPurchaseInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);



  useEffect(() => {
    async function fetchPettycashData() {
      try {
        const response = await fetch(
          "http://localhost:8001/api/reports/transaction-voucher-report"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPurchaseInfo(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchPettycashData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...purchaseInfo];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        item => item.trns_status?.toUpperCase() === statusFilter.toUpperCase()
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(item => {
        if (!item.trns_date) return false;
        const itemDate = new Date(item.trns_date);
        const filterDate = new Date(dateFilter);
        
        // Compare only year, month, and day (ignore time)
        return itemDate.getFullYear() === filterDate.getFullYear() &&
               itemDate.getMonth() === filterDate.getMonth() &&
               itemDate.getDate() === filterDate.getDate();
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.trns_date || 0);
      const dateB = new Date(b.trns_date || 0);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(filtered);
  }, [purchaseInfo, statusFilter, dateFilter, sortOrder]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
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
          
          {(statusFilter !== "all" || dateFilter) && (
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
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
          <span className="font-semibold">{purchaseInfo.length}</span> transaction vouchers
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
                  transaction type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  details
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  voucher id
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
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
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.transaction_type || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{parseFloat(item.trns_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.trns_date 
                          ? new Date(item.trns_date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.transaction_details || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.voucher_id || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.trns_status === 'APPROVED'
                            ? 'bg-green-100 text-green-800' 
                            : item.trns_status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : item.trns_status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.trns_status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                    No Transaction Voucher records found
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
