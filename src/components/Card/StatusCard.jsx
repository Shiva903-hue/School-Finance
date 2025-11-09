import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Hash,
  Package,
  User,
  User2,
  XCircle,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

export default function StatusCard({ voucherData }) {
  let statusLabel, statusColor, statusIcon, accentColor, gradientFrom, gradientTo;

  // Normalize status to uppercase for comparison
  const status = voucherData.voucher_status?.toUpperCase() || "";

  if (status === "PENDING") {
    statusLabel = "PENDING";
    accentColor = "border-l-orange-500";
    gradientFrom = "from-orange-50";
    gradientTo = "to-white";
    statusColor = "bg-orange-100 text-orange-700 border border-orange-200";
    statusIcon = <Clock className="w-4 h-4 mr-1.5" />;
  } else if (status === "APPROVED") {
    statusLabel = "APPROVED";
    accentColor = "border-l-green-500";
    gradientFrom = "from-green-50";
    gradientTo = "to-white";
    statusColor = "bg-green-100 text-green-700 border border-green-200";
    statusIcon = <CheckCircle className="w-4 h-4 mr-1.5" />;
  } else {
    statusLabel = "REJECTED";
    accentColor = "border-l-red-500";
    gradientFrom = "from-red-50";
    gradientTo = "to-white";
    statusColor = "bg-red-100 text-red-700 border border-red-200";
    statusIcon = <XCircle className="w-4 h-4 mr-1.5" />;
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl border-l-4 ${accentColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-5 h-full flex flex-col border border-gray-100`}
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
              #{voucherData.voucher_id}
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

      {/* User Email */}
      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 mb-4">
        <User className="w-4 h-4 text-indigo-600" />
        <div className="flex-1">
          <div className="text-xs text-gray-500">User Email</div>
          <div className="text-sm font-semibold text-gray-800 truncate" title={voucherData.user_email || "nouser@email.com"}>
            {voucherData.user_email || "nouser@email.com"}
          </div>
        </div>
      </div>

      {/* Vendor & Product Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <User2 className="w-4 h-4 text-blue-600" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Vendor</div>
            <div className="text-sm font-semibold text-gray-800">
              {voucherData.vendor_name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <ShoppingBag className="w-4 h-4 text-purple-600" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Product</div>
            <div className="text-sm font-semibold text-gray-800 truncate" title={voucherData.product_name}>
              {voucherData.product_name}
            </div>
          </div>
        </div>
      </div>

      {/* Quantity & Rate Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Quantity</div>
          <div className="text-lg font-bold text-gray-900">
            {parseInt(voucherData.product_qty).toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Rate
          </div>
          <div className="text-lg font-bold text-gray-900">
            ₹{parseInt(voucherData.product_rate).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Total Amount - Prominent */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-4 mb-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-100" />
            <span className="text-sm text-blue-100 font-medium">Total Amount</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{parseInt(voucherData.product_amount).toLocaleString()}
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
            {new Date(voucherData.voucher_entry_date).toLocaleDateString(
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
