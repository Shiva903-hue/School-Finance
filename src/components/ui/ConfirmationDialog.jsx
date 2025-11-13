import React from "react";
import { AlertCircle, X } from "lucide-react";

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info", // "info", "warning", "danger"
}) {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-50",
          icon: "text-yellow-600",
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "danger":
        return {
          bg: "bg-red-50",
          icon: "text-red-600",
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      default:
        return {
          bg: "bg-blue-50",
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`${colors.bg} p-2 rounded-full`}>
              <AlertCircle className={`w-6 h-6 ${colors.icon}`} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 ${colors.button} text-white rounded-lg transition-all font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
