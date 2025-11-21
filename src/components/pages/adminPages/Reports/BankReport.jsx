import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";


export default function BankReport() {
    const [bankList, setBankList] = useState([]);
    const [filteredBankList, setFilteredBankList] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first, asc = oldest first
    const [isLoading, setIsLoading] = useState(false);

      // Fetch bank data from API
      useEffect(() => {
        const fetchBankData = async () => {
          setIsLoading(true);
          try {
            const response = await axios.get("http://localhost:8001/bank/list");
            const data = response.data;
            console.log("Raw bank data from API:", data);
            
            // Handle different response structures
            let banks = [];
            if (Array.isArray(data)) {
              banks = data;
              console.log("Data is direct array");
            } else if (Array.isArray(data.bankDetails)) {
              banks = data.bankDetails;
              console.log("Data is in bankDetails property");
            } else if (Array.isArray(data.banks)) {
              banks = data.banks;
              console.log("Data is in banks property");
            } else if (Array.isArray(data.data)) {
              banks = data.data;
              console.log("Data is in data property");
            } else {
              console.log("Unknown data structure:", data);
              banks = [];
            }
            
            console.log("Processed banks array:", banks);
            setBankList(banks);
            console.log("Fetched bank data:", banks);
          } catch (error) {
            console.error("Error fetching bank data:", error);
            setBankList([]);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchBankData();
      }, []);
    
      // Filter banks based on selected type
      useEffect(() => {
        let filtered = [];
        if (selectedFilter === "all") {
          filtered = [...bankList];
        } else {
          filtered = bankList.filter(
            (bank) => bank.bank_type?.toLowerCase() === selectedFilter.toLowerCase()
          );
        }

        // Sort by bank_id (newest/oldest)
        filtered.sort((a, b) => {
          if (sortOrder === "desc") {
            return b.bank_id - a.bank_id; // Newest first (higher ID first)
          } else {
            return a.bank_id - b.bank_id; // Oldest first (lower ID first)
          }
        });

        setFilteredBankList(filtered);
      }, [selectedFilter, bankList, sortOrder]);
    
      const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
      };

      const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
      };
    
  return (
    <div className="w-full bg-white rounded-2xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Filter by Type:
            </label>
            <select
              value={selectedFilter}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white"
            >
              <option value="all">All Banks</option>
              <option value="vendor">Vendor Banks</option>
              <option value="self">Self Banks</option>
            </select>
          </div>

          {/* Sort Order Button */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading banks...</p>
        </div>
      ) : filteredBankList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No banks found for the selected filter.</p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50" >
              <tr className=" border-b border-gray-200">
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
                  Address
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBankList.map((bank, index) => (
                <tr
                  key={bank.bank_id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  <td className="p-3 text-sm text-gray-600">{bank.bank_id}</td>
                  <td className="p-3 text-sm font-medium text-gray-800">
                    {bank.bank_name}
                  </td>
                  <td className="p-3 text-sm text-gray-600">{bank.bank_branch}</td>
                  <td className="p-3 text-sm text-gray-600">{bank.city_name}</td>
                  <td className="p-3 text-sm text-gray-600">{bank.state_name}</td>
                  <td className="p-3 text-sm text-gray-600">{bank.bank_address}</td>
                  <td className="p-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        bank.bank_type?.toLowerCase() === "vendor"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {bank.bank_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
