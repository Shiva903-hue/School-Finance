import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Usercreation() {
  const [roles, setRoles] = useState([]);
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
                  Name
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
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Email Address
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
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Role
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
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-bold text-[#004aad]"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
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
    </div>
  );
}
