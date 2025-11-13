import React, { useEffect, useState } from "react";
import ConfirmationDialog from "../../ui/ConfirmationDialog";

export default function Deposit() {
  const [bankName, setBankName] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    Txn_amount: "",
    Bank_id: "", 
    transaction_type_id: "", 
    transaction_date: "",
    cheque_dd_number: "", 
    rtgs_number: "", 
  });

  const [errors, setErrors] = useState({});

  // Toast notification helper
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  //* Fetch Bank Names and Transaction Types
  useEffect(() => {
    const fetchDropdownData = async () => {
      // Fetch Banks
      try {
        const response = await fetch("http://localhost:8001/bank/self");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const bankArray = Array.isArray(data) ? data : data.bankDetails || data.banks || data.data || [];
        console.log("Fetched banks:", bankArray);
        setBankName(bankArray);
      } catch (e) {
        console.error("Could not fetch bank data:", e);
        showToast("Failed to load banks", "error");
      }

      // Fetch Transaction Types
      try {
        const response = await fetch("http://localhost:8001/api/dropdown/transaction-types");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const typesArray = Array.isArray(data) ? data : data.transactionTypes || data.data || [];
        console.log("Fetched transaction types:", typesArray);
        setTransactionTypes(typesArray);
      } catch (e) {
        console.error("Could not fetch transaction types:", e);
        showToast("Failed to load transaction types", "error");
      }
    };

    fetchDropdownData();
  }, []);

  //* Validation function
  const validateField = (name, value) => {
    let error = "";
    
    
    if (value === "" || value === null || value === undefined) {
      error = "This field is required";
    } else {
      // Validation for amount (numeric only, allows decimals)
      if (name === "Txn_amount") {
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
           error = "Only non-negative numbers are allowed";
        }
      }
      
      // Get selected transaction type name for validation
      const selectedType = transactionTypes.find(t => t.transaction_type_id === parseInt(formData.transaction_type_id));
      const typeName = selectedType ? selectedType.transaction_type : "";
      
      // Validation for cheque/DD numbers based on transaction type
      if (name === "cheque_dd_number") {
        if (typeName === "Demand Draft") {
          // DD must be exactly 6 digits
          if (!/^\d{6}$/.test(value)) {
            error = "DD number must be exactly 6 digits";
          }
        } else if (typeName === "Cheque") {
          // Cheque must be numeric
          if (!/^\d+$/.test(value)) {
            error = "Cheque number must contain only numbers";
          }
        }
      }
      
      // RTGS number must be exactly 22 alphanumeric characters
      if (name === "rtgs_number") {
        if (value.trim() === "") {
          error = "RTGS number is required";
        } else if (!/^[A-Za-z0-9]{22}$/.test(value)) {
          error = "RTGS number must be exactly 22 alphanumeric characters";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  //* handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  //* HandleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    // Define core required fields (date is always required)
    const requiredFields = ['Txn_amount', 'Bank_id', 'transaction_type_id', 'transaction_date'];
    
    // Get selected transaction type name
    const selectedType = transactionTypes.find(t => t.transaction_type_id === parseInt(formData.transaction_type_id));
    const typeName = selectedType ? selectedType.transaction_type : "";
    
    // Add transaction_type_id-specific required fields
    if (typeName === "Cheque" || typeName === "Demand Draft") {
        requiredFields.push('cheque_dd_number');
    } else if (typeName === "Rtgs") {
        requiredFields.push('rtgs_number');
    }
    
    // Validate all required fields
    requiredFields.forEach((name) => {
      if (!validateField(name, formData[name])) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToast("Please fix validation errors before submitting.", "error");
      return;
    }
    
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  //* Handle confirmed submission
  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);
    
    // Prepare payload for backend
    const payload = {
      Txn_type: "Deposit", // Fixed value
      Bank_id: parseInt(formData.Bank_id),
      Txn_amount: parseFloat(formData.Txn_amount),
      transaction_type_id: parseInt(formData.transaction_type_id),
      transaction_date: formData.transaction_date || null,
      cheque_dd_number: formData.cheque_dd_number ? parseInt(formData.cheque_dd_number) : null,
      rtgs_number: formData.rtgs_number || null,
    };
    
    try {
      const res = await fetch('http://localhost:8001/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      
      if (res.ok) {
        showToast(result.message || "Deposit submitted successfully!", "success");
        // Reset form
        setFormData({
          Txn_amount: "",
          Bank_id: "",
          transaction_type_id: "",
          transaction_date: "",
          cheque_dd_number: "",
          rtgs_number: ""
        });
        setErrors({});
      } else {
        showToast(result.message || "Failed to submit deposit", "error");
      }
    } catch (err) {
      console.error('Error:', err);
      showToast('Failed to submit deposit. Please check if server is running.', "error");
    }
  };

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;
    
  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Deposit Slip
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Deposit Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            Deposit Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Txn_amount"
                value={formData.Txn_amount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount (Numbers only)"
                required
              />
              {renderError("Txn_amount")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Bank <span className="text-red-500">*</span>
              </label>
              <select
                name="Bank_id"
                value={formData.Bank_id}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  -- Choose Bank --
                </option>
                {bankName.map((bank) => (
                  <option key={bank.bank_id} value={bank.bank_id}>
                    {bank.bank_name}
                  </option>
                ))}
              </select>
              {renderError("Bank_id")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              {renderError("transaction_date")}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Deposit <span className="text-red-500">*</span>
            </label>
            <select
              name="transaction_type_id"
              value={formData.transaction_type_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select mode</option>
              {transactionTypes.map((type) => (
                <option key={type.transaction_type_id} value={type.transaction_type_id}>
                  {type.transaction_type}
                </option>
              ))}
            </select>
            {renderError("transaction_type_id")}
          </div>

          {(() => {
            const selectedType = transactionTypes.find(t => t.transaction_type_id === parseInt(formData.transaction_type_id));
            const typeName = selectedType ? selectedType.transaction_type : "";
            
            if (typeName === "Cheque" || typeName === "Demand Draft") {
              return (
                <div className="pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {typeName} Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={typeName === "Demand Draft" ? "Enter DD Number (6 digits)" : `Enter ${typeName} Number (Numbers only)`}
                      name="cheque_dd_number"
                      value={formData.cheque_dd_number}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={typeName === "Demand Draft" ? "6" : undefined}
                      required
                    />
                    {renderError("cheque_dd_number")}
                  </div>
                </div>
              );
            } else if (typeName === "Rtgs") {
              return (
                <div className="pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RTGS Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="rtgs_number"
                      placeholder="Enter RTGS Number (22 alphanumeric characters)"
                      value={formData.rtgs_number}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength="22"
                      required
                    />
                    {renderError("rtgs_number")}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium shadow-sm"
          >
            Apply Deposit
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedSubmit}
        title="Confirm Deposit"
        message="Are you sure you want to submit this deposit? Please verify all details before confirming."
        confirmText="Submit"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
}