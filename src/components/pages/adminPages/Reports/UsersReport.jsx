import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function UsersReport() {
  const [usersInfo, setUsersInfo] = useState([]);

  useEffect(() => {
    async function fetchUsersData() {
      try {
        const response = await fetch(
          "http://localhost:8001/api/reports/user-report"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched users report data:", data);
        setUsersInfo(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchUsersData();
  }, []);
  
  return (
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
                  User Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mobile No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersInfo.length > 0 ? (
                usersInfo.map((item, index) => {
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.user_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.user_mob}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.user_email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.user_type_name || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.user_status === 'active'
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.user_status}
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
  );
}
