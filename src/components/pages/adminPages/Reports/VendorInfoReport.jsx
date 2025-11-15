import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";

export default function VendorInfoReport() {
  const [vendorInfo, setVendorInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [vendorTypeFilter, setVendorTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  // Get cities based on selected state
  const availableCities = stateFilter === "all" 
    ? cities
    : cities.filter(city => city.state_id === parseInt(stateFilter));

  useEffect(() => {
    async function fetchVendorData() {
      try {
        const response = await fetch(
          "http://localhost:8001/api/reports/vendor-report"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched vendor report data:", data);
        setVendorInfo(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    async function fetchCitiesAndStates() {
      // Fetch Cities
      try {
        const citiesRes = await fetch("http://localhost:8001/api/dropdown/city");
        if (!citiesRes.ok) throw new Error("Failed to fetch cities");
        const citiesData = await citiesRes.json();
        if (Array.isArray(citiesData)) setCities(citiesData);
        else if (Array.isArray(citiesData.data)) setCities(citiesData.data);
        else if (Array.isArray(citiesData.cities)) setCities(citiesData.cities);
        else setCities([]);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }

      // Fetch States
      try {
        const statesRes = await fetch("http://localhost:8001/api/dropdown/state");
        if (!statesRes.ok) throw new Error("Failed to fetch states");
        const statesData = await statesRes.json();
        if (Array.isArray(statesData)) setStates(statesData);
        else if (Array.isArray(statesData.data)) setStates(statesData.data);
        else if (Array.isArray(statesData.states)) setStates(statesData.states);
        else setStates([]);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    }

    fetchVendorData();
    fetchCitiesAndStates();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...vendorInfo];

    // Filter by vendor type
    if (vendorTypeFilter !== "all") {
      filtered = filtered.filter(
        item => item.vendor_type_name === vendorTypeFilter
      );
    }

    // Filter by state
    if (stateFilter !== "all") {
      filtered = filtered.filter(
        item => item.state_name === stateFilter
      );
    }

    // Filter by city
    if (cityFilter !== "all") {
      filtered = filtered.filter(
        item => item.city_name === cityFilter
      );
    }

    setFilteredData(filtered);
  }, [vendorInfo, vendorTypeFilter, cityFilter, stateFilter]);

  // Reset city filter when state changes
  useEffect(() => {
    if (stateFilter !== "all" && cityFilter !== "all") {
      // Check if selected city belongs to selected state
      const selectedCity = cities.find(c => c.city_name === cityFilter);
      if (selectedCity && selectedCity.state_id !== parseInt(stateFilter)) {
        setCityFilter("all");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFilter]);

  // Clear all filters
  const clearFilters = () => {
    setVendorTypeFilter("all");
    setCityFilter("all");
    setStateFilter("all");
  };
  
  return (
    <div className="w-full space-y-4">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          
          {(vendorTypeFilter !== "all" || cityFilter !== "all" || stateFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vendor Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Vendor Type
              </label>
              <select
                value={vendorTypeFilter}
                onChange={(e) => setVendorTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Academic">Academic</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Food & Canteen">Food & Canteen</option>
                <option value="Technology">Technology</option>
                <option value="Transportation">Transportation</option>
                <option value="Security & Cleaning">Security & Cleaning</option>
                <option value="Medical">Medical</option>
                <option value="Printing & Stationery">Printing & Stationery</option>
                <option value="Uniform & Apparel">Uniform & Apparel</option>
                <option value="Event & Decoration">Event & Decoration</option>
                <option value="Gardening">Gardening</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Cities</option>
                {availableCities.map((city, idx) => (
                  <option key={idx} value={city.city_name}>{city.city_name}</option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by State
              </label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All States</option>
                {states.map((state, idx) => (
                  <option key={idx} value={state.state_id}>{state.state_name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
          <span className="font-semibold">{vendorInfo.length}</span> vendors
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Index
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vendor Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mobile No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  GST No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Bank Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  State
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.vendor_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.vendor_type_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.vendor_mobile}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.vendor_GST || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.bank_name || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.city_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.state_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.vendor_status === 'Active' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.vendor_status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-sm text-gray-500">
                    No vendor records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
