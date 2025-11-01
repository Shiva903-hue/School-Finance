// import { Wallet } from "lucide-react";
import wallet from '../../../assets/wallet.png'
import React from "react";

export default function Balance() {

  return (
    <div className="min-h-screen">
      <div className="relative  flex flex-wrap items-center justify-center min-h-screen">
        {/* <Wallet className="h-1/2 w-full text-teal-500" /> */}
        <img src={wallet} alt="wallet img" className='absolute inset-0 h-full w-full object-cover opacity-80' />
        
        {/* Forms overlaid on image */}
        <div className="relative z-10 w-full p-4 sm:p-8 space-y-8">
          {/* Form 1: Check Balance */}
          <form className="max-w-4xl mx-auto bg-white bg-opacity-95 p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
              Check Balance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label
                  htmlFor="banks-check"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Select Bank <span className="text-red-500">*</span>
                </label>
                <select
                  id="banks-check"
                  name="banks"
                  className="w-full mt-1 block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">-- Select a Bank --</option>
                  <option value="IDBI">IDBI</option>
                  <option value="SBI">SBI</option>
                  <option value="HDFC">HDFC</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                  Check Balance
                </button>
              </div>

              {/* Balance Display */}
              <div className="md:col-span-1 flex items-center justify-start md:justify-center">
                <span className="bg-green-100 text-green-800 text-lg font-bold px-4 py-2 rounded-md border border-green-300">
                  ₹ 1222.00
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>
          </form>

          {/* Form 2: Update Balance */}
          <form className="max-w-4xl mx-auto bg-white bg-opacity-95 p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
              Update Balance
            </h2>

            {/* Section for updating balance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label
                  htmlFor="banks-update"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Select Bank <span className="text-red-500">*</span>
                </label>
                <select
                  id="banks-update"
                  name="banks"
                  className="w-full mt-1 block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value=""> -- Select a Bank --</option>
                  <option value="IDBI">IDBI</option>
                  <option value="SBI">SBI</option>
                  <option value="HDFC">HDFC</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  New Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Enter new balance"
                  className="w-full mt-1 block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="md:col-span-1">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                  Update Balance
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}