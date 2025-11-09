import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import StatusCard from "../Card/StatusCard";

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-2xl p-6 min-h-[120px] flex flex-col gap-2">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
    </div>
  );
}

export default function StatusView() {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatusData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8001/api/voucher-details");
      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.status}`);
      }
      const data = await res.json();
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setStatusData(data);
      } else if (Array.isArray(data.voucherDetails)) {
        setStatusData(data.voucherDetails);
      } else if (Array.isArray(data.data)) {
        setStatusData(data.data);
      } else {
        console.warn("Unexpected data structure:", data);
        setStatusData([]);
      }
    } catch (error) {
      console.error("Error fetching processed vouchers:", error);
      setStatusData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStatusData();
  };

  useEffect(() => {
    fetchStatusData();
  }, [fetchStatusData]);

  // Show initial loading skeletons
  if (loading && !refreshing) {
    return (
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Status</h1>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Status
        </h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* If refreshing, show old data with overlay skeletons */}
      <div className="relative">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
            refreshing ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {statusData.map((voucher) => (
            <StatusCard key={voucher.voucher_id} voucherData={voucher} />
          ))}
        </div>
        {refreshing && (
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-none">
            {Array(Math.max(3, statusData.length))
              .fill(0)
              .map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
          </div>
        )}
      </div>

      {statusData.length === 0 && !loading && !refreshing && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">No Requests Found</p>
        </div>
      )}
    </div>
  );
}
