import React, { useState } from "react";

export default function MyBank() {
  const [formData, setFormData] = useState({
    b_id: "",
    b_name: "",
    b_branch: "",
    b_amount: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (["b_amount", "b_id"].includes(name) && !/^\d+$/.test(value)) {
        error = "Only numbers are allowed";
      }
      if (
        ["b_name", "b_branch"].includes(name) &&
        !/^[a-zA-Z\s]+$/.test(value)
      ) {
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
      const res = await fetch("http://localhost:5001/api/mybank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Bank details inserted successfully");
        setFormData({
          b_id: "",
          b_name: "",
          b_branch: "",
          b_amount: "",
        });
        setErrors({});
      } else {
        alert("❌ Error sending request");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("❌ An error occurred while submitting the form.");
    }
  };

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          My Bank
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Bank Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank ID <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="b_id"
                value={formData.b_id}
                placeholder="Enter Bank ID"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("b_id")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="b_name"
                value={formData.b_name}
                placeholder="Enter Bank Name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("b_name")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="b_amount"
                value={formData.b_amount}
                placeholder="Amount"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("b_amount")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Branch <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="b_branch"
                value={formData.b_branch}
                placeholder="Enter Bank Branch"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("b_branch")}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium shadow-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
