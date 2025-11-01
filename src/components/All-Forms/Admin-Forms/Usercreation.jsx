import React from 'react';

export default function Usercreation() {
  return (
    <div className="p-6 min-h-screen bg-gray-50 font-sans">
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

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="fullname" className="block mb-2 text-sm font-bold text-[#004aad]">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-bold text-[#004aad]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label htmlFor="username-signup" className="block mb-2 text-sm font-bold text-[#004aad]">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                >
                  <option value=""> -- Select Role -- </option>
                  <option value="Supervisor"> Supervisor </option>
                  <option value="Banker"> Banker </option>
                  <option value="User"> User </option>
                </select>
              </div>

              <div>
                <label htmlFor="password-signup" className="block mb-2 text-sm font-bold text-[#004aad]">
                  Password
                </label>
                <input
                  type="password"
                  id="password-signup"
                  placeholder="Create a password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-bold text-[#004aad]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm your password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                />
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