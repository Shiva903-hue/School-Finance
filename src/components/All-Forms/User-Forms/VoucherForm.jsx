import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ConfirmationDialog from "../../ui/ConfirmationDialog";

export default function VoucherForm() {
  // --- AutoFill Date ---
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // --- STATE MANAGEMENT ---
  const [vendorNames, setVendorNames] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    voucher_entry_date: getCurrentDate(),
    voucher_status: "PENDING",
    product_name: "",
    product_qty: "",
    product_rate: "",
    product_amount: "",
    vendor_id: "",
  });

  const [errors, setErrors] = useState({});

  // --- TOAST NOTIFICATION ---
  const showToast = useCallback((message, type) => {
    setToast({ show: true, message, type });
    const timeout = setTimeout(
      () => setToast({ show: false, message: "", type: "" }),
      3000
    );
    return () => clearTimeout(timeout);
  }, []);

  // --- DATA FETCHING ---

  // Fetches the list of vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/dropdown/vendor-names"
        );
        const data = response.data;
        
        // Handle different response structures
        if (Array.isArray(data)) {
          setVendorNames(data);
        } else if (Array.isArray(data.vendorNames)) {
          setVendorNames(data.vendorNames);
        } else if (Array.isArray(data.data)) {
          setVendorNames(data.data);
        } else {
          setVendorNames([]);
        }
        
        console.log("Fetched vendor data:", data);
      } catch (err) {
        console.error(
          "Could not fetch vendor data. Please ensure the backend server is running: ",
          err
        );
        showToast("❌ Failed to load vendors", "error");
      }
    };

    fetchVendors();
  }, [showToast]);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Update form data
    const updatedData = { ...formData, [name]: value };
    
    // Auto-calculate product_amount when qty or rate changes
    if (name === "product_qty" || name === "product_rate") {
      const qty = name === "product_qty" ? parseFloat(value) || 0 : parseFloat(formData.product_qty) || 0;
      const rate = name === "product_rate" ? parseFloat(value) || 0 : parseFloat(formData.product_rate) || 0;
      updatedData.product_amount = qty * rate;
    }
    
    setFormData(updatedData);
    validateField(name, value, type);
  };

  //? Handle vendor chnage
  const handleVendorChange = (e) => {
    const selectedId = e.target.value;

    const selectedVendor = vendorNames.find(
      (vendor) => vendor.vendor_id.toString() === selectedId
    );

    if (selectedVendor) {
      setFormData((prevData) => ({
        ...prevData,
        vendor_id: selectedVendor.vendor_id,
        vendor_name: selectedVendor.vendor_name, // disply only
      }));
      setErrors((prev) => ({ ...prev, vendor_name: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);
    
    let isValid = true;
    // Re-validate all fields on submit
    Object.entries(formData).forEach(([name, value]) => {
      const inputType = typeof value === "number" ? "number" : "text";
      if (!validateField(name, value, inputType)) {
        isValid = false;
      }
    });

    if (!isValid) {
      console.error("Validation errors:", errors);
      showToast("❌ Please fix validation errors before submitting", "error");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8001/api/generate/purchase-voucher",
        formData
      );
      const data = res.data;
      console.log("Backend response:", res.status, data);

      showToast("✅ Voucher created successfully!", "success");

      setFormData({
        voucher_entry_date: getCurrentDate(),
        voucher_status: "PENDING",
        product_name: "",
        product_qty: "",
        product_rate: "",
        product_amount: "",
        vendor_id: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submission failed:", error);
      const errorMessage = error.response?.data?.message || "❌ Network error occurred during submission";
      showToast(errorMessage, "error");
    }
    console.log("Submitting formData:", formData);
  };

  //? --- VALIDATION LOGIC ---
  const validateField = (name, value, type) => {
    let error = "";

    if (value === null || value.toString().trim() === "") {
      error = "This field is required";
    } else if (type === "number" && !/^\d+(\.\d+)?$/.test(value)) {
      error = "Only numbers are allowed";
    } else if (name === "mobile" && !/^\d{10}$/.test(value)) {
      error = "Enter a valid 10-digit number";
    } else if (name === "Vendor_Name" && !/^[a-zA-Z\s]+$/.test(value)) {
      error = "Only alphabets and spaces are allowed";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  return (
    <div className="w-full px-4 md:px-8 bg-white p-6 rounded-2xl shadow-xl">
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Purchase Voucher
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Voucher Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voucher Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="voucher_entry_date"
              max={getCurrentDate()}
              value={formData.voucher_entry_date}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-lg focus:ring-2 transition-all ${
                errors.v_date
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.v_date && (
              <p className="text-red-500 text-sm mt-1">{errors.v_date}</p>
            )}
          </div>

          {/* Vendor ID Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor Name <span className="text-red-500">*</span>
            </label>
            <select
              name="vendor_id"
              required
              value={formData.vendor_id}
              onChange={handleVendorChange}
              className="mt-1 block w-full p-3 text-base border-gray-300 
             focus:outline-none focus:ring-indigo-500  border
             focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            >
              <option value="" disabled>
                -- Select Vendor Name --
              </option>
              {Array.isArray(vendorNames) &&
                vendorNames.map((vendor) => (
                  <option key={vendor.vendor_id} value={vendor.vendor_id}>
                    {vendor.vendor_name}
                  </option>
                ))}
            </select>

            {errors.Vendor_Name && (
              <p className="text-red-500 text-sm mt-1">{errors.Vendor_Name}</p>
            )}
          </div>

          {/* Other fields... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="Product Name"
              required
              className={`w-full p-3 border rounded-lg ${
                errors.p_name ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.p_name && (
              <p className="text-red-500 text-sm mt-1">{errors.p_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="product_qty"
              value={formData.product_qty}
              onChange={handleChange}
              placeholder="Quantity"
              required
              className={`w-full p-3 border rounded-lg ${
                errors.P_quantity ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.P_quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.P_quantity}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Rate <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="product_rate"
              value={formData.product_rate}
              onChange={handleChange}
              placeholder="Rate"
              required
              className={`w-full p-3 border rounded-lg ${
                errors.p_rate ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.p_rate && (
              <p className="text-red-500 text-sm mt-1">{errors.p_rate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="product_amount"
              value={formData.product_amount}
              onChange={handleChange}
              placeholder="Auto-calculated (Qty × Rate)"
              required
              readOnly
              className={`w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed ${
                errors.P_amount ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.P_amount && (
              <p className="text-red-500 text-sm mt-1">{errors.P_amount}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium shadow-sm transition-colors"
          >
            Submit Request
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedSubmit}
        title="Confirm Submission"
        message="Are you sure you want to submit this voucher? Please review all details before confirming."
        confirmText="Submit"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
}
