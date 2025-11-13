import React, { useState, useEffect, useCallback, useMemo } from "react";
import ConfirmationDialog from "../../ui/ConfirmationDialog";

export default function BankMasterForm() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: "",
    bank_account_no: "",
    bank_ifsc: "",
    bank_branch: "",
    city_id: "",
    state_id: "",
    bank_address: "",
    bank_type: "Self",
    bank_amount: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isCheckingAccount, setIsCheckingAccount] = useState(false);
  
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);

  // Toast notification
  const showToast = useCallback((message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  }, []);

  // Filter cities based on selected state
  const filteredCities = useMemo(() => {
    if (!formData.state_id) return cities;
    return cities.filter((city) => String(city.state_id) === String(formData.state_id));
  }, [cities, formData.state_id]);

  // Check if account number already exists
  const checkAccountNumberExists = useCallback(async (accountNumber) => {
    if (!accountNumber || accountNumber.length < 9) return;
    
    setIsCheckingAccount(true);
    try {
      const response = await fetch(`http://localhost:8001/api/bank/check-account/${accountNumber}`);
      const result = await response.json();
      
      if (result.exists) {
        setErrors((prev) => ({ 
          ...prev, 
          bank_account_no: "This account number already exists" 
        }));
        return false;
      } else {
        setErrors((prev) => ({ 
          ...prev, 
          bank_account_no: "" 
        }));
        return true;
      }
    } catch (error) {
      console.error("Error checking account number:", error);
      // Don't block submission on network error
      return true;
    } finally {
      setIsCheckingAccount(false);
    }
  }, []);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      // Fetch Cities
      setCitiesLoading(true);
      try {
        const citiesRes = await fetch("http://localhost:8001/api/dropdown/city");
        if (!citiesRes.ok) throw new Error("Failed to fetch cities");
        const citiesData = await citiesRes.json();
        if (Array.isArray(citiesData)) setCities(citiesData);
        else if (Array.isArray(citiesData.data)) setCities(citiesData.data);
        else if (Array.isArray(citiesData.cities)) setCities(citiesData.cities);
        else setCities([]);
      } catch (error) {
        console.error("Error fetching cities:", error);
        showToast("Failed to load cities", "error");
      } finally {
        setCitiesLoading(false);
      }

      // Fetch States
      setStatesLoading(true);
      try {
        const statesRes = await fetch("http://localhost:8001/api/dropdown/state");
        if (!statesRes.ok) throw new Error("Failed to fetch states");
        const statesData = await statesRes.json();
        if (Array.isArray(statesData)) setStates(statesData);
        else if (Array.isArray(statesData.data)) setStates(statesData.data);
        else if (Array.isArray(statesData.states)) setStates(statesData.states);
        else setStates([]);
      } catch (error) {
        console.error("Error fetching states:", error);
        showToast("Failed to load states", "error");
      } finally {
        setStatesLoading(false);
      }
    };

    fetchDropdownData();
  }, [showToast]);

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (name === "bank_amount" && !/^\d+$/.test(value)) {
        error = "Only numbers are allowed";
      } else if (name === "bank_account_no" && !/^\d+$/.test(value)) {
        error = "Only numbers are allowed";
      } else if (name === "bank_account_no" && (value.length < 9 || value.length > 18)) {
        error = "Account number must be between 9 and 18 digits";
      }
      if (name === "bank_name" && !/^[a-zA-Z\s]+$/.test(value)) {
        error = "Only alphabets are allowed";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset city when state changes
    if (name === "state_id") {
      setFormData({
        ...formData,
        state_id: Number(value),
        city_id: "", // Reset city selection
      });
    } else {
      setFormData({
        ...formData,
        [name]: ["city_id", "state_id"].includes(name) ? Number(value) : value,
      });
    }
    
    validateField(name, value);
    
    // Check account number uniqueness on blur (debounced check)
    if (name === "bank_account_no" && value.length >= 9) {
      // Clear previous timeout if exists
      const timeoutId = setTimeout(() => {
        checkAccountNumberExists(value);
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);
    
    let isValid = true;
    
    // Validate all required fields
    const requiredFields = ["bank_name", "bank_account_no", "bank_ifsc", "bank_branch", "city_id", "state_id", "bank_address","bank_amount"];
    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToast("Please fill all required fields correctly", "error");
      return;
    }

    // Final check for account number uniqueness before submission
    const accountIsUnique = await checkAccountNumberExists(formData.bank_account_no);
    if (!accountIsUnique) {
      showToast("Account number already exists. Please use a different account number.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/api/bank/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast("Bank details added successfully!", "success");
        console.log("Bank created with response:", result);
        
        // Reset form
        setFormData({
          bank_name: "",
          bank_account_no: "",
          bank_ifsc: "",
          bank_branch: "",
          city_id: "",
          state_id: "",
          bank_address: "",
          bank_type: "company",
          bank_amount: ""
        });
        setErrors({});
      } else {
        showToast(result.message || "Failed to add bank details", "error");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      showToast("Server error while submitting bank details", "error");
    }
  };

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;

  return (
    <div className="w-full h-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
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

      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add Bank Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">


        {/* Bank Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="bank_name"
                value={formData.bank_name}
                placeholder="Enter Bank Name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("bank_name")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  onChange={handleChange}
                  type="text"
                  name="bank_account_no"
                  value={formData.bank_account_no}
                  placeholder="Enter Account Number"
                  maxLength="18"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                {isCheckingAccount && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              {renderError("bank_account_no")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Amount <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="bank_amount"
                value={formData.bank_amount}
                placeholder="Enter Amount"
                maxLength="18"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("bank_amount")}
            </div>
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="bank_ifsc"
                value={formData.bank_ifsc}
                placeholder="Enter IFSC Code"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("bank_ifsc")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="bank_branch"
                value={formData.bank_branch}
                placeholder="Enter Branch Name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("bank_branch")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                name="state_id"
                value={formData.state_id}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
                <option value="">
                  {statesLoading ? "Loading..." : "Select State"}
                </option>
                {states.map((state) => (
                  <option key={state.state_id} value={state.state_id}>
                    {state.state_name}
                  </option>
                ))}
              </select>
              {renderError("state_id")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                name="city_id"
                value={formData.city_id}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
                disabled={!formData.state_id}
              >
                <option value="">
                  {citiesLoading 
                    ? "Loading..." 
                    : !formData.state_id 
                    ? "Select State First" 
                    : filteredCities.length === 0
                    ? "No cities available"
                    : "Select City"}
                </option>
                {filteredCities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
              {renderError("city_id")}
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Address <span className="text-red-500">*</span>
              </label>
              <textarea
                onChange={handleChange}
                name="bank_address"
                value={formData.bank_address}
                placeholder="Enter Full Bank Address"
                rows="3"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("bank_address")}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium shadow-sm"
          >
            Add Bank Details
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedSubmit}
        title="Confirm Submission"
        message="Are you sure you want to add these bank details? Please verify all information before confirming."
        confirmText="Submit"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
}
