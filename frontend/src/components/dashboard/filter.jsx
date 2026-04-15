import { useEffect, useRef, useState } from "react";
import {
  ArrowDownWideNarrowIcon,
  Tag,
  Calendar,
  DollarSign,
  ChevronDown,
  ChartBarStacked,
  Check,
  Loader2,
} from "lucide-react";

const Filter = ({
  filters,
  onFilterChange,
  onReset,
  categories = [],
  tags = [],
  isLoadingCategories = false,
  isLoadingTags = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const categoryRef = useRef(null);
  const tagRef = useRef(null);

  const selectedType = filters?.type ?? "all";
  const selectedCategory = filters?.category ?? "";
  const selectedTags = Array.isArray(filters?.tag)
    ? filters.tag.map((tag) => String(tag).trim()).filter(Boolean)
    : String(filters?.tag ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  const updateFilter = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  useEffect(() => {
    const handler = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(event.target)) {
        setIsTagOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectCategory = (name) => {
    updateFilter("category", name);
    setIsCategoryOpen(false);
  };

  const sameTagName = (left, right) =>
    String(left).trim().toLowerCase() === String(right).trim().toLowerCase();

  const isTagSelected = (name) =>
    selectedTags.some((tag) => sameTagName(tag, name));

  const toggleTag = (name) => {
    const next = isTagSelected(name)
      ? selectedTags.filter((tag) => !sameTagName(tag, name))
      : [...selectedTags, name];

    updateFilter("tag", next.join(", "));
  };

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
                    {[
                      { label: "All", value: "all" },
                      { label: "Income", value: "income" },
                      { label: "Expense", value: "expense" },
                    ].map((typeOption) => (
                      <button
                        key={typeOption.value}
                        onClick={() => updateFilter("type", typeOption.value)}
                        className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                          selectedType === typeOption.value
                            ? typeOption.value === "income"
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : typeOption.value === "expense"
                                ? "bg-red-500/20 border-red-500 text-red-400"
                                : "bg-mutes/20 border-mutes text-mutes"
                            : "bg-transparent border-mutes/20 text-mutes/50 hover:border-mutes/40"
                        }`}
                      >
                        {typeOption.label}
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
                    <div className="relative" ref={categoryRef}>
                      <button
                        type="button"
                        onClick={() => setIsCategoryOpen((open) => !open)}
                        className="w-full bg-gray-900 border border-mutes/20 text-mutes/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50 flex items-center justify-between hover:border-mutes/40 transition-colors cursor-pointer"
                      >
                        <span
                          className={
                            selectedCategory ? "text-mutes" : "text-mutes/30"
                          }
                        >
                          {selectedCategory || "Select category"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-mutes/40 transition-transform duration-200 ${
                            isCategoryOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isCategoryOpen ? (
                        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-gray-900 border border-mutes/20 rounded-2xl shadow-2xl overflow-hidden">
                          <div className="max-h-52 overflow-y-auto py-1">
                            {isLoadingCategories ? (
                              <div className="flex items-center justify-center py-6 gap-2 text-mutes/40">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs">Loading...</span>
                              </div>
                            ) : (
                              <>
                                <div
                                  className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-xl transition-colors hover:bg-gray-800 cursor-pointer ${
                                    selectedCategory === ""
                                      ? "bg-indigo-500/10"
                                      : ""
                                  }`}
                                  onClick={() => selectCategory("")}
                                >
                                  <span
                                    className={`flex-1 text-sm ${
                                      selectedCategory === ""
                                        ? "text-indigo-400 font-semibold"
                                        : "text-mutes/70"
                                    }`}
                                  >
                                    All categories
                                  </span>
                                  {selectedCategory === "" ? (
                                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  ) : null}
                                </div>

                                {categories.length === 0 ? (
                                  <p className="text-mutes/30 text-xs text-center py-4">
                                    No categories yet.
                                  </p>
                                ) : (
                                  categories.map((category) => (
                                    <div
                                      key={category.id}
                                      className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-xl transition-colors hover:bg-gray-800 cursor-pointer ${
                                        selectedCategory === category.name
                                          ? "bg-indigo-500/10"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        selectCategory(category.name)
                                      }
                                    >
                                      {category.color ? (
                                        <span
                                          className="w-2.5 h-2.5 rounded-full shrink-0"
                                          style={{
                                            backgroundColor: category.color,
                                          }}
                                        />
                                      ) : null}
                                      <span
                                        className={`flex-1 text-sm ${
                                          selectedCategory === category.name
                                            ? "text-indigo-400 font-semibold"
                                            : "text-mutes/70"
                                        }`}
                                      >
                                        {category.name}
                                      </span>
                                      {selectedCategory === category.name ? (
                                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                      ) : null}
                                    </div>
                                  ))
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-mutes mb-2 flex items-center gap-1">
                      <Tag className="w-4 h-4 text-fuchsia-700" /> Tags
                    </p>
                    <div className="relative" ref={tagRef}>
                      <button
                        type="button"
                        onClick={() => setIsTagOpen((open) => !open)}
                        className="w-full bg-gray-900 border border-mutes/20 text-mutes/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50 flex items-center justify-between hover:border-mutes/40 transition-colors cursor-pointer"
                      >
                        {selectedTags.length === 0 ? (
                          <span className="text-mutes/30">Select tags</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedTags.map((tagName) => {
                              const foundTag = tags.find((tag) =>
                                sameTagName(tag.name, tagName),
                              );

                              return (
                                <span
                                  key={tagName}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-xs"
                                >
                                  {foundTag?.color ? (
                                    <span
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        backgroundColor: foundTag.color,
                                      }}
                                    />
                                  ) : null}
                                  {tagName}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-mutes/40 transition-transform duration-200 shrink-0 ml-2 ${
                            isTagOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isTagOpen ? (
                        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-gray-900 border border-mutes/20 rounded-2xl shadow-2xl overflow-hidden">
                          <div className="max-h-52 overflow-y-auto py-1">
                            {isLoadingTags ? (
                              <div className="flex items-center justify-center py-6 gap-2 text-mutes/40">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs">Loading...</span>
                              </div>
                            ) : tags.length === 0 ? (
                              <p className="text-mutes/30 text-xs text-center py-4">
                                No tags yet.
                              </p>
                            ) : (
                              tags.map((tag) => {
                                const selected = isTagSelected(tag.name);

                                return (
                                  <div
                                    key={tag.id}
                                    className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-xl transition-colors hover:bg-gray-800 cursor-pointer ${
                                      selected ? "bg-indigo-500/10" : ""
                                    }`}
                                    onClick={() => toggleTag(tag.name)}
                                  >
                                    {tag.color ? (
                                      <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: tag.color }}
                                      />
                                    ) : null}
                                    <span
                                      className={`flex-1 text-sm ${
                                        selected
                                          ? "text-indigo-400 font-semibold"
                                          : "text-mutes/70"
                                      }`}
                                    >
                                      {tag.name}
                                    </span>
                                    {selected ? (
                                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    ) : null}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
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
                          value={filters?.startDate ?? ""}
                          onChange={(event) =>
                            updateFilter("startDate", event.target.value)
                          }
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
                          value={filters?.endDate ?? ""}
                          onChange={(event) =>
                            updateFilter("endDate", event.target.value)
                          }
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
                        min="0"
                        step="0.01"
                        value={filters?.minAmount ?? ""}
                        onChange={(event) =>
                          updateFilter("minAmount", event.target.value)
                        }
                        className="w-full bg-gray-900 border border-mutes/20 text-mutes/70 placeholder-mutes/30 rounded-lg
                         px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-mutes/50 mb-2">Maximum</p>
                      <input
                        type="number"
                        placeholder="9999.99"
                        min="0"
                        step="0.01"
                        value={filters?.maxAmount ?? ""}
                        onChange={(event) =>
                          updateFilter("maxAmount", event.target.value)
                        }
                        className="w-full bg-gray-900 border border-mutes/20 text-mutes/70 placeholder-mutes/30 rounded-lg 
                        px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={onReset}
                    className="px-4 py-2 rounded-lg border border-mutes/30 text-mutes/80 hover:border-mutes/50 hover:text-mutes transition-colors text-sm cursor-pointer"
                  >
                    Reset Filters
                  </button>
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
