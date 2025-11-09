import React, { useState, useEffect, useCallback } from "react";

export default function TransactionForm() {
  // --- AutoFill Date ---
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ---- State ----
  const [voucherData, setVoucherData] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);

  const [formData, setFormData] = useState({
    transaction_type_id: "",
    transaction_details: "",
    trns_date: getCurrentDate(),
    trns_status: "PENDING",
    voucher_id: "",
    bank_id: 2,
  });

 
  const [autoFields, setAutoFields] = useState({
    p_name: "",
    t_amount: "",
    v_name: "",
    vendor_id: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = useCallback((message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  }, []);

  //* Validation helper
  const validateField = (name, value, type) => {
    let error = "";

    // Treat empty strings/null/undefined as missing (unless allowed)
    if (value === "" || value === null || value === undefined) {
      //transaction_details is optional in your original logic
      if (name !== "transaction_details") {
        error = "This field is required";
      }
    } else {
      if (type === "number" && !/^\d*\.?\d*$/.test(String(value))) {
        error = "Only numbers are allowed";
      }
      // name-like fields should be alphabets & spaces only (original logic)
      if (name.toLowerCase().includes("name") && !/^[a-zA-Z\s]+$/.test(value)) {
        error = "Only alphabets are allowed";
      }
    }

    return error;
  };

  // * Fetch dropdown data (vouchers + transaction types)
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        //* Vouchers
        const voucherRes = await fetch(
          "http://localhost:8001/api/dropdown/voucher-ids"
        );
        const voucherJson = await voucherRes.json();
        // accept different response shapes
        if (voucherJson && Array.isArray(voucherJson.voucherIDs)) {
          setVoucherData(voucherJson.voucherIDs);
        } else if (Array.isArray(voucherJson.data)) {
          setVoucherData(voucherJson.data);
        } else if (Array.isArray(voucherJson)) {
          setVoucherData(voucherJson);
        } else {
          setVoucherData([]);
        }

        //* Transaction types
        const typeRes = await fetch(
          "http://localhost:8001/api/dropdown/transaction-types"
        );
        const typeJson = await typeRes.json();
        console.log("Fetched transaction types:", typeJson);

        if (typeJson && Array.isArray(typeJson.transactionTypes)) {
          setTransactionTypes(typeJson.transactionTypes);
        } else if (Array.isArray(typeJson.data)) {
          setTransactionTypes(typeJson.data);
        } else if (Array.isArray(typeJson)) {
          setTransactionTypes(typeJson);
        } else {
          setTransactionTypes([]);
        }
      } catch (err) {
        console.error("Dropdown fetch error:", err);
      }
    };

    fetchDropdownData();
  }, []);

  //*   handler with validation + autofill voucher logic 
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    //* Auto-fill when voucher changes
    if (name === "voucher_id") {
      const selectedVoucher = voucherData.find(
        (v) => String(v.voucher_id) === String(value)
      );

      if (selectedVoucher) {
        setAutoFields({
          p_name: selectedVoucher.product_name || "",
          t_amount: selectedVoucher.product_amount || "",
          v_name: selectedVoucher.vendor_name || "",
          vendor_id: selectedVoucher.vendor_id || "",
        });
      } else {
        setAutoFields({ p_name: "", t_amount: "", v_name: "", vendor_id: "" });
      }
    }

    // Determine type for validation (number for amounts)
    const type = ["t_amount", "P_amount"].includes(name) ? "number" : "text";
    // Note: transaction_details can be optional, but we still validate when not empty
    const error = validateField(name, value, type);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ---- Submit handler (send only required six fields) ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    //* Prepare payload with only required fields
    const payload = {
      transaction_type_id: formData.transaction_type_id,
      transaction_details: formData.transaction_details,
      trns_date: formData.trns_date,
      trns_status: formData.trns_status,
      voucher_id: formData.voucher_id,
      bank_id: formData.bank_id,
    };

    // Validate each required field using same validateField rules
    const tempErrors = {};
    let isValid = true;
    for (const [name, value] of Object.entries(payload)) {
      // choose validation type: only numeric check for amounts if any (none here except bank/voucher ids)
      const type = ["t_amount", "P_amount"].includes(name) ? "number" : "text";
      const err = validateField(name, value, type);
      if (err) {
        tempErrors[name] = err;
        isValid = false;
      }
    }

    setErrors((prev) => ({ ...prev, ...tempErrors }));

    if (!isValid) {
      showToast("Please fix validation errors before submitting.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8001/api/request/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        showToast("Transaction submitted successfully!", "success");

        setFormData({
          transaction_type_id: "",
          transaction_details: "",
          trns_date: getCurrentDate(),
          trns_status: "PENDING",
          voucher_id: "",
          bank_id: 2,
        });
        setAutoFields({ p_name: "", t_amount: "", v_name: "", vendor_id: "" });
        setErrors({});
      } else {
        console.error("Transaction submit response:", data);
        showToast("Error submitting transaction. Check console for details.", "error");
      }
    } catch (err) {
      console.error("Submission error:", err);
      showToast("Failed to connect to server.", "error");
    }
  };

  return (
    <div className="w-full px-4 md:px-8 bg-white p-6 rounded-2xl shadow-xl">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Transaction Form
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Voucher + auto fields */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Voucher Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voucher ID <span className="text-red-500">*</span>
                </label>
                <select
                  name="voucher_id"
                  className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                    errors.voucher_id
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  onChange={handleChange}
                  value={formData.voucher_id || ""}
                  required
                >
                  <option value="" disabled>
                    -- Select a Voucher --
                  </option>
                  {Array.isArray(voucherData) &&
                    voucherData.map((voucher) => (
                      <option key={voucher.voucher_id} value={voucher.voucher_id}>
                        {voucher.voucher_id}
                      </option>
                    ))}
                </select>
                {errors.voucher_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.voucher_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={autoFields.p_name}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name
                </label>
                <input
                  name="v_name"
                  placeholder="Vendor"
                  value={autoFields.v_name}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Amount
                </label>
                <input
                  type="text"
                  name="t_amount"
                  placeholder="Amount"
                  value={autoFields.t_amount}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Transaction Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="transaction_type_id"
                  className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                    errors.transaction_type_id
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  onChange={handleChange}
                  value={formData.transaction_type_id || ""}
                  required
                >
                  <option value="" disabled>
                    -- Select Mode of Deposit --
                  </option>
                  {Array.isArray(transactionTypes) &&
                    transactionTypes.map((type) => (
                      <option
                        key={type.transaction_type_id}
                        value={type.transaction_type_id}
                      >
                        {type.transaction_type}
                      </option>
                    ))}
                </select>
                {errors.transaction_type_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.transaction_type_id}
                  </p>
                )}
              </div>

              {/* Readonly bank_id display */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank ID
                </label>
                <input
                  type="text"
                  name="bank_id_display"
                  value={String(formData.bank_id)}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              
                <input type="hidden" name="bank_id" value={formData.bank_id} />
              </div> */}


              {/* Transaction Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="trns_date"
                  className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                    errors.trns_date
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  onChange={handleChange}
                  value={formData.trns_date || getCurrentDate()}
                  required
                />
                {errors.trns_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.trns_date}</p>
                )}
              </div>

              {/* Transaction Details textarea */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Details
                </label>
                <textarea
                  name="transaction_details"
                  placeholder="Enter Transaction details"
                  rows="3"
                  className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                    errors.transaction_details
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  onChange={handleChange}
                  value={formData.transaction_details || ""}
                />
                {errors.transaction_details && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.transaction_details}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium shadow-sm"
            >
              Submit Transaction
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
