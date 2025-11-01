import React, { useState, useCallback, memo } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileText,
  Hash,
  PaintBucket,
  ReceiptIndianRupeeIcon,
  ScaleIcon,
  Loader2,
} from "lucide-react";

const VoucherCard = memo(({ voucherData, onApprove, onReject }) => {
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // API endpoint constant
  const API_BASE_URL = "http://localhost:5001";

  // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  
  // Generic function to handle status updates (DRY principle)
  const updateVoucherStatus = useCallback(async (status, callback) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    const payload = {
      v_status: status,
      v_sysdate: new Date().toISOString(),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(
        `${API_BASE_URL}/up/request/${voucherData.va_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      // Start disappearance animation
      setIsDisappearing(true);

      // Notify parent component after animation
      setTimeout(() => {
        callback(voucherData.va_id);
      }, 300);

    } catch (error) {
      console.error(`Error ${status.toLowerCase()} voucher:`, error);
      
      if (error.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        setError(error.message || 'An error occurred. Please try again.');
      }
      
      setIsProcessing(false);
    }
  }, [isProcessing, voucherData.va_id, API_BASE_URL]);

  //* HANDLE APPROVE
  const handleApprove = useCallback(() => {
    updateVoucherStatus('APPROVED', onApprove);
  }, [updateVoucherStatus, onApprove]);

  //! HANDLE REJECT
  const handleReject = useCallback(() => {
    updateVoucherStatus('REJECTED', onReject);
  }, [updateVoucherStatus, onReject]);

  // Format currency helper
  const formatCurrency = useCallback((amount) => {
    return amount ? `₹ ${amount.toLocaleString("en-IN")}` : "₹ 0.00";
  }, []);

  // Format date helper
  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  //? --- NOW CHECK RENDERING CONDITION AFTER ALL HOOKS ---
  if (voucherData.v_status && voucherData.v_status !== 'PENDING' && !isDisappearing) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl ${
        isDisappearing
          ? "opacity-0 scale-95 translate-y-2"
          : "opacity-100 scale-100 translate-y-0"
      }`}
    >
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label="Dismiss error"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-100">
        {/* Voucher ID */}
        <InfoField
          icon={<Hash className="w-4 h-4 text-green-600" />}
          label="Voucher ID"
          value={voucherData.va_id}
          bgColor="bg-green-50"
        />

        {/* User Email */}
        <InfoField
          icon={<User className="w-4 h-4 text-green-600" />}
          label="User Email"
          value={voucherData.u_email}
          bgColor="bg-green-50"
        />
      </div>

      {/* Vendor & Date Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Vendor Name */}
        <InfoField
          icon={<FileText className="w-4 h-4 text-indigo-600" />}
          label="Vendor Name"
          value={voucherData.v_id}
          bgColor="bg-indigo-50"
        />

        {/* Voucher Date */}
        <InfoField
          icon={<Calendar className="w-4 h-4 text-purple-600" />}
          label="Date"
          value={formatDate(voucherData.v_date)}
          bgColor="bg-purple-50"
        />
      </div>

      <div className="space-y-4 mb-6">
        {/* Product Name */}
        <InfoField
          icon={<FileText className="w-4 h-4 text-orange-600" />}
          label="Item Name"
          value={voucherData.p_name}
          bgColor="bg-orange-50"
        />

        {/* Quantity & Rate */}
        <div className="grid grid-cols-2 gap-4">
          <InfoField
            icon={<PaintBucket className="w-4 h-4 text-yellow-600" />}
            label="Quantity"
            value={voucherData.P_quantity}
            bgColor="bg-yellow-50"
            compact
          />

          <InfoField
            icon={<ScaleIcon className="w-4 h-4 text-yellow-600" />}
            label="Rate"
            value={voucherData.p_rate ? voucherData.p_rate.toLocaleString("en-IN") : "N/A"}
            bgColor="bg-yellow-50"
            compact
          />
        </div>

        {/* Total Amount */}
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-100 shadow-sm">
          <div className="p-2 bg-red-100 rounded-lg">
            <ReceiptIndianRupeeIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
              Total Amount
            </p>
            <p className="text-2xl font-bold text-red-700">
              {formatCurrency(voucherData.P_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          aria-label="Approve voucher"
          className="flex-1 flex justify-center items-center px-4 py-3 text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95 hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              APPROVE
            </>
          )}
        </button>

        <button
          onClick={handleReject}
          disabled={isProcessing}
          aria-label="Reject voucher"
          className="flex-1 flex justify-center items-center px-4 py-3 text-sm font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95 hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 mr-2" />
              REJECT
            </>
          )}
        </button>
      </div>
    </div>
  );
});

// Reusable InfoField Component
const InfoField = memo(({ icon, label, value, bgColor, compact = false }) => (
  <div className={`flex items-center space-x-3 ${compact ? '' : 'mb-2'}`}>
    <div className={`p-2 ${bgColor} rounded-lg flex-shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 truncate">
        {label}
      </p>
      <p 
        className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-gray-900 truncate`} 
        title={value}
      >
        {value}
      </p>
    </div>
  </div>
));

InfoField.displayName = 'InfoField';
VoucherCard.displayName = 'VoucherCard';

export default VoucherCard;