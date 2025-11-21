import React, { useState, useCallback, memo } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  User,
  Calendar,
  User2Icon,
  Hash,
  PaintBucket,
  Loader2,
  Scale,
} from "lucide-react";

const VoucherCard = memo(({ voucherData, onApprove, onReject }) => {
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'APPROVED' or 'REJECTED'
  const [description, setDescription] = useState("");

  // API endpoint constant
  const API_BASE_URL = "http://localhost:8001/api/update/voucher";

  // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  
  // Generic function to handle status updates (DRY principle)
  const updateVoucherStatus = useCallback(async (status, callback) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    const payload = {
      voucher_status: status,
      voucher_entry_date: new Date().toISOString(),
      voucher_description: description.trim() || null, // Optional description
    };

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${voucherData.voucher_id}`,
        payload,
        {
          timeout: 10000 // 10s timeout
        }
      );

      // Start disappearance animation
      setIsDisappearing(true);

      // Notify parent component after animation
      setTimeout(() => {
        callback(voucherData.voucher_id);
      }, 300);

    } catch (error) {
      console.error(`Error ${status.toLowerCase()} voucher:`, error);
      
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else {
        setError(error.response?.data?.message || error.message || 'An error occurred. Please try again.');
      }
      
      setIsProcessing(false);
    }
  }, [isProcessing, voucherData.voucher_id, API_BASE_URL, description]);

  //* HANDLE APPROVE
  const handleApprove = useCallback(() => {
    setConfirmAction('APPROVED');
    setShowConfirmDialog(true);
  }, []);

  //! HANDLE REJECT
  const handleReject = useCallback(() => {
    setConfirmAction('REJECTED');
    setShowConfirmDialog(true);
  }, []);

  // Confirm and submit
  const handleConfirmSubmit = useCallback(() => {
    setShowConfirmDialog(false);
    if (confirmAction === 'APPROVED') {
      updateVoucherStatus('APPROVED', onApprove);
    } else if (confirmAction === 'REJECTED') {
      updateVoucherStatus('REJECTED', onReject);
    }
  }, [confirmAction, updateVoucherStatus, onApprove, onReject]);

  // Cancel confirmation
  const handleCancelConfirm = useCallback(() => {
    setShowConfirmDialog(false);
    setDescription("");
    setConfirmAction(null);
  }, []);

  // Format currency helper
  const formatCurrency = useCallback((amount) => {
    if (amount === null || amount === undefined) return "₹ 0.00";
    // Ensure number
    const num = Number(amount) || 0;
    return `₹ ${num.toLocaleString("en-IN")}`;
  }, []);

  // Format date helper
  const formatDate = useCallback((date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  //? --- NOW CHECK RENDERING CONDITION AFTER ALL HOOKS ---
  if (voucherData.voucher_status && voucherData.voucher_status !== "PENDING" && !isDisappearing) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isDisappearing
          ? "opacity-0 scale-95 translate-y-2"
          : "opacity-100 scale-100 translate-y-0"
      }`}
    >
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                confirmAction === 'APPROVED' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {confirmAction === 'APPROVED' ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm {confirmAction === 'APPROVED' ? 'Approval' : 'Rejection'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to {confirmAction === 'APPROVED' ? 'approve' : 'reject'} voucher #{voucherData.voucher_id}?
              </p>
              
              {/* Description Input */}
              <div className="mb-6 text-left">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a note about this decision..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This description will be saved with the voucher status.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelConfirm}
                  disabled={isProcessing}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isProcessing}
                  className={`px-5 py-2.5 text-white rounded-lg transition-all font-medium shadow-md disabled:opacity-50 flex items-center gap-2 ${
                    confirmAction === 'APPROVED' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {confirmAction === 'APPROVED' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Reject
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="m-4 p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Dismiss error"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Hash className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Voucher ID</p>
              <p className="text-lg font-bold text-gray-900">#{voucherData.voucher_id}</p>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold uppercase">Pending</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-4">
        {/* User Email */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-blue-500 p-2 rounded-lg">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase">Requested By</p>
            <p className="text-sm font-semibold text-gray-900 truncate" title={voucherData.user_email || "useremail@notfound.com"}>
              {voucherData.user_email || "useremail@notfound.com"}
            </p>
          </div>
        </div>

        {/* Vendor & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-gray-700 p-2 rounded-lg">
              <User2Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase">Vendor</p>
              <p className="text-sm font-semibold text-gray-900 truncate" title={voucherData.vendor_name}>
                {voucherData.vendor_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-gray-700 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(voucherData.voucher_entry_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
            <User2Icon className="w-4 h-4 text-gray-600" />
            <h4 className="text-xs font-bold text-gray-700 uppercase">Product Details</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Item Name</p>
              <p className="text-sm font-semibold text-gray-900">{voucherData.product_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PaintBucket className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500">Quantity</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{voucherData.product_qty}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500">Rate</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {voucherData.product_rate ? `₹${voucherData.product_rate.toLocaleString("en-IN")}` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-100 uppercase tracking-wide mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(voucherData.product_amount)}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <span className="text-white text-xl font-bold">₹</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {voucherData.voucher_description && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <User2Icon className="w-4 h-4 text-gray-600" />
              <label className="text-xs font-semibold text-gray-700 uppercase">
                Description
              </label>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {voucherData.voucher_description}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            aria-label="Approve voucher"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Approve</span>
              </>
            )}
          </button>

          <button
            onClick={handleReject}
            disabled={isProcessing}
            aria-label="Reject voucher"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Reject</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

VoucherCard.displayName = 'VoucherCard';

export default VoucherCard;