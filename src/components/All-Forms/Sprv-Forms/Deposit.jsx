import React, { useEffect, useState } from "react";

export default function Deposit() {
  const [bankName, setBankName] = useState([]);
  const [formData, setFormData] = useState({
    u_email: "",
    // ds_id: "",
    d_amount: "",
    bank: "", 
    d_mode: "",
    cheque_number: "",
    cheque_date: "",
    dd_number: "",
    dd_date: "",
    dd_amount: "",
  });

  const [cashNotes, setCashNotes] = useState({
    2000: "",
    500: "",
    200: "",
    100: "",
    50: "",
    20: "",
    10: "",
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState({});

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

  //* Validation function
  const validateField = (name, value) => {
    let error = "";
    
    // Check for general required field
    if (value === "" || value === null || value === undefined) {
      error = "This field is required";
    } else {
      // Validation for numeric fields
      if (
        [
          // "ds_id",
          "d_amount",
          "cheque_number",
          "dd_number",
          "dd_amount",
        ].includes(name)
      ) {
        // Allow only digits and ensure it's not a negative number
        if (!/^\d+$/.test(value)) {
           error = "Only non-negative numbers are allowed";
        }
      }
      
      // Validation for email
      if (name === "u_email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format";
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

  //* handleDenominationChange
  const handleDenominationChange = (note, count) => {
    const updatedNotes = { ...cashNotes, [note]: count };
    setCashNotes(updatedNotes);

    let total = 0;
    Object.entries(updatedNotes).forEach(([noteValue, noteCount]) => {
      total += (parseInt(noteValue) || 0) * Math.max(0, (parseInt(noteCount) || 0));
    });
    setTotalAmount(total);
  };

  //* HandleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    // Define core required fields 
    // ds_id is removed from thses
    const requiredFields = ['u_email',  'd_amount', 'bank', 'd_mode'];
    
    // Add d_mode-specific required fields
    if (formData.d_mode === "Cheque" || formData.d_mode === "RTGS") {
        requiredFields.push('cheque_number', 'cheque_date');
    } else if (formData.d_mode === "DD") {
        requiredFields.push('dd_number', 'dd_date', 'dd_amount');
    }
    
    // Validate all required fields
    requiredFields.forEach((name) => {
      if (!validateField(name, formData[name])) {
        isValid = false;
      }
    });
    
    // Additional Validation: If d_mode is Cash, totalAmount should match d_amount
    if (formData.d_mode === "Cash" && parseFloat(formData.d_amount) !== totalAmount) {
        setErrors(prev => ({ ...prev, d_amount: "Amount must match total cash denomination." }));
        isValid = false;
    }


    if (!isValid) {
      alert("Please fix validation errors before submitting.");
      return;
    }
    
      try {
      const res = await fetch('http://localhost:3001/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const msg = await res.text();
      alert(msg);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to submit deposit');
    }

    // Print all data to console
    // console.log("--- Deposit Form Submitted Data ---");
    console.log("Form Data:", formData);
    if (formData.d_mode === "Cash") {
        console.log("Cash Denominations:", cashNotes);
        console.log("Total Calculated Cash Amount:", totalAmount);
    }
    console.log("-----------------------------------");
    
    alert("✅ Deposit submitted successfully!");

  };

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;
    
  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Deposit Slip
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

        {/* Deposit Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            Deposit Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ds_id */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deposit ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ds_id"
                value={formData.ds_id}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter deposit ID (Numbers only)"
                required
              />
              {renderError("ds_id")}
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="d_amount"
                value={formData.d_amount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount (Numbers only)"
                required
              />
              {renderError("d_amount")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Bank <span className="text-red-500">*</span>
              </label>
              <select
                name="bank"
                value={formData.bank}
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
              {renderError("bank")}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Deposit <span className="text-red-500">*</span>
            </label>
            <select
              name="d_mode"
              value={formData.d_mode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select mode</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Cheque">Cheque</option>
              <option value="RTGS">RTGS</option>
              <option value="DD">DD</option>
            </select>
            {renderError("d_mode")}
          </div>

          {formData.d_mode === "Cash" && (
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Cash Denomination Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.keys(cashNotes).map((note) => (
                  <div key={note}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ₹{note} Notes
                    </label>
                    <input
                      type="number"
                      value={cashNotes[note]}
                      onChange={(e) =>
                        handleDenominationChange(note, e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      placeholder="Count"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-4 flex items-center gap-4 flex-wrap">
                <strong className="text-lg">Total:</strong>
                <span className="p-3 text-lg w-full sm:w-auto font-bold bg-green-100 text-green-800 rounded-lg border border-green-300">
                  ₹ {totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}

          {(formData.d_mode === "Cheque" || formData.d_mode === "RTGS") && (
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.d_mode} Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${formData.d_mode} Number (Numbers only)`}
                  name="cheque_number"
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

          {formData.d_mode === "DD" && (
            <div className="pt-4 space-y-4">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Demand Draft Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DD Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dd_number"
                    placeholder="Enter DD Number (Numbers only)"
                    value={formData.dd_number}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {renderError("dd_number")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DD Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dd_date"
                    placeholder="DD Date"
                    value={formData.dd_date}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {renderError("dd_date")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DD Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dd_amount"
                    placeholder="Enter DD Amount (Numbers only)"
                    value={formData.dd_amount}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {renderError("dd_amount")}
                </div>
              </div>
            </div>
          )}
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
    </div>
  );
}