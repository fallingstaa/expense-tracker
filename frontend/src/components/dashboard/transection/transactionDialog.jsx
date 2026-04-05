import { X, Tag, FileText, RefreshCw, DollarSign } from "lucide-react";
import { CATEGORIES } from "./transactionUtils";

export const TransactionDialog = ({
  isOpen,
  onClose,
  form,
  setForm,
  type,
  setType,
  recurring,
  setRecurring,
  onSave,
  editId,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-mutes/20 rounded-2xl w-full max-w-2xl z-50 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-mutes/10">
          <h2 className="text-xl sm:text-2xl font-bold text-mutes">
            {editId ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-mutes/50 hover:text-mutes transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Type */}
          <div className="grid grid-cols-2 gap-3">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`py-3 rounded-xl font-semibold text-sm transition-all border capitalize ${
                  type === t
                    ? t === "expense"
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-green-500/20 border-green-500 text-green-400"
                    : "bg-transparent border-mutes/20 text-mutes/50 hover:border-mutes/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-mutes mb-2 block">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Grocery shopping"
              className="w-full bg-gray-800 border border-mutes/20 text-mutes placeholder-mutes/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
            />
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-mutes mb-2 block">Amount</label>
              <div className="flex items-center gap-2 bg-gray-800 border border-mutes/20 rounded-xl px-4 py-3">
                <DollarSign className="w-4 h-4 text-mutes/40" />
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className="bg-transparent text-mutes placeholder-mutes/30 text-sm focus:outline-none w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-mutes mb-2 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-800 border border-mutes/20 text-mutes/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm text-mutes mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g., food, restaurant, weekend"
              className="w-full bg-gray-800 border border-mutes/20 text-mutes placeholder-mutes/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-mutes mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add any additional details..."
              rows={3}
              className="w-full bg-gray-800 border border-mutes/20 text-mutes placeholder-mutes/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50 resize-none"
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between bg-gray-800 border border-mutes/20 rounded-xl px-4 py-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-mutes" />
              <div>
                <p className="text-mutes font-semibold text-sm">
                  Recurring Transaction
                </p>
                <p className="text-mutes/40 text-xs">Set up automatic repeat</p>
              </div>
            </div>
            <button
              onClick={() => setRecurring(!recurring)}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative shrink-0 ${recurring ? "bg-indigo-500" : "bg-gray-600"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${recurring ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-3 p-4 sm:p-6 pt-0">
          <button
            onClick={onClose}
            className="py-3 rounded-xl bg-gray-800 border border-mutes/20 text-mutes/70 hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="py-3 rounded-xl bg-indigo-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            {editId ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};
