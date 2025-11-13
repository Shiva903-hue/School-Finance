import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "../../ui/ConfirmationDialog";
import { Eye, EyeOff } from "lucide-react";

export default function Usercreation() {
  const [roles, setRoles] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    role: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});

  //* Fetch roles from the API
  useEffect(() => {
    fetch("http://localhost:8001/api/auth/roles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRoles(data.roles);
      })
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  //* Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Restrict mobile field to numbers only
    if (name === "mobile" && value && !/^\d*$/.test(value)) {
      return; // Don't update if non-numeric characters are entered
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    
    }
      validateField(name, value);
  };

  //* Validate password match
  const validateForm = () => {
    const newErrors = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //* send form data to the API
  const hadlesubmit = async (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword: _confirmPassword, ...dataToSend } = formData;

    try {
      const response = await fetch("http://localhost:8001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("✅ User created successfully!");
      } else {
        toast.error("❌ Error creating user");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("❌ An error occurred while creating user");
    }
    // Reset form after a short delay
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        role: "",
        status: "Active",
      });
      setErrors({});
    }, 1500);
  };

    //# ===================== Validation =====================
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      if (name === "mobile" && !/^\d{10}$/.test(value)) {
        error = "Enter a valid 10-digit number";
      }
      if ((name === "password" || name === "confirmPassword") && (value.length < 4 || value.length > 8)) {
        error = "Password must be between 4 and 8 characters";
      }
      if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };
  //# ===================== Render Error Helper =====================
  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>;



  return (
    <div className="p-6 min-h-screen bg-gray-50 font-sans">
        
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="w-full px-4 md:px-12 bg-white rounded-2xl shadow-xl">
        {/* Header bg-[#fc7e00]*/}
        <div className=" bg-gray-300 text-sky-950 text-center py-4 rounded-t-2xl shadow-md">
          <h1 className="text-3xl font-bold">USER CREATION</h1>
        </div>

        {/* Form Content */}
        <div className="relative p-6 md:p-10">
          <h2 className="text-center text-[#004aad] text-2xl font-bold mb-6">
            Create User Account
          </h2>

          <form className="space-y-6" onSubmit={hadlesubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
                 {renderError("name")}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Email Address  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
                 {renderError("email")}
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Mobile Number  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  maxLength="10"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
                {renderError("mobile")}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Role  <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value=""> -- Select Role -- </option>
                  {roles.map((role) => (
                    <option key={role.user_type_id} value={role.user_type_id}>
                      {role.user_type_name}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Password  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {renderError("password")}
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Confirm Password  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {renderError("confirmPassword")}
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white text-base font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Create User
            </button>
          </form>

          <div className="absolute bottom-4 right-4 text-xs opacity-50 text-gray-500 font-normal">
            Sample Watermark
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedSubmit}
        title="Confirm User Creation"
        message="Are you sure you want to create this user account? Please verify all details before confirming."
        confirmText="Create User"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
}
