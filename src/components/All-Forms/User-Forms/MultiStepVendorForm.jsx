import React, { useState } from "react";
import { X } from "lucide-react";

export default function MultiStepVendorForm({ setVendorForm }) {
  //   const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    b_name: "",
    b_accno: "",
    b_ifsc: "",
    b_branch: "",
    b_type: "",
    b_Address: "",
    b_city: "",
    b_state: "",
    v_name: "",
    v_GSTno: "",
    v_email: "",
    phone_no: "",
    v_address: "",
    v_city: "",
    v_state: "",
    v_type: "",
    v_detail: "",
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (["phone_no", "b_accno"].includes(name) && !/^\d+$/.test(value)) {
        error = "Only numbers are allowed";
      }
      if (
        [
          "v_name",
          "b_name",
          "v_type",
          "b_holder",
        ].includes(name) &&
        !/^[a-zA-Z\s]+$/.test(value)
      ) {
        error = "Only alphabets are allowed";
      }
      if (name === "phone_no" && !/^\d{10}$/.test(value)) {
        error = "Enter a valid 10-digit number";
      }
      if (name === "v_email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateStep = (step) => {
    let isValid = true;
    const fieldsToValidate =
      step === 1
        ? ["b_name", "b_accno", "b_ifsc", "b_branch", "b_Address", "b_city", "b_state"]
        : [
            "v_name",
            "v_GSTno",
            "v_email",
            "phone_no",
            "v_address",
            "v_city",
            "v_state",
            "v_type",
          ];

    fieldsToValidate.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleBankSubmit = async () => {
    if (!validateStep(1)) {
      showToast("Please fill all required fields correctly", "error");
      return;
    }

    try {
      // Simulate API call for bank details submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("✅ Bank details submitted successfully!", "success");
      setTimeout(() => {
        setCurrentStep(2);
      }, 1000);
    } catch (error) {
      console.log(error);
      showToast("❌ Error submitting bank details", "error");
    }
  };

  const handleVendorSubmit = async () => {
    if (!validateStep(2)) {
      showToast("Please fill all required fields correctly", "error");
      return;
    }

    try {
      // Simulate API call for vendor details submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("✅ Vendor created successfully!", "success");
      setTimeout(() => {
        setFormData({
          b_name: "",
          b_accno: "",
          b_ifsc: "",
          b_branch: "",
          b_holder: "",
          b_type: "",
          b_Address: "",
          b_city: "",
          b_state: "",
          v_name: "",
          v_GSTno: "",
          v_email: "",
          phone_no: "",
          v_address: "",
          v_city: "",
          v_state: "",
          v_type: "",
          v_detail: "",
        });
        setErrors({});
        setCurrentStep(1);
        setVendorForm(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      showToast("❌ Error submitting vendor details", "error");
    }
  };

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
      {/* //! Popup Screen */}
      {setVendorForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="relative w-full max-w-xl sm:max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Add Vendor
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setVendorForm(false);
                    setCurrentStep(1);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
                >
                  <X size={20} />
                </button>
              </div>

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
                  <span className="text-xs mt-2 font-medium text-gray-700">
                    Bank Details
                  </span>
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
                  <span className="text-xs mt-2 font-medium text-gray-700">
                    Vendor Details
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              <div className="px-4 sm:px-6 py-4 space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                      Add Bank Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="b_name"
                          placeholder="Bank Name"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.b_name}
                        />
                        {renderError("b_name")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="b_accno"
                          placeholder="Account Number"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.b_accno}
                        />
                        {renderError("b_accno")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="b_ifsc"
                          placeholder="IFSC Code"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.b_ifsc}
                        />
                        {renderError("b_ifsc")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Branch <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="b_branch"
                          placeholder="Branch Name"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.b_branch}
                        />
                        {renderError("b_branch")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="b_city"
                          id="b_city"
                          onChange={handleChange}
                          value={formData.b_city}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Select City</option>
                          <option value="New York">pandhrabodi</option>
                          <option value="Los Angeles">Nagpur</option>
                          <option value="Chicago">bhandar</option>
                        </select>
                        {renderError("b_city")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="b_state"
                          id="b_state"
                          onChange={handleChange}
                          value={formData.b_state}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Select State</option>
                          <option value="New York">MH</option>
                          <option value="Los Angeles">MP</option>
                          <option value="Chicago">UP</option>
                        </select>
                        {renderError("b_state")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Add Bank Address{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          type="text"
                          name="b_Address"
                          placeholder="Branch Address"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.b_Address}
                        />
                        {renderError("b_Address")}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
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
                          name="v_name"
                          placeholder="Vendor Name"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.v_name}
                        />
                        {renderError("v_name")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          GST Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="v_GSTno"
                          placeholder="GST Number"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.v_GSTno}
                        />
                        {renderError("v_GSTno")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="v_email"
                          placeholder="Email"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.v_email}
                        />
                        {renderError("v_email")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone_no"
                          placeholder="Phone Number"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.phone_no}
                        />
                        {renderError("phone_no")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Vendor Type <span className="text-red-500">*</span>
                        </label>
                       <select name="v_type" id="v_type" onChange={handleChange} value={formData.v_type} className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                         <option value="">Select Vendor Type</option>
                         <option value="manufacturer">Manufacturer</option>
                         <option value="distributor">Distributor</option>
                         <option value="retailer">Retailer</option>
                       </select>
                        {renderError("v_type")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="v_city"
                          id="v_city"
                          onChange={handleChange}
                          value={formData.v_city}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Select City</option>
                          <option value="pandhrabodi">pandhrabodi</option>
                          <option value="Nagpur">Nagpur</option>
                          <option value="bhandar">bhandar</option>
                        </select>
                        {renderError("v_city")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="v_state"
                          id="v_state"
                          onChange={handleChange}
                          value={formData.v_state}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Select State</option>
                          <option value="MH">MH</option>
                          <option value="MP">MP</option>
                          <option value="UP">UP</option>
                        </select>
                        {renderError("v_state")}
                      </div>

                      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="v_address"
                          rows="2"
                          placeholder="Full Address"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                          value={formData.v_address}
                        />
                        {renderError("v_address")}
                      </div>

                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-2xl">
                <div className="flex gap-3 justify-end">
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                    >
                      Back
                    </button>
                  )}

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
      )}
    </div>
  );
}
