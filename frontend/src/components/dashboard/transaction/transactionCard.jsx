import { Tag, FileText, Pencil, Trash2, X } from "lucide-react";
import ConfirmDialog from "../../confirmDialog";
import { useState } from "react";

function TransactionDetailModal({ transaction, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-mutes/20 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-5 border-b border-mutes/20">
          <h3 className="text-mutes font-semibold text-lg">Transaction Details</h3>
          <button
            onClick={onClose}
            className="text-mutes/50 hover:text-mutes transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-mutes/50 text-sm">Title</p>
            <p className="text-mutes font-semibold">{transaction.title}</p>
          </div>

          <div>
            <p className="text-mutes/50 text-sm">Amount</p>
            <p
              className={`text-lg font-bold ${
                transaction.type === "income" ? "text-green-400" : "text-red-400"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}${parseFloat(transaction.amount).toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-mutes/50 text-sm">Type</p>
            <p className="text-mutes capitalize font-medium">{transaction.type}</p>
          </div>

          <div>
            <p className="text-mutes/50 text-sm">Date</p>
            <p className="text-mutes">{transaction.date}</p>
          </div>

          {transaction.category && (
            <div>
              <p className="text-mutes/50 text-sm">Category</p>
              <p className="text-mutes">{transaction.category}</p>
            </div>
          )}

          {transaction.tags && (
            <div>
              <p className="text-mutes/50 text-sm">Tags</p>
              <p className="text-mutes">{transaction.tags}</p>
            </div>
          )}

          {transaction.notes && (
            <div>
              <p className="text-mutes/50 text-sm">Notes</p>
              <p className="text-mutes text-sm">{transaction.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const TransactionCard = ({ t, onEdit, onDelete }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  function handleDelete() {
    onDelete(t.id);
    setOpenConfirm(false);
  }

  return (
    <>
      <div
        className={`p-4 rounded-xl border bg-gray-900/50 cursor-pointer hover:bg-gray-900/70 transition-colors ${
          t.type === "income" ? "border-green-500/30" : "border-red-500/30"
        }`}
        onClick={() => setShowDetail(true)}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-mutes font-semibold">{t.title}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-mutes/50">
              {t.category && (
                <span className="px-2 py-0.5 rounded-full bg-mutes/10 border border-mutes/20 text-mutes/70">
                  {t.category}
                </span>
              )}
              <span>{t.date}</span>
              {t.tags && (
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {t.tags}
                </span>
              )}
            </div>
            {t.notes && (
              <p className="flex items-center gap-1 text-xs text-mutes/40">
                <FileText className="w-3 h-3" />
                {t.notes}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-3 shrink-0">
            <p
              className={`font-bold text-lg ${
                t.type === "income" ? "text-green-400" : "text-red-400"
              }`}
            >
              {t.type === "income" ? "+" : "-"}$
              {parseFloat(t.amount).toFixed(2)}
            </p>
            <div className=" flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 rounded-lg text-mutes/40 hover:text-mutes hover:bg-mutes/10 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenConfirm(true);
                }}
                className="p-1.5 rounded-lg text-mutes/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        itemName={t.title}
      />
      {showDetail && (
        <TransactionDetailModal transaction={t} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
};
