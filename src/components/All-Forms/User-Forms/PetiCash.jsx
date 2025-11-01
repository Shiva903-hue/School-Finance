import React, { useState } from "react";

export default function PetiCash() {
  const [formData, setFormData] = useState({
    vendor_name: "",
    transaction_description: "",
    transaction_amount: "",
    bank_id: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (name === "transaction_amount" && !/^\d+(\.\d{1,2})?$/.test(value)) {
        error = "Enter a valid amount";
      }
      if (name === "vendor_name" && !/^[a-zA-Z\s]+$/.test(value)) {
        error = "Only alphabets are allowed";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    Object.entries(formData).forEach(([name, value]) => {
      if (!validateField(name, value)) {
        isValid = false;
      }
    });

    if (!isValid) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    try {
      // API call will be added here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("✅ Peti Cash transaction added successfully");
      setFormData({
        vendor_name: "",
        transaction_description: "",
        transaction_amount: "",
        bank_id: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submission Error:", error);
      alert("❌ An error occurred while submitting the form.");
    }
  };

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;

  return (
    <div className="w-full h-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Peti Cash Transaction
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            Transaction Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="vendor_name"
                value={formData.vendor_name}
                placeholder="Enter Vendor Name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("vendor_name")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank ID <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                name="bank_id"
                value={formData.bank_id}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
                <option value="">Select Bank ID</option>
                <option value="1">Bank ID - 1</option>
                <option value="2">Bank ID - 2</option>
                <option value="3">Bank ID - 3</option>
              </select>
              {renderError("bank_id")}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Description <span className="text-red-500">*</span>
              </label>
              <textarea
                onChange={handleChange}
                name="transaction_description"
                value={formData.transaction_description}
                placeholder="Enter transaction description"
                rows="3"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("transaction_description")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Amount <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="transaction_amount"
                value={formData.transaction_amount}
                placeholder="Enter Amount"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("transaction_amount")}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium shadow-sm"
          >
            Add Peti Cash Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
