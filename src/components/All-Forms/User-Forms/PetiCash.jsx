import React, { useState , useCallback} from "react";

export default function PetiCash() {
  // const [bankList, setBankList] = useState([]);
  const [formData, setFormData] = useState({
    Vendor_name: "",
    Txn_description: "",
    Txn_Amount: "",
    bank_id: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = useCallback((message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  }, []);


  //* fetch bank names
    // useEffect(() => {
    //   const fetchDropdownData = async () => {
    //     try {
    //       const typeRes = await fetch(
    //         "http://localhost:8001/api/dropdown/banks"
    //       );
    //       const typeJson = await typeRes.json();
    //       console.log("Fetched Banks:", typeJson);
  
    //       if (typeJson && Array.isArray(typeJson.banks)) {
    //         setBankList(typeJson.banks);
    //       } else if (Array.isArray(typeJson.data)) {
    //         setBankList(typeJson.data);
    //       } else if (Array.isArray(typeJson)) {
    //         setBankList(typeJson);
    //       } else {
    //         setBankList([]);
    //       }
    //     } catch (err) {
    //       console.error("Dropdown fetch error:", err);
    //     }
    //   };
  
    //   fetchDropdownData();
    // }, []);

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (name === "Txn_Amount" && !/^\d+(\.\d{1,2})?$/.test(value)) {
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
      showToast("Please fix validation errors before submitting.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8001/api/transaction/peticash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
          console.log("FormData being sent:", formData);
        const responseData = await res.json();
        console.log("Peti Cash transaction added:", responseData);
        showToast("Peti Cash transaction added successfully!", "success");
      } else {
        showToast("Failed to add transaction. Please try again.", "error");
      }

      setFormData({
        Vendor_name: "",
        Txn_description: "",
        Txn_Amount: "",
        bank_id: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submission Error:", error);
      showToast("An error occurred while submitting the form.", "error");
    }
  };

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;

  return (
    <div className="w-full h-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
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

      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Petty Cash Transaction
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
                name="Vendor_name"
                value={formData.Vendor_name}
                placeholder="Enter Vendor Name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("Vendor_name")}
            </div>
{/* /Bank id */}
            {/* <div>
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
               {Array.isArray(bankList) &&
                 bankList.map((type) => (
                   <option
                     key={type.bank_id}
                     value={type.bank_id}
                   >
                     {type.bank_name}
                   </option>
                 ))}
              </select>
              {renderError("bank_id")}
            </div> */}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Description <span className="text-red-500">*</span>
              </label>
              <textarea
                onChange={handleChange}
                name="Txn_description"
                value={formData.Txn_description}
                placeholder="Enter transaction description"
                rows="3"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("Txn_description")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Amount <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="Txn_Amount"
                value={formData.Txn_Amount}
                placeholder="Enter Amount"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {renderError("Txn_Amount")}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium shadow-sm"
          >
            Add Petty Cash Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
