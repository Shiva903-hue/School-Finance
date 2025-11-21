import React, { useState, useCallback, memo } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
  Loader2,
  CreditCard,
  Building2,
  DollarSign,
  MessageSquareMore,
} from "lucide-react";

const TransactionApprovalCard = memo(({ transactionData, onApprove, onReject }) => {
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'APPROVED' or 'REJECTED'
  const [transactionDetails, setTransactionDetails] = useState(transactionData.transaction_details || "");

  // API endpoint constant
  const API_BASE_URL = "http://localhost:8001/api/update/transaction";

  // Generic function to handle status updates
  const updateTransactionStatus = useCallback(async (status, callback) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    const payload = {
      trns_status: status,
      trns_date: new Date().toISOString(),
      transaction_details: transactionDetails.trim() || transactionData.transaction_details || null,
    };

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${transactionData.transaction_id}`,
        payload,
        {
          timeout: 10000 // 10s timeout
        }
      );

      // Start disappearance animation
      setIsDisappearing(true);

      // Notify parent component after animation
      setTimeout(() => {
        callback(transactionData.transaction_id);
      }, 300);

    } catch (error) {
      console.error(`Error ${status.toLowerCase()} transaction:`, error);
      
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else {
        setError(error.response?.data?.message || error.message || 'An error occurred. Please try again.');
      }
      
      setIsProcessing(false);
    }
  }, [isProcessing, transactionData.transaction_id, transactionData.transaction_details, API_BASE_URL, transactionDetails]);

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
      updateTransactionStatus('APPROVED', onApprove);
    } else if (confirmAction === 'REJECTED') {
      updateTransactionStatus('REJECTED', onReject);
    }
  }, [confirmAction, updateTransactionStatus, onApprove, onReject]);

  // Cancel confirmation
  const handleCancelConfirm = useCallback(() => {
    setShowConfirmDialog(false);
    setTransactionDetails(transactionData.transaction_details || "");
    setConfirmAction(null);
  }, [transactionData.transaction_details]);

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

  //? --- Check rendering condition after all hooks ---
  if (transactionData.trns_status && transactionData.trns_status !== "PENDING" && !isDisappearing) {
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
                Are you sure you want to {confirmAction === 'APPROVED' ? 'approve' : 'reject'} transaction #{transactionData.transaction_id} (Voucher #{transactionData.voucher_id})?
              </p>
              
              {/* Transaction Details Input */}
              <div className="mb-6 text-left">
                <label htmlFor="transaction_details" className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Details (Optional)
                </label>
                <textarea
                  id="transaction_details"
                  rows="3"
                  value={transactionDetails}
                  onChange={(e) => setTransactionDetails(e.target.value)}
                  placeholder="Add or update transaction details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep existing details, or update as needed.
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
              <p className="text-lg font-bold text-gray-900">#{transactionData.voucher_id}</p>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold uppercase">Pending</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-4">
        {/* Transaction Type & Bank */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-gray-700 p-2 rounded-lg">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase">Transaction Type</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {transactionData.transaction_type || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-gray-700 p-2 rounded-lg">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase">Bank</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {transactionData.bank_name || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Date */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-gray-700 p-2 rounded-lg">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase">Transaction Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(transactionData.trns_date)}
            </p>
          </div>
        </div>

        {/* Transaction Amount */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-100 uppercase tracking-wide mb-1">Transaction Amount</p>
              <p className="text-2xl font-bold text-white">
                {transactionData.trns_amount && !isNaN(parseFloat(transactionData.trns_amount))
                  ? `₹${parseFloat(transactionData.trns_amount).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                  : "₹ 0.00"}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <span className="text-white text-xl font-bold">₹</span>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        {transactionData.transaction_details && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareMore className="w-4 h-4 text-gray-600" />
              <label className="text-xs font-semibold text-gray-700 uppercase">
                Details
              </label>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {transactionData.transaction_details}
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
            aria-label="Approve transaction"
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
            aria-label="Reject transaction"
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

TransactionApprovalCard.displayName = 'TransactionApprovalCard';

export default TransactionApprovalCard;
