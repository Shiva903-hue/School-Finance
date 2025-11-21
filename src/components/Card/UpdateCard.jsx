import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Hash,
  XCircle,
  CreditCard,
  Building2,
  MessageSquareMore,
  X,
} from "lucide-react";

export default function UpdateCard() {
  const [transactionData, setTransactionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  // Fetch transaction data
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/trns-info');
        
        // Filter only APPROVED transactions
        if (Array.isArray(response.data)) {
          const approvedTransactions = response.data.filter(
            transaction => transaction.trns_status?.toUpperCase() === "APPROVED"
          );
          setTransactionData(approvedTransactions);
          setFilteredData(approvedTransactions);
        } else {
          console.warn("Unexpected data format received");
          setTransactionData([]);
          setFilteredData([]);
        }
      
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        toast.error("Failed to load transaction data. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, []);

  // Apply date filter
  useEffect(() => {
    let filtered = [...transactionData];

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(item => {
        if (!item.trns_date) return false;
        const itemDate = new Date(item.trns_date);
        const filterDate = new Date(dateFilter);
        
        // Compare only the date part (ignore time)
        return (
          itemDate.getFullYear() === filterDate.getFullYear() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredData(filtered);
  }, [dateFilter, transactionData]);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-5 flex items-center justify-center min-h-[200px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show message if no data
  if (transactionData.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-5 flex items-center justify-center min-h-[200px]">
        <div className="text-gray-500">No approved transactions available</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Date Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-4">
          <div className="flex-1 w-auto sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors mt-6"
            >
              <X className="w-4 h-4" />
              Clear Filter
            </button>
          )}
          
          <div className="text-sm text-gray-600 mt-6">
            Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
            <span className="font-semibold">{transactionData.length}</span> approved transactions
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
          <Calendar className="w-16 h-16 text-gray-400 mb-4" />
          <div className="text-gray-500 text-lg font-medium">No transactions found for this date</div>
          <p className="text-gray-400 text-sm mt-2">Try selecting a different date</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((transaction, index) => (
            <TransactionCard key={`${transaction.voucher_id}-${index}`} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionCard({ transaction }) {
  let statusLabel, statusColor, statusIcon, accentColor, gradientFrom, gradientTo;

  // Set APPROVED styling
  statusLabel = "APPROVED";
  accentColor = "border-l-green-500";
  gradientFrom = "from-green-100";
  gradientTo = "to-green-50";
  statusColor = "bg-green-500 text-white border border-green-600";
  statusIcon = <CheckCircle className="w-4 h-4 mr-1.5" />;

  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl border-l-4 ${accentColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-5 h-full flex flex-col border-2 border-green-300`}
    >
      {/* Header with Voucher ID and Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Hash className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Voucher ID</div>
            <div className="font-bold text-xl text-gray-900">
              #{transaction.voucher_id}
            </div>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${statusColor}`}
        >
          {statusIcon}
          {statusLabel}
        </span>
      </div>

      {/* Transaction Type & Bank Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <CreditCard className="w-4 h-4 text-purple-600" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Transaction Type</div>
            <div className="text-sm font-semibold text-gray-800">
              {transaction.transaction_type || "-"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <Building2 className="w-4 h-4 text-blue-600" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Bank</div>
            <div className="text-sm font-semibold text-gray-800">
              {transaction.bank_name || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      {transaction.transaction_details && (
        <div className="bg-white p-3 mb-4 rounded-lg border text-wrap border-gray-200">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <MessageSquareMore className="w-3 h-3" />
            Details
          </div>
          <div className="text-sm text-gray-900">
            {transaction.transaction_details}
          </div>
        </div>
      )}

      {/* Transaction Amount - Prominent */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-4 mb-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 text-blue-100 font-bold">₹</span>
            <span className="text-sm text-blue-100 font-medium">Transaction Amount</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {transaction.trns_amount && !isNaN(parseFloat(transaction.trns_amount))
              ? `₹${parseFloat(transaction.trns_amount).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              : "-"}
          </div>
        </div>
      </div>

      {/* Footer with Date */}
      <div className="border-t border-gray-200 pt-3 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">
              Approved
            </span>
          </div>
          <div className="text-xs text-gray-600 font-semibold">
            {new Date(transaction.trns_date).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}