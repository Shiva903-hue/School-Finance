import { Calendar, CheckCircle, Clock, DollarSign, Hash, Package, User, User2, XCircle } from "lucide-react";

export default function StatusCard({ voucherData }) {
  let statusLabel, statusColor, statusIcon, bgcolor,amountBg , boxbg , textColor ;

  if (voucherData.v_status === 'PENDING') {

    statusLabel = "PENDING";
    bgcolor = "bg-orange-200 border-orange-400";
     amountBg = "bg-orange-300 text-orange-600";
     boxbg = "bg-orange-300 border-orange-500";
     textColor = "text-orange-700";
    statusColor = "bg-orange-300 text-orange-700 border-orange-400";
    statusIcon = <Clock className="w-4 h-4 mr-1.5" />;

  } else if (voucherData.v_status === 'APPROVED') {
    statusLabel = "APPROVED";
    bgcolor = "bg-green-200 border-green-400";
      amountBg = "bg-green-300 text-green-600";
         boxbg = "bg-green-300 border-green-500";
     textColor = "text-greem-700";
    statusColor = "bg-green-300 text-green-800 border-green-100";
    statusIcon = <CheckCircle className="w-4 h-4 mr-1.5" />;

  } else  {
    statusLabel = "REJECTED";
    bgcolor = "bg-red-200 border-red-400";
    amountBg = "bg-red-300 text-red-600"
       boxbg = "bg-red-300 border-red-500";
     textColor = "text-red-700";
    statusColor = "bg-red-300 text-red-800 border-red-400";
    statusIcon = <XCircle className="w-4 h-4 mr-1.5" />;
  } 
  return (
     <div className={`rounded-lg border ${bgcolor} p-4 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200`}>

      {/* Header with Voucher ID and Status */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-gray-500" />
          <div>
            <div className="text-xs text-gray-500">Voucher ID</div>
            <div className="font-bold text-lg text-gray-900">{voucherData.va_id}</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {statusIcon}
          {statusLabel}
        </span>
      </div>

      {/* Content Grid - 2x2 layout */}
      <div className="grid grid-cols-2 gap-3 mb-3 flex-1">
        
        {/* User Email */}
        <div className={`${boxbg}  rounded p-2 border`}>
          <div className={`text-xs ${textColor} mb-1`}>User Email</div>
          <div className="text-sm font-medium text-gray-800 truncate" title={voucherData.u_email}>
            {voucherData.u_email}
          </div>
        </div>

        {/* Product Name */}
        <div className={`${boxbg}  rounded p-2 border`}>
          <div className={`text-xs ${textColor} mb-1`}>Product Name</div>
          <div className="text-sm font-medium text-gray-800 truncate" title={voucherData.p_name}>
            {voucherData.p_name}
          </div>
        </div>

        {/* Quantity */}
        <div className={`${boxbg}  rounded p-2 border`}>
          <div className={`text-xs ${textColor} mb-1`}>Quantity</div>
          <div className="text-sm font-semibold text-gray-800">
            {parseInt(voucherData.P_quantity).toLocaleString()}
          </div>
        </div>

        {/* Rate */}
        <div className={`${boxbg}  rounded p-2 border`}>
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Rate
          </div>
          <div className="text-sm font-semibold text-gray-800">
            {parseInt(voucherData.p_rate).toLocaleString()}
          </div>
        </div>

        {/* vender Name */}
        <div className={`${boxbg}  rounded p-2 border`}>
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <User2 className="w-3 h-3" />
            Vender Name
          </div>
          <div className="text-sm font-semibold text-gray-800">
            {voucherData.vender_name}
          </div>
        </div>
      </div>

      {/* Total Amount -  */}
      <div className={`${amountBg} rounded p-2 mb-3`}>
        <div className="text-xs opacity-90 mb-1 flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          Total Amount
        </div>
        <div className="text-lg font-bold">
          {parseInt(voucherData.P_amount).toLocaleString()}
        </div>
      </div>

      {/* Footer with Date */}
      <div className="border-t border-gray-200 pt-2 mt-auto">
        <div className="flex items-center gap-1 mb-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">
            {voucherData.v_status === "APPROVED" ? "Approved Date" : 
             voucherData.v_status === "REJECTED" ? "Rejected Date" : "Date"}
          </span>
        </div>
        <div className="text-xs text-gray-600 font-medium">
          {new Date(voucherData.v_sysdate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric", 
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>
    </div>
  );
};
