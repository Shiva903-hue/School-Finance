import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

export default function MultiStepVendorForm({ setVendorForm }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(""); // "bank" or "vendor"

  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    bank_account_no: "",
    bank_ifsc: "",
    bank_branch: "",
    city_id: "",
    state_id: "",
    bank_address: "",
    bank_type: "vendor",
  });

  const [vendorDetails, setVendorDetails] = useState({
    vendor_type_id: "",
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_GST: "",
    vendor_status: "active",
    city_id: "",
    state_id: "",
    vendor_address: "",
    bank_id: "",
  });

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [vendorTypes, setVendorTypes] = useState([]);
  const [banks, setBanks] = useState([]);

  const [citiesLoading, setCitiesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [vendorTypesLoading, setVendorTypesLoading] = useState(false);
  const [banksLoading, setBanksLoading] = useState(false);

  const [citiesError, setCitiesError] = useState(null);
  const [statesError, setStatesError] = useState(null);
  const [vendorTypesError, setVendorTypesError] = useState(null);
  const [banksError, setBanksError] = useState(null);

  // ===================== Toast =====================
  const showToast = useCallback((message, type) => {
    setToast({ show: true, message, type });
    const timeout = setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // ===================== Fetch Dropdown Data =====================
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
        setCitiesError(error);
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
        setStatesError(error);
        showToast("Failed to load states", "error");
      } finally {
        setStatesLoading(false);
      }

      // Fetch Vendor Types
      setVendorTypesLoading(true);
      try {
        const vendorTypesRes = await fetch("http://localhost:8001/api/dropdown/vendor-types");
        if (!vendorTypesRes.ok) throw new Error("Failed to fetch vendor types");
        const vendorTypesData = await vendorTypesRes.json();
        if (Array.isArray(vendorTypesData)) setVendorTypes(vendorTypesData);
        else if (Array.isArray(vendorTypesData.data)) setVendorTypes(vendorTypesData.data);
        else if (Array.isArray(vendorTypesData.vendorTypes)) setVendorTypes(vendorTypesData.vendorTypes);
        else if (Array.isArray(vendorTypesData.types)) setVendorTypes(vendorTypesData.types);
        else setVendorTypes([]);
      } catch (error) {
        setVendorTypesError(error);
        showToast("Failed to load vendor types", "error");
      } finally {
        setVendorTypesLoading(false);
      }

      // Fetch Banks
      setBanksLoading(true);
      try {
        const banksRes = await fetch("http://localhost:8001/api/dropdown/banks");
        if (!banksRes.ok) throw new Error("Failed to fetch banks");
        const banksData = await banksRes.json();
        if (Array.isArray(banksData)) setBanks(banksData);
        else if (Array.isArray(banksData.data)) setBanks(banksData.data);
        else if (Array.isArray(banksData.banks)) setBanks(banksData.banks);
        else setBanks([]);
      } catch (error) {
        setBanksError(error);
        showToast("Failed to load banks", "error");
      } finally {
        setBanksLoading(false);
      }
    };

    fetchDropdownData();
  }, [showToast]);


  useEffect(() => {
    const fetchDropdownData = async () => {
       //* Fetch Vendor Types
      setVendorTypesLoading(true);
      try {
        const vendorTypesRes = await fetch("http://localhost:8001/api/dropdown/vendor-types");
        if (!vendorTypesRes.ok) throw new Error("Failed to fetch vendor types");
        const vendorTypesData = await vendorTypesRes.json();
        if (Array.isArray(vendorTypesData)) setVendorTypes(vendorTypesData);
        else if (Array.isArray(vendorTypesData.data)) setVendorTypes(vendorTypesData.data);
        else if (Array.isArray(vendorTypesData.vendorTypes)) setVendorTypes(vendorTypesData.vendorTypes);
        else if (Array.isArray(vendorTypesData.types)) setVendorTypes(vendorTypesData.types);
        else setVendorTypes([]);
      } catch (error) {
        setVendorTypesError(error);
        showToast("Failed to load vendor types", "error");
      } finally {
        setVendorTypesLoading(false);
      }

      // Fetch Banks
      setBanksLoading(true);
      try {
        const banksRes = await fetch("http://localhost:8001/api/dropdown/banks");
        if (!banksRes.ok) throw new Error("Failed to fetch banks");
        const banksData = await banksRes.json();
        if (Array.isArray(banksData)) setBanks(banksData);
        else if (Array.isArray(banksData.data)) setBanks(banksData.data);
        else if (Array.isArray(banksData.banks)) setBanks(banksData.banks);
        else setBanks([]);
      } catch (error) {
        setBanksError(error);
        showToast("Failed to load banks", "error");
      } finally {
        setBanksLoading(false);
      }
    };

    fetchDropdownData();
  }, [showToast, currentStep]);



  // ===================== Validation =====================
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (["vendor_mobile", "bank_account_no"].includes(name) && !/^\d+$/.test(value)) {
        error = "Only numbers are allowed";
      }
      if (name === "bank_account_no" && (value.length < 9 || value.length > 18)) {
        error = "Account number must be between 9 and 18 digits";
      }
      if (["vendor_name", "bank_name"].includes(name) && !/^[a-zA-Z\s]+$/.test(value)) {
        error = "Only alphabets are allowed";
      }
      if (name === "vendor_mobile" && !/^\d{10}$/.test(value)) {
        error = "Enter a valid 10-digit number";
      }
      if (name === "vendor_email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const validateStep = (step) => {
    let isValid = true;
    const fieldsToValidate =
      step === 1
        ? ["bank_name", "bank_account_no", "bank_ifsc", "bank_branch", "city_id", "state_id", "bank_address"]
        : [
            "vendor_type_id",
            "vendor_name",
            "vendor_mobile",
            "vendor_email",
            "vendor_GST",
            "bank_id",
            "city_id",
            "state_id",
            "vendor_address",
          ];

    fieldsToValidate.forEach((field) => {
      const value = step === 1 ? bankDetails[field] : vendorDetails[field];
      if (!validateField(field, value)) isValid = false;
    });
    return isValid;
  };

  // ===================== Input Handlers =====================
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({
      ...bankDetails,
      [name]: ["city_id", "state_id"].includes(name) ? Number(value) : value,
    });
    validateField(name, value);
  };

  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendorDetails({
      ...vendorDetails,
      [name]: ["city_id", "state_id", "vendor_type_id", "bank_id"].includes(name) ? Number(value) : value,
    });
    validateField(name, value);
  };

  // ===================== Submit Handlers =====================
  const handleBankSubmit = async () => {
    if (!validateStep(1)) {
      showToast("Please fill all required fields correctly", "error");
      return;
    }

    // Show confirmation dialog
    setConfirmationType("bank");
    setShowConfirmation(true);
  };

  const handleBankSubmitConfirmed = async () => {
    setShowConfirmation(false);

    try {
      const response = await fetch("http://localhost:8001/api/bank/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankDetails),
      });

      const result = await response.json();

      if (response.ok) {
        showToast("✅ Bank details submitted successfully!", "success");
        console.log("Bank created with response:", result);

        // Note: Bank selection will be done via dropdown in vendor form
        setTimeout(() => setCurrentStep(2), 1000);
      } else {
        showToast(result.message || "❌ Failed to submit bank details", "error");
      }
    } catch (error) {
      console.error("Error submitting bank details:", error);
      showToast("❌ Server error while submitting bank details", "error");
    }
  };

  const handleVendorSubmit = async () => {
    if (!validateStep(2)) {
      showToast("Please fill all required fields correctly", "error");
      return;
    }

    // Show confirmation dialog
    setConfirmationType("vendor");
    setShowConfirmation(true);
  };

  const handleVendorSubmitConfirmed = async () => {
    setShowConfirmation(false);

    try {
      const response = await fetch("http://localhost:8001/api/vendor/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorDetails),
      });

      const result = await response.json();

      if (response.ok) {
        showToast("✅ Vendor details submitted successfully!", "success");
        console.log("Vendor created with response:", result);

        setTimeout(() => {
          setBankDetails({
            bank_name: "",
            bank_account_no: "",
            bank_ifsc: "",
            bank_branch: "",
            city_id: "",
            state_id: "",
            bank_address: "",
            bank_type: "",
          });
          setVendorDetails({
            vendor_type_id: "",
            vendor_name: "",
            vendor_mobile: "",
            vendor_email: "",
            vendor_GST: "",
            vendor_status: "",
            city_id: "",
            state_id: "",
            vendor_address: "",
            bank_id: "",
          });
          setErrors({});
          setToast({ show: false, message: "", type: "" });
          setCurrentStep(1);
          setVendorForm(false);
        }, 2000);
      } else {
        showToast(result.message || "❌ Failed to submit vendor details", "error");
      }
    } catch (error) {
      console.error("Error submitting vendor details:", error);
      showToast("❌ Server error while submitting vendor details", "error");
    }
  };

  // ===================== Render Error Helper =====================
  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>;

  // ===================== Component JSX =====================
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
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

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Submission
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {confirmationType === "bank"
                  ? "Are you sure you want to submit the bank details? You will proceed to vendor details after submission."
                  : "Are you sure you want to submit the vendor details? This will complete the vendor registration."}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    confirmationType === "bank"
                      ? handleBankSubmitConfirmed
                      : handleVendorSubmitConfirmed
                  }
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="relative w-full max-w-xl sm:max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Add Vendor</h2>
                <button
                  type="button"
                  onClick={() => {
                    setVendorForm(false);
                    setCurrentStep(1);
                    setErrors({});
                    setToast({ show: false, message: "", type: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="relative flex items-center justify-between">
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      currentStep === 1
                        ? "bg-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {currentStep === 1 ? "1" : "✓"}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-700">Bank Details</span>
                </div>

                <div className="absolute top-5 sm:top-6 left-0 right-0 h-1 bg-gray-200 mx-5 sm:mx-6">
                  <div
                    className={`h-full bg-blue-600 transition-all duration-500 ${
                      currentStep === 2 ? "w-full" : "w-0"
                    }`}
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      currentStep === 2
                        ? "bg-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-700">Vendor Details</span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-grow overflow-y-auto">
              <div className="px-4 sm:px-6 py-4 space-y-4">
                {currentStep === 1 ? (
                  // Bank Details
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                      Add Bank Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Bank Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="bank_name"
                          placeholder="Bank Name"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleBankChange}
                          value={bankDetails.bank_name}
                        />
                        {renderError("bank_name")}
                      </div>
                      {/* Account Number */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="bank_account_no"
                          placeholder="Enter Account Number (9-18 digits)"
                          maxLength="18"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleBankChange}
                          value={bankDetails.bank_account_no}
                        />
                        {renderError("bank_account_no")}
                      </div>
                      {/* IFSC */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="bank_ifsc"
                          placeholder="IFSC Code"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleBankChange}
                          value={bankDetails.bank_ifsc}
                        />
                        {renderError("bank_ifsc")}
                      </div>
                      {/* Branch */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Branch <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="bank_branch"
                          placeholder="Branch Name"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleBankChange}
                          value={bankDetails.bank_branch}
                        />
                        {renderError("bank_branch")}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="state_id"
                          onChange={handleBankChange}
                          value={bankDetails.state_id}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">
                            {statesLoading ? "Loading..." : "Select a state"}
                          </option>
                          {states.map((state) => (
                            <option key={state.state_id} value={state.state_id}>
                              {state.state_name}
                            </option>
                          ))}
                        </select>
                        {statesError && (
                          <p className="text-red-500 text-xs mt-1">
                            {statesError.message || statesError.toString()}
                          </p>
                        )}
                        {renderError("state_id")}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="city_id"
                          onChange={handleBankChange}
                          value={bankDetails.city_id}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">
                            {citiesLoading ? "Loading..." : "Select a city"}
                          </option>
                          {cities.map((city) => (
                            <option key={ city.city_id} value={city.city_id}>
                              {city.city_name}
                            </option>
                          ))}
                        </select>
                        {citiesError && (
                          <p className="text-red-500 text-xs mt-1">
                            {citiesError.message || citiesError.toString()}
                          </p>
                        )}
                        {renderError("city_id")}
                      </div>

                      {/* Bank Address */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Bank Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="bank_address"
                          placeholder="Branch Address"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleBankChange}
                          value={bankDetails.bank_address}
                        />
                        {renderError("bank_address")}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Vendor Details
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                      Add Vendor Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Vendor Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="vendor_name"
                          placeholder="Vendor Name"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleVendorChange}
                          value={vendorDetails.vendor_name}
                        />
                        {renderError("vendor_name")}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          GST Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="vendor_GST"
                          placeholder="GST Number"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleVendorChange}
                          value={vendorDetails.vendor_GST}
                        />
                        {renderError("vendor_GST")}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="vendor_email"
                          placeholder="Email"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleVendorChange}
                          value={vendorDetails.vendor_email}
                        />
                        {renderError("vendor_email")}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="vendor_mobile"
                          placeholder="Mobile Number"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleVendorChange}
                          value={vendorDetails.vendor_mobile}
                        />
                        {renderError("vendor_mobile")}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Vendor Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="vendor_type_id"
                          onChange={handleVendorChange}
                          value={vendorDetails.vendor_type_id}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">
                            {vendorTypesLoading ? "Loading..." : "Select a vendor type"}
                          </option>
                          {vendorTypes.map((type) => (
                            <option key={type.id || type.vendor_type_id} value={type.id || type.vendor_type_id}>
                              {type.vendor_type_name}
                            </option>
                          ))}
                        </select>
                        {vendorTypesError && (
                          <p className="text-red-500 text-xs mt-1">
                            {vendorTypesError.message || vendorTypesError.toString()}
                          </p>
                        )}
                        {renderError("vendor_type_id")}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Select Bank <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="bank_id"
                          onChange={handleVendorChange}
                          value={vendorDetails.bank_id}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">
                            {banksLoading ? "Loading..." : "Select a bank"}
                          </option>
                          {banks.map((bank) => (
                            <option key={ bank.bank_id} value={bank.bank_id}>
                              {bank.bank_name} - {bank.bank_account_no}
                            </option>
                          ))}
                        </select>
                        {banksError && (
                          <p className="text-red-500 text-xs mt-1">
                            {banksError.message || banksError.toString()}
                          </p>
                        )}
                        {renderError("bank_id")}
                      </div>

                      {/* state */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="state_id"
                          onChange={handleVendorChange}
                          value={vendorDetails.state_id}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">
                            {statesLoading ? "Loading..." : "Select a state"}
                          </option>
                          {states.map((state) => (
                            <option key={state.state_id} value={state.state_id}>
                              {state.state_name}
                            </option>
                          ))}
                        </select>
                        {statesError && (
                          <p className="text-red-500 text-xs mt-1">
                            {statesError.message || statesError.toString()}
                          </p>
                        )}
                        {renderError("state_id")}
                      </div>

                      {/* city */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="city_id"
                          onChange={handleVendorChange}
                          value={vendorDetails.city_id}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">
                            {citiesLoading ? "Loading..." : "Select a city"}
                          </option>
                          {cities.map((city) => (
                            <option key={city.city_id} value={city.city_id}>
                              {city.city_name}
                            </option>
                          ))}
                        </select>
                        {citiesError && (
                          <p className="text-red-500 text-xs mt-1">
                            {citiesError.message || citiesError.toString()}
                          </p>
                        )}
                        {renderError("city_id")}
                      </div>

                      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="vendor_address"
                          rows="2"
                          placeholder="Full Address"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleVendorChange}
                          value={vendorDetails.vendor_address}
                        />
                        {renderError("vendor_address")}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-2xl">
                <div className="flex gap-3 justify-end">
                  {/* {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                    >
                      Back
                    </button>
                  )} */}

                  {currentStep === 1 ? (
                    <button
                      type="button"
                      onClick={handleBankSubmit}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md flex-1 sm:flex-initial"
                    >
                      Submit Bank Details
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVendorSubmit}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md flex-1 sm:flex-initial"
                    >
                      Add Vendor Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}