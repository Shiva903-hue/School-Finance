import wallet from '../../../assets/wallet.png'
import React,{useState,useEffect} from "react";
import axios from "axios";

export default function Balance() {
  const [bankList, setBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [selectedBankAmount, setSelectedBankAmount] = useState(null);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8001/bank/self")
      .then((response) => {
        const data = response.data;
        // Handle different response formats
        const bankArray = Array.isArray(data) ? data : data.bankDetails || data.banks || data.data || [];
        console.log("Fetched banks:", bankArray);
        setBankList(bankArray);
      })
      .catch((error) => console.error("Error fetching bank list:", error));
  }, []);

  const handleBankSelect = (e) => {
    const bankId = e.target.value;
    setSelectedBankId(bankId);
    setShowBalance(false); // Reset balance display when bank changes
  };

  const handleCheckBalance = async () => {
    if (selectedBankId) {
      // Fetch fresh data from server
      try {
        const response = await axios.get("http://localhost:8001/bank/self");
        const data = response.data;
        const bankArray = Array.isArray(data) ? data : data.bankDetails || data.banks || data.data || [];
        setBankList(bankArray); // Update the bank list with fresh data
        
        const selectedBank = bankArray.find(bank => bank.bank_id === parseInt(selectedBankId));
        setSelectedBankAmount(selectedBank ? selectedBank.bank_amount : null);
        setShowBalance(true);
      } catch (error) {
        console.error("Error fetching updated balance:", error);
      }
    }
  };


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
                  value={selectedBankId}
                  onChange={handleBankSelect}
                  className="w-full mt-1 block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">-- Select a Bank --</option>
                  {bankList.map((bank) => (
                    <option key={bank.bank_id} value={bank.bank_id}>
                      {bank.bank_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <button
                  type="button"
                  onClick={handleCheckBalance}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedBankId}
                >
                  Check Balance
                </button>
              </div>

              {/* Balance Display */}
              <div className="md:col-span-1 flex items-center justify-start md:justify-center">
                {showBalance && selectedBankAmount !== null ? (
                  <span className="bg-green-100 text-green-800 text-lg font-bold px-4 py-2 rounded-md border border-green-300">
                    ₹ {parseFloat(selectedBankAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-lg font-bold px-4 py-2 rounded-md border border-gray-300">
                    {showBalance ? '₹ 0.00' : 'Select bank'}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200"></div>
          </form>


        </div>
      </div>
    </div>
  );
}