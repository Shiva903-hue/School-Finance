//* Transaction Status Card Component */
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
} from "lucide-react";

export default function TransactionStatusCard({ transactionData }) {
  let statusLabel, statusColor, statusIcon, accentColor, gradientFrom, gradientTo;

  // Normalize status to uppercase for comparison
  const status = transactionData.trns_status?.toUpperCase() || "";

  if (status === "PENDING") {
    statusLabel = "PENDING";
    accentColor = "border-l-orange-500";
    gradientFrom = "from-orange-100";
    gradientTo = "to-orange-50";
    statusColor = "bg-orange-500 text-white border border-orange-600";
    statusIcon = <Clock className="w-4 h-4 mr-1.5" />;
  } else if (status === "APPROVED") {
    statusLabel = "APPROVED";
    accentColor = "border-l-green-500";
    gradientFrom = "from-green-100";
    gradientTo = "to-green-50";
    statusColor = "bg-green-500 text-white border border-green-600";
    statusIcon = <CheckCircle className="w-4 h-4 mr-1.5" />;
  } else {
    statusLabel = "REJECTED";
    accentColor = "border-l-red-500";
    gradientFrom = "from-red-100";
    gradientTo = "to-red-50";
    statusColor = "bg-red-500 text-white border border-red-600";
    statusIcon = <XCircle className="w-4 h-4 mr-1.5" />;
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl border-l-4 ${accentColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-5 h-full flex flex-col border-2 ${
        status === "PENDING"
          ? "border-orange-300"
          : status === "APPROVED"
          ? "border-green-300"
          : "border-red-300"
      }`}
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
              #{transactionData.voucher_id}
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
              {transactionData.transaction_type || "-"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <Building2 className="w-4 h-4 text-blue-600" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Bank</div>
            <div className="text-sm font-semibold text-gray-800">
              {transactionData.bank_name || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      {transactionData.transaction_details && (
        <div className="bg-white p-3 mb-4 rounded-lg border text-wrap border-gray-200">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <MessageSquareMore className="w-3 h-3" />
            Details
          </div>
          <div className="text-sm text-gray-900">
            {transactionData.transaction_details}
          </div>
        </div>
      )}

      {/* Transaction Amount - Prominent */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-4 mb-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <DollarSign className="w-5 h-5 text-blue-100" />
             */} <span className="w-5 h-5 text-blue-100 font-bold">₹</span>
            <span className="text-sm text-blue-100 font-medium">Transaction Amount</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {transactionData.trns_amount && !isNaN(parseFloat(transactionData.trns_amount))
              ? `₹${parseFloat(transactionData.trns_amount).toLocaleString('en-IN', {
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
              {status === "APPROVED"
                ? "Approved"
                : status === "REJECTED"
                ? "Rejected"
                : "Created"}
            </span>
          </div>
          <div className="text-xs text-gray-600 font-semibold">
            {new Date(transactionData.trns_date).toLocaleDateString(
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
