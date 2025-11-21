import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import VoucherCard from "../../Card/VoucherCard";
import { CheckCircle, RefreshCw, Loader2 } from 'lucide-react';

export default function PendingApproval() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter only PENDING vouchers for display and count
  const pendingVouchers = useMemo(() => 
    vouchers.filter(v => v.voucher_status === "PENDING"), 
    [vouchers]
  );
  
  const dataLength = useMemo(() => pendingVouchers.length, [pendingVouchers.length]);

  // Fetch vouchers from server with useCallback to prevent recreation
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/voucher-details", {
        // Add cache control for better performance
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = res.data;
      
      // Extract the voucherDetails array from the response
      const voucherArray = Array.isArray(data) 
        ? data 
        : data.voucherDetails || data.data || [];
      
      console.log("vouchers --> ", data);
      console.log("voucher array --> ", voucherArray);
      
      setVouchers(voucherArray);

    } catch (error) {
      console.log("vouchers --> Error");
      console.error("Error fetching vouchers:", error);
      // Optional: Add error state and user notification
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize handlers with useCallback
  const handleApprove = useCallback((voucherId) => {
    setVouchers(prev => prev.filter(voucher => voucher.voucher_id !== voucherId));
  }, []);

  const handleReject = useCallback((voucherId) => {
    setVouchers(prev => prev.filter(voucher => voucher.voucher_id !== voucherId));
  }, []);

  // Enhanced loading skeleton
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading vouchers...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
        
        {/* Optional: Loading skeleton for better UX */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Pending Approvals
          </h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {dataLength}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95"
        >
          <RefreshCw 
            className={`w-4 h-4 transition-transform ${refreshing ? 'animate-spin' : ''}`} 
          />
          <span className="font-medium">
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </span>
        </button>
      </div>

      {/* Refreshing Overlay Indicator */}
      {refreshing && (
        <div className="mb-4 flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Updating vouchers...</span>
        </div>
      )}

      {/* Voucher Cards Grid */}
      {pendingVouchers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingVouchers.map((voucher) => (
            <VoucherCard
              key={voucher.voucher_id}
              voucherData={voucher}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {pendingVouchers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <CheckCircle className="w-20 h-20 mb-4 text-green-500 animate-bounce" />
            <p className="text-gray-700 text-xl font-semibold mb-2">
              All Clear!
            </p>
            <p className="text-gray-500 text-base">
              No pending approval requests at the moment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}