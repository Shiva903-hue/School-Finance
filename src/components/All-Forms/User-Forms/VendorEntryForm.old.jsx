import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VendorEntryForm({ setVendorForm, onSubmitStatus }) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    u_id: "",
    v_id: "",
    v_name: "",
    v_GSTno: "",
    v_email: "",
    phone_no: "",
    v_address: "",
    v_type:"",
    v_detail: "",
    f_owner: "",
    f_manager: "",
    b_name: "",
    b_accno: "",
    b_ifsc: "",
  });
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (
        ["phone_no", "b_accno", "u_id"].includes(name) &&
        !/^\d+$/.test(value)
      ) {
        error = "Only numbers are allowed";
      }
      if (
        ["v_name", "f_owner", "f_manager", "b_name", "v_type"].includes(name) &&
        !/^[a-zA-Z\s]+$/.test(value)
      ) {
        error = "Only alphabets are allowed";
      }
      if (name === "phone_no") {
        if (!/^\d{10}$/.test(value)) {
          error = "Enter a valid 10-digit number";
        }
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let isValid = true;
//     Object.entries(formData).forEach(([name, value]) => {
//       if (!validateField(name, value)) {
//         isValid = false;
//       }
//     });

//     if (!isValid) {
//       toast.error("Please fix validation errors before submitting.", {
//         position: "top-center",
//         autoClose: 2500,
//       });
//       if (onSubmitStatus)
//         onSubmitStatus(
//           "error",
//           "Please fix validation errors before submitting."
//         );
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5001/api/vendorentry", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         toast.success("✅ Vendor created successfully!", {
//           position: "top-center",
//           autoClose: 2000,
//         });
//         if (onSubmitStatus)
//           onSubmitStatus("success", "Vendor created successfully!");
//         setFormData({
//           u_id: "",
//           v_id: "",
//           v_name: "",
//           v_GSTno: "",
//           v_email: "",
//           phone_no: "",
//           v_address: "",
//           v_type: "",
//           v_detail: "",
//           f_owner: "",
//           f_manager: "",
//           b_name: "",
//           b_accno: "",
//           b_ifsc: "",
//         });
//         setErrors({});
//         setVendorForm(false);
//       } else {
//         toast.error("❌ Error sending request", {
//           position: "top-center",
//           autoClose: 2500,
//         });
//         if (onSubmitStatus) onSubmitStatus("error", "Error sending request");
//       }
//     } catch (error) {
//       toast.error("❌ An error occurred while submitting the form.", {
//         position: "top-center",
//         autoClose: 2500,
//       });
//       if (onSubmitStatus)
//         onSubmitStatus("error", "An error occurred while submitting the form.");
//     }
//   };

//   const renderError = (name) =>
//     errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
//         {/* Header */}
//         <div className="flex-shrink-0 rounded-lg bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
//           <h2 className="text-lg sm:text-xl font-bold text-gray-800">
//             Create Vendor
//           </h2>
//           <button
//             type="button"
//             onClick={() => setVendorForm(false)}
//             className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         {/* Form Content - Now scrollable */}
//         <form
//           onSubmit={handleSubmit}
//           className=" rounded-[22px] flex-grow overflow-y-auto"
//         >
//           <div className="px-4 sm:px-6 py-4 space-y-4">
//             {/* User Information */}
//             <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//               <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
//                 User Information
//               </h3>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   User ID <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="u_id"
//                   placeholder="Enter User ID"
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   required
//                   onChange={handleChange}
//                   value={formData.u_id}
//                 />
//                 {renderError("u_id")}
//               </div>
//             </div>

//             {/* Vendor Details */}
//             <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//               <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
//                 Vendor Details
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* v_id */}
//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vendor ID <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="v_id"
//                     placeholder="Vendor ID"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.v_id}
//                   />
//                   {renderError("v_id")}
//                 </div> */}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vendor Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="v_name"
//                     placeholder="Vendor Name"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.v_name}
//                   />
//                   {renderError("v_name")}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   GST Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="v_GSTno"
//                   placeholder="Enter GST Number"
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   required
//                   onChange={handleChange}
//                   value={formData.v_GSTno}
//                 />
//                 {renderError("v_GSTno")}
//               </div>

//               {/* Vendr type */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Vendor type <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="type"
//                   placeholder="e.g., Electronics, Textiles"
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   onChange={handleChange}
//                   value={formData.v_type || ""}
//                 />
//                 {renderError("v_type")}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Vendor Detail
//                 </label>
//                 <textarea
//                   name="v_detail"
//                   placeholder="Enter Vendor Details (Optional)"
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   rows="3"
//                   onChange={handleChange}
//                   value={formData.v_detail}
//                 />
//                 {renderError("v_detail")}
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//               <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
//                 Contact Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vendor Email <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     name="v_email"
//                     placeholder="Enter Vendor Email"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.v_email}
//                   />
//                   {renderError("v_email")}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vendor Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone_no"
//                     placeholder="Enter Vendor Phone"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.phone_no}
//                   />
//                   {renderError("phone_no")}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Vendor Address <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="v_address"
//                   placeholder="Enter Vendor Address"
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   rows="3"
//                   required
//                   onChange={handleChange}
//                   value={formData.v_address}
//                 />
//                 {renderError("v_address")}
//               </div>
//             </div>

//             {/* Bank Information */}
//             <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//               <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
//                 Bank Details
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Bank Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="b_name"
//                     placeholder="Bank Name"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.b_name}
//                   />
//                   {renderError("b_name")}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Bank Account Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="b_accno"
//                     placeholder="Bank Account Number"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.b_accno}
//                   />
//                   {renderError("b_accno")}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     IFSC Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="b_ifsc"
//                     placeholder="Bank IFSC Code"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.b_ifsc}
//                   />
//                   {renderError("b_ifsc")}
//                 </div>
//               </div>
//             </div>

//             {/* Company Personnel */}
//             <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//               <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
//                 Company Personnel
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Firm Owner <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="f_owner"
//                     placeholder="Firm Owner Name"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.f_owner}
//                   />
//                   {renderError("f_owner")}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Firm Manager <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="f_manager"
//                     placeholder="Firm Manager Name"
//                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                     onChange={handleChange}
//                     value={formData.f_manager}
//                   />
//                   {renderError("f_manager")}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sticky Footer for Submit Button */}
//           <div className="flex-shrink-0 sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-4">
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium shadow-sm"
//             >
//               Create Vendor
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    Object.entries(formData).forEach(([name, value]) => {
      if (!validateField(name, value)) isValid = false;
    });

    if (!isValid) {
      toast.error("Please fix validation errors.", { position: "top-center" });
      if(onSubmitStatus) onSubmitStatus("error", "Please fix validation errors."); 
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/vendorentry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Vendor created successfully!", { position: "top-center" });
        if(onSubmitStatus) onSubmitStatus("success", "Vendor created successfully!");
        setFormData({
          u_id: "",
          v_id: "",
          v_name: "",
          v_GSTno: "",
          v_email: "",
          phone_no: "",
          v_address: "",
          v_type:"",
          v_detail: "",
          f_owner: "",
          f_manager: "",
          b_name: "",
          b_accno: "",
          b_ifsc: "",
        });
        setErrors({});
        setVendorForm(false);
      } else {
        toast.error("Error sending request", { position: "top-center" });
        if(onSubmitStatus) onSubmitStatus("error", "Error sending request");
      }
    } catch (error) {
      toast.error("Network/Server error", { position: "top-center" });
      if(onSubmitStatus) onSubmitStatus("error", "Network/Server error");
    }
  };

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
      <div className="relative w-full max-w-xl sm:max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="flex-shrink-0 rounded-lg bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-bold text-gray-800">
            Create Vendor
          </h2>
          <button
            type="button"
            onClick={() => setVendorForm(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Responsive Form */}
        <form onSubmit={handleSubmit} className="rounded-xl flex-grow overflow-y-auto">
          <div className="px-3 sm:px-6 py-4 space-y-6">


            {/* Vendor Details */}
            <section className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-gray-700 text-xs sm:text-sm uppercase mb-2">
                Vendor Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="v_name"
                    placeholder="Vendor Name"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.v_name}
                  />
                  {renderError("v_name")}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">GST Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="v_GSTno"
                    placeholder="GST Number"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.v_GSTno}
                  />
                  {renderError("v_GSTno")}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Type <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="v_type"
                    placeholder="e.g. Electronics"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.v_type}
                  />
                  {renderError("v_type")}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Detail</label>
                  <textarea
                    name="v_detail"
                    rows="2"
                    placeholder="Details (optional)"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                    value={formData.v_detail}
                  />
                  {renderError("v_detail")}
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-gray-700 text-xs sm:text-sm uppercase mb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="v_email"
                    placeholder="Email"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.v_email}
                  />
                  {renderError("v_email")}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Phone <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone_no"
                    placeholder="Phone"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.phone_no}
                  />
                  {renderError("phone_no")}
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                  <textarea
                    name="v_address"
                    rows="2"
                    placeholder="Vendor Address"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.v_address}
                  />
                  {renderError("v_address")}
                </div>
              </div>
            </section>

            {/* Bank */}
            <section className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-gray-700 text-xs sm:text-sm uppercase mb-2">
                Bank Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="b_name"
                    placeholder="Bank Name"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.b_name}
                  />
                  {renderError("b_name")}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account No. <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="b_accno"
                    placeholder="Account No."
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.b_accno}
                  />
                  {renderError("b_accno")}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="b_ifsc"
                    placeholder="IFSC"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.b_ifsc}
                  />
                  {renderError("b_ifsc")}
                </div>
              </div>
            </section>

            {/* Personnel */}
            <section className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-gray-700 text-xs sm:text-sm uppercase mb-2">
                Company Personnel
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Owner <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="f_owner"
                    placeholder="Firm Owner"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.f_owner}
                  />
                  {renderError("f_owner")}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Manager <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="f_manager"
                    placeholder="Firm Manager"
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.f_manager}
                  />
                  {renderError("f_manager")}
                </div>
              </div>
            </section>
          </div>
          <div className="flex-shrink-0 sticky bottom-0 bg-white border-t border-gray-100 px-3 sm:px-6 py-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium shadow-sm"
            >
              Create Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}