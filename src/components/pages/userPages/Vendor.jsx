import React, { useState } from "react";
import MultiStepVendorForm from '../../All-Forms/User-Forms/MultiStepVendorForm';


export default function Vendor() {
  const [vendorForm, setVendorForm] = useState(false);
  const mockRows = [
    {
      id: 1,
      name: "Shree Ganesh Electronics",
      email: "ganesh.electronics@example.com",
      phone: 9876543210,
      address: "Nagpur, Maharashtra",
    },
    {
      id: 2,
      name: "Mehta Textiles",
      email: "mehta.textiles@example.com",
      phone: 9123456789,
      address: "Surat, Gujarat",
    },
    {
      id: 3,
      name: "Kumar Book Store",
      email: "kumar.books@example.com",
      phone: 9812345678,
      address: "Patna, Bihar",
    },
    {
      id: 4,
      name: "Bright Future Coaching",
      email: "brightfuture@example.com",
      phone: 9765432109,
      address: "Lucknow, Uttar Pradesh",
    },
    {
      id: 5,
      name: "Royal Bakers",
      email: "royal.bakers@example.com",
      phone: 9654321098,
      address: "Pune, Maharashtra",
    },
    {
      id: 6,
      name: "Delhi Furniture House",
      email: "delhifurniture@example.com",
      phone: 9543210987,
      address: "New Delhi",
    },
    {
      id: 7,
      name: "Techno World Computers",
      email: "techworld@example.com",
      phone: 9432109876,
      address: "Bengaluru, Karnataka",
    },
    {
      id: 8,
      name: "Healthy Life Pharmacy",
      email: "healthylife@example.com",
      phone: 9321098765,
      address: "Chennai, Tamil Nadu",
    },
    {
      id: 9,
      name: "Sunrise Travels",
      email: "sunrise.travels@example.com",
      phone: 9210987654,
      address: "Jaipur, Rajasthan",
    },
    {
      id: 10,
      name: "Green Valley Nursery",
      email: "greenvalley@example.com",
      phone: 9109876543,
      address: "Kolkata, West Bengal",
    },
  ];

  return (
    <section className="p-4 sm:p-6">
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <button
          onClick={() => setVendorForm(true)}
          className="w-full sm:w-auto p-2.5 rounded-lg border transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-medium"
        >
          Add New Vendor ➕
        </button>
      </div>

      {/* Forms (Modals) */}
      {vendorForm && <MultiStepVendorForm setVendorForm={setVendorForm} />}

      {/* Responsive Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto ">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Desktop Table Head */}
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600">
                  Vendor ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Address
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body - Adapts to cards on mobile */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {mockRows.map((r) => (
                <tr
                  key={r.id}
                  className="block md:table-row border-b last:border-b-0 md:border-none p-4 md:p-0"
                >
                  <td className="block md:table-cell lg:border-b-2  px-2 md:px-6 py-1 md:py-4 whitespace-nowrap text-sm text-gray-700 md:text-left text-right before:content-['ID:'] before:font-bold md:before:content-[''] before:float-left">
                    {r.id}
                  </td>
                  <td className="block md:table-cell lg:border-b-2 px-2 md:px-6 py-1 md:py-4 whitespace-normal text-sm font-medium text-gray-900 md:text-left text-right before:content-['Name:'] before:font-bold md:before:content-[''] before:float-left">
                    {r.name}
                  </td>
                  <td className="block md:table-cell lg:border-b-2 px-2 md:px-6 py-1 md:py-4 whitespace-normal text-sm text-gray-700 md:text-left text-right before:content-['Email:'] before:font-bold md:before:content-[''] before:float-left">
                    {r.email}
                  </td>
                  <td className="block md:table-cell lg:border-b-2 px-2 md:px-6 py-1 md:py-4 whitespace-nowrap text-sm text-gray-700 md:text-left text-right before:content-['Phone:'] before:font-bold md:before:content-[''] before:float-left">
                    {r.phone}
                  </td>
                  <td className="block md:table-cell lg:border-b-2 px-2 md:px-6 py-1 md:py-4 whitespace-normal text-sm text-gray-700 md:text-left text-right before:content-['Address:'] before:font-bold md:before:content-[''] before:float-left">
                    {r.address}
                  </td>
                  <td className="block md:table-cell lg:border-b-2 px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center justify-end gap-2 mt-4 md:mt-0">
                      <button
                        type="button"
                        disabled
                        className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 shadow-sm w-full md:w-auto"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        disabled
                        className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 shadow-sm w-full md:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
