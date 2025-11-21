import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { CheckCircle, RefreshCw } from "lucide-react";
import TransactionStatusCard from "../../Card/TransactionStatusCard";

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-2xl p-6 min-h-[120px] flex flex-col gap-2">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
    </div>
  );
}

export default function TransactionStatusView() {
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, approved, rejected

  const fetchTransactionData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8001/api/trns-info");
      const data = res.data;
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setTransactionData(data);
      } else if (Array.isArray(data.transactions)) {
        setTransactionData(data.transactions);
      } else if (Array.isArray(data.data)) {
        setTransactionData(data.data);
      } else {
        console.warn("Unexpected data structure:", data);
        setTransactionData([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactionData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactionData();
  };

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]);

  // Filter data based on selected filters
  const getFilteredData = () => {
    let filtered = [...transactionData];

    // Filter by status (skip if "all")
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.trns_status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by date (skip if "all")
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.trns_date);
        
        if (dateFilter === "today") {
          return transactionDate >= today;
        } else if (dateFilter === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return transactionDate >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return transactionDate >= monthAgo;
        }
        return true;
      });
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  // Show initial loading skeletons
  if (loading && !refreshing) {
    return (
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Transaction Status</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg opacity-60 cursor-wait"
            disabled
          >
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading...
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white shadow-2xl min-h-screen">
      <div className="flex flex-col gap-4 mb-6">
        {/* Title and Refresh Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Transaction Status
          </h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
          >
            <RefreshCw className={` text-center w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Date Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approval Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* If refreshing, show old data with overlay skeletons */}
      <div className="relative">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 ${
            refreshing ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {filteredData.map((transaction, index) => (
            <TransactionStatusCard 
              key={`${transaction.voucher_id}-${transaction.transaction_type_id}-${index}`} 
              transactionData={transaction} 
            />
          ))}
        </div>
        {refreshing && (
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-none">
            {Array(Math.max(3, filteredData.length))
              .fill(0)
              .map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
          </div>
        )}
      </div>

      {filteredData.length === 0 && !loading && !refreshing && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">
            No Transactions Found
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try changing the filters above
          </p>
        </div>
      )}
    </div>
  );
}
