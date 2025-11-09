import React, { useState , useEffect} from "react";
import MultiStepVendorForm from '../../All-Forms/User-Forms/MultiStepVendorForm';


export default function Vendor() {
  const [vendorForm, setVendorForm] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchVendorData = () => {
    setIsRefreshing(true);
    try {
      fetch("http://localhost:8001/api/vendor-info")
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched vendor info:", data);
          
          // Handle different response structures
          if (Array.isArray(data)) {
            setVendorData(data);
          } else if (Array.isArray(data.vendorDetails)) {
            setVendorData(data.vendorDetails);
          } else if (Array.isArray(data.vendors)) {
            setVendorData(data.vendors);
          } else if (Array.isArray(data.data)) {
            setVendorData(data.data);
          } else {
            setVendorData([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching vendor info:", error);
          setVendorData([]);
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    } catch (error) {
      console.error("Error in useEffect:", error);
      setVendorData([]);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);
  return (
    <section className="p-4 sm:p-6">
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <button
          onClick={() => setVendorForm(true)}
          className="w-full sm:w-auto p-2.5 rounded-lg border transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-medium"
        >
          Add New Vendor +
        </button>
        <button
          onClick={fetchVendorData}
          disabled={isRefreshing}
          className="w-full sm:w-auto p-2.5 rounded-lg border transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? '↻ Refreshing...' : '↻ Refresh'}
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
              {Array.isArray(vendorData) && vendorData.length > 0 ? (
                vendorData.map((vendor, index) => (
                <tr
                  key={vendor.vendor_id || index}
                  className="block md:table-row border-b last:border-b-0 md:border-none p-4 md:p-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="block md:table-cell lg:border-b px-2 md:px-6 py-1 md:py-4 whitespace-nowrap text-sm text-gray-700 md:text-left text-right before:content-['ID:_'] before:font-bold md:before:content-[''] before:float-left md:before:float-none">
                    {vendor.vendor_id}
                  </td>
                  <td className="block md:table-cell lg:border-b px-2 md:px-6 py-1 md:py-4 whitespace-normal text-sm font-medium text-gray-900 md:text-left text-right before:content-['Name:_'] before:font-bold md:before:content-[''] before:float-left md:before:float-none">
                    {vendor.vendor_name}
                  </td>
                  <td className="block md:table-cell lg:border-b px-2 md:px-6 py-1 md:py-4 whitespace-normal text-sm text-gray-700 md:text-left text-right before:content-['Email:_'] before:font-bold md:before:content-[''] before:float-left md:before:float-none break-all">
                    {vendor.vendor_email  || 'noemail@email.com'}
                  </td>
                  <td className="block md:table-cell lg:border-b px-2 md:px-6 py-1 md:py-4 whitespace-nowrap text-sm text-gray-700 md:text-left text-right before:content-['Phone:_'] before:font-bold md:before:content-[''] before:float-left md:before:float-none">
                    {vendor.vendor_mobile}
                  </td>
                  <td className="block md:table-cell lg:border-b px-2 md:px-6 py-1 md:py-4 whitespace-normal text-sm text-gray-700 md:text-left text-right before:content-['Address:_'] before:font-bold md:before:content-[''] before:float-left md:before:float-none">
                    {vendor.vendor_address}
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
              ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {isRefreshing ? 'Loading vendors...' : Array.isArray(vendorData) ? 'No vendors found' : 'Loading vendors...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
