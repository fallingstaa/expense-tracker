import { Tag, FileText, Pencil, Trash2 } from "lucide-react";

export const TransactionCard = ({ t, onEdit, onDelete }) => (
  <div
    className={`p-4 rounded-xl border bg-gray-900/50 ${t.type === "income" ? "border-green-500/30" : "border-red-500/30"}`}
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
          className={`font-bold text-lg ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
        >
          {t.type === "income" ? "+" : "-"}${parseFloat(t.amount).toFixed(2)}
        </p>
        <div className=" flex items-center gap-3">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-mutes/40 hover:text-mutes hover:bg-mutes/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-mutes/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);
