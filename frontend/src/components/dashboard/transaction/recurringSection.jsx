// import { RefreshCw } from "lucide-react";

// export const RecurringSection = ({
//   form,
//   setForm,
//   recurring,
//   setRecurring,
// }) => {
//   return (
//     <div className="bg-gray-800 border border-mutes/20 rounded-xl px-4 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <RefreshCw className="w-5 h-5 text-mutes" />
//           <div>
//             <p className="text-mutes font-semibold text-sm">
//               Recurring Transaction
//             </p>
//             <p className="text-mutes/40 text-xs">Set up automatic repeat</p>
//           </div>
//         </div>
//         <button
//           onClick={() => setRecurring(!recurring)}
//           className={`w-12 h-6 rounded-full transition-colors duration-300 relative shrink-0 ${
//             recurring ? "bg-indigo-500" : "bg-gray-600"
//           }`}
//         >
//           <span
//             className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
//               recurring ? "translate-x-6" : "translate-x-0"
//             }`}
//           />
//         </button>
//       </div>

//       <div
//         className={`grid grid-cols-2 gap-3 overflow-hidden transition-all duration-300 ${
//           recurring
//             ? "max-h-96 opacity-100 mt-4 pt-4 border-t border-mutes/10"
//             : "max-h-0 opacity-0"
//         }`}
//       >
//         <div>
//           <label className="text-xs text-mutes/50 mb-1.5 block">Repeat</label>
//           <select
//             value={form.recurringFrequency ?? "monthly"}
//             onChange={(e) =>
//               setForm({ ...form, recurringFrequency: e.target.value })
//             }
//             className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50"
//           >
//             <option value="daily">Daily</option>
//             <option value="weekly">Weekly</option>
//             <option value="monthly">Monthly</option>
//             <option value="yearly">Yearly</option>
//           </select>
//         </div>

//         <div>
//           <label className="text-xs text-mutes/50 mb-1.5 block">Every</label>
//           <input
//             type="number"
//             min="1"
//             value={form.recurringInterval ?? 1}
//             onChange={(e) =>
//               setForm({ ...form, recurringInterval: e.target.value })
//             }
//             className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50"
//           />
//         </div>

//         <div>
//           <label className="text-xs text-mutes/50 mb-1.5 block">
//             Start date
//           </label>
//           <input
//             type="date"
//             value={form.recurringStart ?? ""}
//             onChange={(e) =>
//               setForm({ ...form, recurringStart: e.target.value })
//             }
//             className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50"
//           />
//         </div>

//         <div>
//           <label className="text-xs text-mutes/50 mb-1.5 block">End</label>
//           <select
//             value={form.recurringEnd ?? "never"}
//             onChange={(e) => setForm({ ...form, recurringEnd: e.target.value })}
//             className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50"
//           >
//             <option value="never">Never</option>
//             <option value="on_date">On date</option>
//             <option value="after_n">After N times</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

import { RefreshCw, Plus, Pencil, Trash2, Play, X, Check } from "lucide-react";
import { useRecurring } from "../../../hooks/useRecurring"; // adjust path as needed

export const RecurringSection = () => {
  const {
    isOpen,
    form,
    editId,
    recurringTransactions,
    setForm,
    openAdd,
    openEdit,
    onClose,
    handleSave,
    handleDelete,
    handleRunDue,
    isLoading,
    isFetching,
    isSaving,
    isDeleting,
    isRunningDue,
    error,
  } = useRecurring();

  const frequencyLabel = (f, interval) => {
    const map = {
      daily: "day",
      weekly: "week",
      monthly: "month",
      yearly: "year",
    };
    const unit = map[f] ?? f;
    return interval > 1 ? `Every ${interval} ${unit}s` : `Every ${unit}`;
  };

  return (
    <div className="bg-gray-800 border border-mutes/20 rounded-xl px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-mutes" />
          <div>
            <p className="text-mutes font-semibold text-sm">
              Recurring Transactions
            </p>
            <p className="text-mutes/40 text-xs">Automatic repeating entries</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunDue}
            disabled={isRunningDue}
            title="Run due transactions"
            className="flex items-center gap-1.5 text-xs text-mutes/60 hover:text-mutes border border-mutes/20 hover:border-mutes/40 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40"
          >
            <Play className="w-3 h-3" />
            {isRunningDue ? "Running…" : "Run Due"}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-2.5 py-1.5 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs px-1">
          Failed to load recurring transactions.
        </p>
      )}

      {/* List */}
      {isLoading || isFetching ? (
        <p className="text-mutes/40 text-xs px-1 py-2">Loading…</p>
      ) : recurringTransactions.length === 0 ? (
        <p className="text-mutes/30 text-xs px-1 py-2">
          No recurring transactions yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {recurringTransactions.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between bg-gray-900 border border-mutes/10 rounded-lg px-3 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    item.active ? "bg-indigo-400" : "bg-gray-600"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-mutes text-xs font-medium truncate">
                    {item.title}
                  </p>
                  <p className="text-mutes/40 text-xs">
                    {item.type === "expense" ? "−" : "+"}
                    {item.amount} ·{" "}
                    {frequencyLabel(item.frequency, item.interval)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 text-mutes/40 hover:text-mutes rounded-md hover:bg-mutes/10 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting}
                  className="p-1.5 text-mutes/40 hover:text-red-400 rounded-md hover:bg-red-400/10 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / Edit Form (inline slide-down) */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-mutes/10 pt-4 space-y-3">
          <p className="text-mutes text-xs font-semibold">
            {editId ? "Edit Recurring" : "New Recurring"}
          </p>

          {/* Title + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. Netflix"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50 placeholder-mutes/20"
              />
            </div>
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">
                Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50 placeholder-mutes/20"
              />
            </div>
          </div>

          {/* Type + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Subscriptions"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50 placeholder-mutes/20"
              />
            </div>
          </div>

          {/* Frequency + Interval */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">
                Repeat
              </label>
              <select
                value={form.frequency}
                onChange={(e) =>
                  setForm({ ...form, frequency: e.target.value })
                }
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">
                Every
              </label>
              <input
                type="number"
                min="1"
                value={form.interval}
                onChange={(e) => setForm({ ...form, interval: e.target.value })}
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50"
              />
            </div>
          </div>

          {/* Next Run + Active */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">
                Next run date
              </label>
              <input
                type="date"
                value={form.nextRunAt}
                onChange={(e) =>
                  setForm({ ...form, nextRunAt: e.target.value })
                }
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50"
              />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-9 h-5 rounded-full transition-colors duration-300 relative shrink-0 ${
                    form.active ? "bg-indigo-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                      form.active ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs text-mutes/50">Active</span>
              </label>
            </div>
          </div>

          {/* Notes + Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">Tags</label>
              <input
                type="text"
                placeholder="tag1, tag2"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50 placeholder-mutes/20"
              />
            </div>
            <div>
              <label className="text-xs text-mutes/50 mb-1.5 block">
                Notes
              </label>
              <input
                type="text"
                placeholder="Optional note"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-gray-900 border border-mutes/20 text-mutes rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-mutes/50 placeholder-mutes/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-mutes/50 hover:text-mutes border border-mutes/20 hover:border-mutes/40 rounded-lg px-3 py-1.5 transition-colors"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !form.title || !form.amount}
              className="flex items-center gap-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40"
            >
              <Check className="w-3 h-3" />
              {isSaving ? "Saving…" : editId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
