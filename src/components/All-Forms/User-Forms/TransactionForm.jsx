import React, { useState, useEffect } from "react";


// const getStatusTheme = (status) => {
//   // Use toUpperCase() here to match the case labels (PENDING, REJECTED, etc.)
//   const upperStatus = (status || '').toUpperCase();
  
//   switch (upperStatus) {
//     case "PENDING":
//       return "text-orange-600 border-orange-600 bg-orange-200";
//     case "REJECTED":
//       return "text-red-600 border-red-600 bg-red-200";
//     case "ACCEPTED":
//       return "text-green-600 border-green-600 bg-green-200";
//     default:
//       return "text-gray-600 border-gray-400 bg-gray-100";
//   }
// };


export default function TransactionForm() {

      // --- AutoFill Date ---
  const getCurrentDate = ()=>{
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [voucherData, setVoucherData] = useState([]);
  // const [selectedVoucherStatus, setSelectedVoucherStatus] = useState("");

  const [formData, setFormData] = useState({
    u_email: "",
    // t_id: "",
    t_type: "",
    t_detail: "",
    t_date: getCurrentDate(),
    t_amount: "",
    v_name: "",
    t_mode: "",
    status: "", 
    va_id: "",
    p_name: "",
    P_amount: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch("http://localhost:5001/get/voucherdata");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVoucherData(data);
      } catch (e) {
        console.error(
          "Could not fetch voucher data. Backend server might not be running: ",
          e
        );
      }
    };
    fetchVouchers();
  }, []);

  const validateField = (name, value, type) => {
    let error = "";
    if (value === "" || value === null || value === undefined) {
      if (name !== 't_detail') {
        error = "This field is required";
      }
    } else {
      if (type === "number" && !/^\d*\.?\d*$/.test(String(value))) {
        error = "Only numbers are allowed";
      }
      if (name.toLowerCase().includes("name") && !/^[a-zA-Z\s]+$/.test(value)) {
        error = "Only alphabets are allowed";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Update form data state
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "va_id") {
      const selectedVoucher = voucherData.find(
        (voucher) => String(voucher.va_id) === value
      );

      if (selectedVoucher) {
        setFormData((prev) => ({
          ...prev,
          p_name: selectedVoucher.p_name || "",
          P_amount: selectedVoucher.P_amount || "",
          t_amount: selectedVoucher.P_amount || "",
          v_name: selectedVoucher.vender_name || "",

          status: selectedVoucher.v_status || "", 
        }));
        // setSelectedVoucherStatus(selectedVoucher.v_status || "N/A");
      } else {
        setFormData((prev) => ({
          ...prev,
          p_name: "",
          P_amount: "",
          t_amount: "",
          v_name: "",
          status: "",
        }));
        // setSelectedVoucherStatus("");
      }
    }

    const error = validateField(name, value, type);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const tempErrors = {};

    Object.entries(formData).forEach(([name, value]) => {
      //! t_id is removed form these
      const type = ["t_amount", "P_amount"].includes(name)
        ? "number"
        : "text";
      
      if (name === "t_detail") return;

      const error = validateField(name, value, type);
      if (error) {
        isValid = false;
        tempErrors[name] = error;
      }
    });

    setErrors(tempErrors);

    if (!isValid) {
      alert("Please fix validation errors before submitting.");
      return;
    }
    
    try {
        const res = await fetch("http://localhost:5001/api/transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            alert("✅ Transaction details inserted successfully");
            setFormData({
                u_email: "",
                // t_id: "",
                t_type: "",
                t_detail: "",
                t_date: "",
                t_amount: "",
                v_name: "",
                t_mode: "",
                status: "",
                va_id: "",
                p_name: "",
                P_amount: "",
            });
            // setSelectedVoucherStatus("");
            setErrors({});
        } else {
            alert("❌ Error sending request");
        }
    } catch (error) {
        console.error("Submission Error:", error);
        alert("❌ An error occurred while submitting the form.");
    }
  };


  return (
    <div className="w-full px-4 md:px-8 bg-white p-6 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Transaction Form
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Voucher Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Voucher Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Voucher ID -   */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voucher ID <span className="text-red-500">*</span>
                </label>
                <select
                  name="va_id"
                  className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                    errors.va_id
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  required
                  onChange={handleChange}
                  value={formData.va_id || ""}
                >
                  <option value="" disabled>
                    -- Select a Voucher --
                  </option>
                  {voucherData.map((voucher) => (
                    <option key={voucher.va_id} value={voucher.va_id}>
                      {voucher.va_id}
                    </option>
                  ))}
                </select>
                {errors.va_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.va_id}</p>
                )}
              </div>

              {/* Product Name -   */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="p_name"
                  placeholder="Product Name"
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                  required
                  readOnly
                  value={formData.p_name || ""}
                />
              </div>
            </div>
          </div>
          
          {/* Transaction Details -   */}

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Transaction Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {/* Mode of Deposit (Radio) -   */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode of Deposit <span className="text-red-500">*</span>
                </label>
                <select
                  name="t_mode"
                  className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                    errors.t_mode
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  onChange={handleChange}
                  value={formData.t_mode || ""}
                >
                  <option value="" disabled>
                    -- Select Mode of Deposit --
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="Cheque">Cheque</option>
                  <option value="RTGS">RTGS</option>
                  <option value="DD">DD</option>
                </select>
                {errors.t_mode && (
                  <p className="text-red-500 text-sm mt-1">{errors.t_mode}</p>
                )}
              </div>

              {/* Vendor Name -   */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="v_name"
                  placeholder="Enter Vendor Name"
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                  required
                  readOnly
                  value={formData.v_name || ""}
                />
              </div>

              {/* Transaction Amount -   */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="t_amount"
                  placeholder="Enter Transaction Amount"
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                  required
                  readOnly
                  value={formData.t_amount || ""}
                />
              </div>

              {/* Transaction Date -   */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="t_date"
                  className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                    errors.t_date
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  required
                  readOnly
                  onChange={handleChange}
                  value={formData.t_date || ""}
                />
                {errors.t_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.t_date}</p>
                )}
              </div>
                            {/* Transaction Details (Textarea) -   */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Details
                </label>
                <textarea
                  name="t_detail"
                  placeholder="Enter Transaction details"
                  rows="3"
                  className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                    errors.t_detail
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  onChange={handleChange}
                  value={formData.t_detail || ""}
                />
                {errors.t_detail && (
                  <p className="text-red-500 text-sm mt-1">{errors.t_detail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button -   */}
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