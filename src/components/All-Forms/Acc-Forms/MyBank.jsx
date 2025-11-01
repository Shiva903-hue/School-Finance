import React from "react";

export default function MyBank() {
  // Sample bank data (will be replaced with DB data later)
  const bankList = [
    {
      b_id: 1,
      b_name: "State Bank of India",
      b_branch: "Nagpur Main",
      city: "Nagpur",
      state: "MH",
      vendor_name: "Tech Solutions Pvt Ltd",
    },
    {
      b_id: 2,
      b_name: "HDFC Bank",
      b_branch: "Pandhrabodi",
      city: "pandhrabodi",
      state: "MH",
      vendor_name: "Global Traders",
    },
    {
      b_id: 3,
      b_name: "ICICI Bank",
      b_branch: "Bhandar",
      city: "bhandar",
      state: "MP",
      vendor_name: "Sunrise Electronics",
    },
    {
      b_id: 4,
      b_name: "Axis Bank",
      b_branch: "Nagpur South",
      city: "Nagpur",
      state: "MH",
      vendor_name: "Metro Supplies Co",
    },
    {
      b_id: 5,
      b_name: "Bank of Baroda",
      b_branch: "Pandhrabodi Central",
      city: "pandhrabodi",
      state: "MH",
      vendor_name: "Prime Distributors",
    },
    {
      b_id: 6,
      b_name: "Punjab National Bank",
      b_branch: "Bhandar East",
      city: "bhandar",
      state: "MP",
      vendor_name: "Elite Manufacturing",
    },
  ];

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          My Bank List
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Total Banks: {bankList.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-3 text-sm font-semibold text-gray-700">
                Bank ID
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">
                Bank Name
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">
                Branch
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">
                City
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">
                State
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">
                Vendor Name
              </th>
            </tr>
          </thead>
          <tbody>
            {bankList.map((bank, index) => (
              <tr
                key={bank.b_id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                <td className="p-3 text-sm text-gray-600">{bank.b_id}</td>
                <td className="p-3 text-sm font-medium text-gray-800">
                  {bank.b_name}
                </td>
                <td className="p-3 text-sm text-gray-600">{bank.b_branch}</td>
                <td className="p-3 text-sm text-gray-600">{bank.city}</td>
                <td className="p-3 text-sm text-gray-600">{bank.state}</td>
                <td className="p-3 text-sm text-gray-700 font-medium">
                  {bank.vendor_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
