import React, { useEffect, useState } from "react";

export default function WithdrawalForm() {
  const [bankName, setBankName] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    u_email: "",
    // w_id: "",
    w_amount: "",
    bank_select: "",
    mode_withdraw: "",
    // cheque_number: "",
    // cheque_date: "",
  });

  //* Fetch Bank Names form My Bank Table
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch("http://localhost:5001/get/mybankname");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBankName(data);
      } catch (e) {
        console.error(
          "Could not fetch bank data. Backend server might not be running: ",
          e
        );
      }
    };
    fetchVouchers();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (
        //! w_id is removed form these
        [ "w_amount", "cheque_number"].includes(name) &&
        !/^\d+$/.test(value)
      ) {
        error = "Only numbers are allowed";
      }
      if (name === "u_email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format";
      }
      if (name === "bank_select" && !/^[a-zA-Z\s]+$/.test(value)) {
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

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    Object.entries(formData).forEach(([name, value]) => {
      if (
        formData.mode_withdraw !== "Cheque" &&
        (name === "cheque_number" || name === "cheque_date")
      ) {
        return; // Skip validation for hidden cheque fields
      }
      if (!validateField(name, value)) {
        isValid = false;
      }
    });

    if (!isValid) {
      alert("❌ Please fix validation errors before submitting.");
      return;
    }
    console.log(formData);
    alert("✅ Withdrawal submitted successfully!");
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Withdrawal Slip
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            User Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="u_email"
              value={formData.u_email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user email"
              required
            />
            {renderError("u_email")}
          </div>
        </div>

        {/* Withdrawal Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            Withdrawal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* w_id */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="w_id"
                value={formData.w_id}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter withdrawal ID"
                required
              />
              {renderError("w_id")}
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="w_amount"
                value={formData.w_amount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                required
              />
              {renderError("w_amount")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Bank <span className="text-red-500">*</span>
              </label>
              <select
                name="bank_select"
                value={formData.bank_select}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  -- Choose Bank --
                </option>
                {bankName.map((bank) => (
                  <option key={bank.b_name} value={bank.b_name}>
                    {bank.b_name}
                  </option>
                ))}
              </select>
              {renderError("bank_select")}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Withdrawal <span className="text-red-500">*</span>
            </label>
            <select
              name="mode_withdraw"
              value={formData.mode_withdraw}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value=""> --Select Mode-- </option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
            {renderError("mode_withdraw")}
          </div>
          {formData.mode_withdraw === "Cheque" && (
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cheque Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cheque_number"
                  placeholder="Enter Cheque Number"
                  value={formData.cheque_number}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {renderError("cheque_number")}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="cheque_date"
                  value={formData.cheque_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {renderError("cheque_date")}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium shadow-sm"
          >
            Apply Withdrawal
          </button>
        </div>
      </form>
    </div>
  );
}
