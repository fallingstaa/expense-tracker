// import { X } from "lucide-react";
// const Transection = () => {
//   return (
//     <section className="">
//       <div className="mt-5 mr-5 ml-5">
//         <div className="max-w-8xl mx-auto">
//           <div className="p-5 bg-gray-800 border border-mutes/20 rounded-lg">
//             <div className="flex justify-between items-center">
//               <h1 className="text-xl md:text-2xl lg:text-2xl text-mutes font-bold">
//                 Transactions
//               </h1>
//               <button className="py-2 px-4 bg-mutes/30 hover:bg-mutes/60 text-mutes rounded-lg border border-mutes/30">
//                 Add Transection
//               </button>
//             </div>
//             <div className="pt-30 pb-20 text-center">
//               <h1 className="text-xl text-mutes font-bold">
//                 No transactions yet
//               </h1>
//               <p className="text-sm text-mutes/20">
//                 Add your first transaction to get started
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="bg-red-200 w-[50%]  space-y-10 mx-auto ">
//         <div className="px-2 py-2 ">
//           <div className="flex justify-between ">
//             <h1>Add Transaction</h1>
//             <X />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Transection;

import { useState } from "react";
import { X, Tag, FileText, RefreshCw, DollarSign } from "lucide-react";

const Transection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("expense");
  const [recurring, setRecurring] = useState(false);

  return (
    <section>
      <div className="mt-5 mr-5 ml-5">
        <div className="max-w-8xl mx-auto">
          <div className="p-5 bg-gray-800 border border-mutes/20 rounded-lg">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl text-mutes font-bold">
                Transactions
              </h1>
              <button
                onClick={() => setIsOpen(true)}
                className="py-2 px-4 bg-mutes/30 hover:bg-mutes/60 text-mutes rounded-lg border border-mutes/30 transition-colors"
              >
                Add Transaction
              </button>
            </div>
            <div className="pt-30 pb-20 text-center">
              <h1 className="text-xl text-mutes font-bold">
                No transactions yet
              </h1>
              <p className="text-sm text-mutes/20">
                Add your first transaction to get started
              </p>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-gray-900 border border-mutes/20 rounded-2xl w-full max-w-2xl z-50 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-mutes/10">
              <h2 className="text-2xl font-bold text-mutes">Add Transaction</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-mutes/50 hover:text-mutes transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setType("expense")}
                  className={`py-3 rounded-xl font-semibold text-sm transition-all border ${
                    type === "expense"
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-transparent border-mutes/20 text-mutes/50 hover:border-mutes/40"
                  }`}
                >
                  Expense
                </button>
                <button
                  onClick={() => setType("income")}
                  className={`py-3 rounded-xl font-semibold text-sm transition-all border ${
                    type === "income"
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-transparent border-mutes/20 text-mutes/50 hover:border-mutes/40"
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="text-sm text-mutes mb-2 block">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Grocery shopping"
                  className="w-full bg-gray-800 border border-mutes/20 text-mutes placeholder-mutes/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-mutes mb-2 block">
                    Amount
                  </label>
                  <div className="flex items-center gap-2 bg-gray-800 border border-mutes/20 rounded-xl px-4 py-3">
                    <DollarSign className="w-4 h-4 text-mutes/40" />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="bg-transparent text-mutes placeholder-mutes/30 text-sm focus:outline-none w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-mutes mb-2 block">
                    Category
                  </label>
                  <select className="w-full bg-gray-800 border border-mutes/20 text-mutes/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50">
                    <option value="">Select category</option>
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Shopping</option>
                    <option>Health</option>
                    <option>Entertainment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-mutes mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., food, restaurant, weekend"
                  className="w-full bg-gray-800 border border-mutes/20 text-mutes placeholder-mutes/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
                />
              </div>

              <div>
                <label className="text-sm text-mutes mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Notes
                </label>
                <textarea
                  placeholder="Add any additional details..."
                  rows={3}
                  className="w-full bg-gray-800 border border-mutes/20 text-mutes placeholder-mutes/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-between bg-gray-800 border border-mutes/20 rounded-xl px-4 py-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-mutes" />
                  <div>
                    <p className="text-mutes font-semibold text-sm">
                      Recurring Transaction
                    </p>
                    <p className="text-mutes/40 text-xs">
                      Set up automatic repeat
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRecurring(!recurring)}
                  className={`w-12 h-6 rounded-full transition-colors duration-300 relative shrink-0 ${
                    recurring ? "bg-indigo-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-mutes rounded-full shadow transition-transform duration-300 ${
                      recurring ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-6 pt-0">
              <button
                onClick={() => setIsOpen(false)}
                className="py-3 rounded-xl bg-gray-800 border border-mutes/20 text-mutes/70 hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button className="py-3 rounded-xl bg-indigo-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Transection;
