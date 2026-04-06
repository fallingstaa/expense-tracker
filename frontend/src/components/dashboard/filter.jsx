import { useState } from "react";
import {
  ArrowDownWideNarrowIcon,
  Tag,
  Calendar,
  DollarSign,
  ChevronDown,
  ChartBarStacked,
} from "lucide-react";

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");

  return (
    <section>
      <div className="ml-5 mr-5 ">
        <div className="max-w-8xl mx-auto">
          <div className="p-5 bg-gray-800/50 border border-mutes/20 rounded-lg">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-mutes/20 p-2 border rounded-md border-mutes/20">
                  <ArrowDownWideNarrowIcon className="w-6 h-6 text-mutes" />
                </div>
                <div className="text-mutes">
                  <h1 className="font-bold text-lg">Filters</h1>
                  <p className="text-sm text-mutes/50">
                    {isOpen ? "Click to collapse" : "Click to expand"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 rounded-lg flex items-center cursor-pointer transition-transform duration-300"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <ChevronDown className="w-5 h-5 text-mutes" />
              </button>
            </div>

            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? "1000px" : "0px" }}
            >
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-mutes/60 uppercase mb-3">
                    Transaction Type
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {["All", "Income", "Expense"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                          selectedType === type
                            ? type === "Income"
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : type === "Expense"
                                ? "bg-red-500/20 border-red-500 text-red-400"
                                : "bg-mutes/20 border-mutes text-mutes"
                            : "bg-transparent border-mutes/20 text-mutes/50 hover:border-mutes/40"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-mutes flex items-center gap-1 mb-2">
                      <ChartBarStacked className="w-4 h-4 text-mutes" />{" "}
                      Category
                    </p>
                    <div className="relative">
                      <ChartBarStacked className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutes/40 pointer-events-none" />
                      <select
                        className="w-full bg-gray-900 border border-mutes/20 text-mutes/70 rounded-lg pl-10 pr-10 py-3
      text-sm focus:outline-none focus:border-mutes/50 appearance-none scheme-dark cursor-pointer"
                      >
                        <option>All categories</option>
                        <option>Food</option>
                        <option>Transport</option>
                        <option>Shopping</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutes/40 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-mutes mb-2 flex items-center gap-1">
                      <Tag className="w-4 h-4 text-fuchsia-700" /> Tag Search
                    </p>
                    <input
                      type="text"
                      placeholder="Search tags..."
                      className="w-full bg-gray-900 border border-mutes/20 text-mutes/70 placeholder-mutes/30 
                      rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-mutes mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" /> Date Range
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs text-mutes/50 mb-2">From</p>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutes/40 pointer-events-none" />
                        <input
                          type="date"
                          className="w-full bg-gray-900 border border-mutes/20 text-mutes/70 rounded-lg pl-10 pr-4 py-3 text-sm
          focus:outline-none focus:border-mutes/50 scheme-dark"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-mutes/50 mb-2">To</p>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutes/40 pointer-events-none" />
                        <input
                          type="date"
                          className="w-full bg-gray-900 border border-mutes/20 text-mutes/70 rounded-lg pl-10 pr-4 py-3 text-sm
          focus:outline-none focus:border-mutes/50 scheme-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-mutes mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> Amount
                    Range
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs text-mutes/50 mb-2">Minimum</p>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-gray-900 border border-mutes/20 text-mutes/70 placeholder-mutes/30 rounded-lg
                         px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-mutes/50 mb-2">Maximum</p>
                      <input
                        type="number"
                        placeholder="9999.99"
                        className="w-full bg-gray-900 border border-mutes/20 text-mutes/70 placeholder-mutes/30 rounded-lg 
                        px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filter;
