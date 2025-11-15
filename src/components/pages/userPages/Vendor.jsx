import React, { useState , useEffect} from "react";
import MultiStepVendorForm from '../../All-Forms/User-Forms/MultiStepVendorForm';
import ConfirmationDialog from '../../ui/ConfirmationDialog';
import { X } from 'lucide-react';


export default function Vendor() {
  const [vendorForm, setVendorForm] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [vendorToUpdate, setVendorToUpdate] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [updateErrors, setUpdateErrors] = useState({});

  // Toast notification helper
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Validation function for update form
  const validateUpdateField = (name, value) => {
    let error = "";

    if (name === "vendor_name") {
      if (!value || value.trim() === "") {
        error = "Vendor name is required";
      } else if (value.trim().length < 3) {
        error = "Vendor name must be at least 3 characters";
      }
    }

    if (name === "vendor_mobile") {
      if (!value || value.trim() === "") {
        error = "Mobile number is required";
      } else if (!/^\d{10}$/.test(value)) {
        error = "Mobile number must be exactly 10 digits";
      }
    }

    if (name === "vendor_email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    }

    if (name === "vendor_GST" && value) {
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
        error = "Invalid GST format (e.g., 22ABCDE1234F1Z5)";
      }
    }

    if (name === "vendor_address") {
      if (!value || value.trim() === "") {
        error = "Address is required";
      } else if (value.trim().length < 10) {
        error = "Address must be at least 10 characters";
      }
    }

    setUpdateErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

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

  // Handle delete vendor
  const handleDeleteClick = (vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/vendor/${vendorToDelete.vendor_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Vendor deleted successfully!', 'success');
        fetchVendorData(); // Refresh the list
      } else {
        const result = await response.json();
        showToast(result.message || 'Failed to delete vendor', 'error');
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      showToast('Failed to delete vendor. Please try again.', 'error');
    } finally {
      setShowDeleteDialog(false);
      setVendorToDelete(null);
    }
  };

  // Handle update vendor
  const handleUpdateClick = (vendor) => {
    setVendorToUpdate(vendor);
    setUpdateErrors({});
    setShowUpdateDialog(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    const fieldsToValidate = ['vendor_name', 'vendor_mobile', 'vendor_email', 'vendor_GST', 'vendor_address'];
    
    fieldsToValidate.forEach((field) => {
      if (!validateUpdateField(field, vendorToUpdate[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToast("Please fix validation errors before submitting.", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8001/api/vendor/${vendorToUpdate.vendor_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorToUpdate),
      });

      if (response.ok) {
        showToast('Vendor updated successfully!', 'success');
        setShowUpdateDialog(false);
        setVendorToUpdate(null);
        setUpdateErrors({});
        fetchVendorData(); // Refresh the list
      } else {
        const result = await response.json();
        showToast(result.message || 'Failed to update vendor', 'error');
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      showToast('Failed to update vendor. Please try again.', 'error');
    }
  };

  return (
    <section className="p-4 sm:p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-[80] px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

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
                        onClick={() => handleUpdateClick(vendor)}
                        className="rounded-xl border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100 shadow-sm w-full md:w-auto transition-colors"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        disabled
                        onClick={() => handleDeleteClick(vendor)}
                        className="rounded-xl border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100 shadow-sm w-full md:w-auto transition-colors"
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setVendorToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Vendor"
        message={`Are you sure you want to delete vendor "${vendorToDelete?.vendor_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Update Vendor Dialog */}
      {showUpdateDialog && vendorToUpdate && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Update Vendor Details
              </h3>
              <button
                onClick={() => {
                  setShowUpdateDialog(false);
                  setVendorToUpdate(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vendorToUpdate.vendor_name}
                    onChange={(e) => {
                      setVendorToUpdate({...vendorToUpdate, vendor_name: e.target.value});
                      validateUpdateField('vendor_name', e.target.value);
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {updateErrors.vendor_name && (
                    <p className="text-red-500 text-sm mt-1">{updateErrors.vendor_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vendorToUpdate.vendor_mobile}
                    onChange={(e) => {
                      setVendorToUpdate({...vendorToUpdate, vendor_mobile: e.target.value});
                      validateUpdateField('vendor_mobile', e.target.value);
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    maxLength="10"
                    required
                  />
                  {updateErrors.vendor_mobile && (
                    <p className="text-red-500 text-sm mt-1">{updateErrors.vendor_mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={vendorToUpdate.vendor_email || ''}
                    onChange={(e) => {
                      setVendorToUpdate({...vendorToUpdate, vendor_email: e.target.value});
                      validateUpdateField('vendor_email', e.target.value);
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {updateErrors.vendor_email && (
                    <p className="text-red-500 text-sm mt-1">{updateErrors.vendor_email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={vendorToUpdate.vendor_GST || ''}
                    onChange={(e) => {
                      setVendorToUpdate({...vendorToUpdate, vendor_GST: e.target.value.toUpperCase()});
                      validateUpdateField('vendor_GST', e.target.value.toUpperCase());
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="22ABCDE1234F1Z5"
                    maxLength="15"
                  />
                  {updateErrors.vendor_GST && (
                    <p className="text-red-500 text-sm mt-1">{updateErrors.vendor_GST}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={vendorToUpdate.vendor_address}
                    onChange={(e) => {
                      setVendorToUpdate({...vendorToUpdate, vendor_address: e.target.value});
                      validateUpdateField('vendor_address', e.target.value);
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                  {updateErrors.vendor_address && (
                    <p className="text-red-500 text-sm mt-1">{updateErrors.vendor_address}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateDialog(false);
                    setVendorToUpdate(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-sm"
                >
                  Update Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
