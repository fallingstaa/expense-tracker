// import { useState, useRef, useEffect } from "react";
// import { ChevronDown, Plus, Pencil, Trash2, Check, X } from "lucide-react";

// const DEFAULT_CATEGORIES = [
//   "Food",
//   "Transport",
//   "Shopping",
//   "Health",
//   "Housing",
//   "Entertainment",
//   "Utilities",
//   "Education",
// ];

// export const CategorySelect = ({ value, onChange }) => {
//   const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
//   const [isOpen, setIsOpen] = useState(false);
//   const [mode, setMode] = useState(null); // null | "add" | "manage"
//   const [newCat, setNewCat] = useState("");
//   const [editingIdx, setEditingIdx] = useState(null);
//   const [editingVal, setEditingVal] = useState("");
//   const [error, setError] = useState("");
//   const ref = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setIsOpen(false);
//         setMode(null);
//         setNewCat("");
//         setError("");
//         setEditingIdx(null);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const isDupe = (name, excludeIdx = null) =>
//     categories.some(
//       (c, i) =>
//         c.toLowerCase() === name.trim().toLowerCase() && i !== excludeIdx,
//     );

//   const handleAdd = () => {
//     const trimmed = newCat.trim();
//     if (!trimmed) return setError("Name cannot be empty.");
//     if (isDupe(trimmed)) return setError("Category already exists.");
//     setCategories([...categories, trimmed]);
//     setNewCat("");
//     setError("");
//     setMode(null);
//   };

//   const handleDelete = (idx) => {
//     const deleted = categories[idx];
//     const next = categories.filter((_, i) => i !== idx);
//     setCategories(next);
//     if (value === deleted) onChange("");
//   };

//   const handleEditSave = (idx) => {
//     const trimmed = editingVal.trim();
//     if (!trimmed) return setError("Name cannot be empty.");
//     if (isDupe(trimmed, idx)) return setError("Category already exists.");
//     const updated = [...categories];
//     if (value === updated[idx]) onChange(trimmed);
//     updated[idx] = trimmed;
//     setCategories(updated);
//     setEditingIdx(null);
//     setEditingVal("");
//     setError("");
//   };

//   const startEdit = (idx) => {
//     setEditingIdx(idx);
//     setEditingVal(categories[idx]);
//     setError("");
//   };

//   const cancelEdit = () => {
//     setEditingIdx(null);
//     setEditingVal("");
//     setError("");
//   };

//   const selectCategory = (cat) => {
//     onChange(cat);
//     setIsOpen(false);
//     setMode(null);
//     setError("");
//   };

//   return (
//     <div className="relative" ref={ref}>
//       {/* Trigger */}
//       <button
//         type="button"
//         onClick={() => {
//           setIsOpen((o) => !o);
//           setMode(null);
//           setError("");
//         }}
//         className="w-full bg-gray-800 border border-mutes/20 text-mutes/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50 flex items-center justify-between hover:border-mutes/40 transition-colors"
//       >
//         <span className={value ? "text-mutes" : "text-mutes/30"}>
//           {value || "Select category"}
//         </span>
//         <ChevronDown
//           className={`w-4 h-4 text-mutes/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//         />
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-gray-900 border border-mutes/20 rounded-2xl shadow-2xl overflow-hidden animate-in">
//           {/* Category list */}
//           <div className="max-h-52 overflow-y-auto py-1">
//             {categories.length === 0 && (
//               <p className="text-mutes/30 text-xs text-center py-4">
//                 No categories yet.
//               </p>
//             )}
//             {categories.map((cat, idx) => (
//               <div
//                 key={cat}
//                 className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-xl transition-colors ${
//                   mode === "manage" ? "" : "hover:bg-gray-800 cursor-pointer"
//                 } ${value === cat && mode !== "manage" ? "bg-indigo-500/10" : ""}`}
//                 onClick={() => mode !== "manage" && selectCategory(cat)}
//               >
//                 {editingIdx === idx ? (
//                   /* Inline edit */
//                   <div
//                     className="flex items-center gap-2 w-full"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <input
//                       autoFocus
//                       value={editingVal}
//                       onChange={(e) => {
//                         setEditingVal(e.target.value);
//                         setError("");
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") handleEditSave(idx);
//                         if (e.key === "Escape") cancelEdit();
//                       }}
//                       className="flex-1 bg-gray-700 border border-indigo-500/50 text-mutes text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
//                     />
//                     <button
//                       onClick={() => handleEditSave(idx)}
//                       className="text-green-400 hover:text-green-300 transition-colors"
//                     >
//                       <Check className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       className="text-mutes/40 hover:text-mutes/70 transition-colors"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <span
//                       className={`flex-1 text-sm ${
//                         value === cat
//                           ? "text-indigo-400 font-semibold"
//                           : "text-mutes/70"
//                       }`}
//                     >
//                       {cat}
//                     </span>
//                     {value === cat && mode !== "manage" && (
//                       <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
//                     )}
//                     {mode === "manage" && (
//                       <div
//                         className="flex items-center gap-1 shrink-0"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           onClick={() => startEdit(idx)}
//                           className="p-1.5 rounded-lg text-mutes/40 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
//                         >
//                           <Pencil className="w-3.5 h-3.5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(idx)}
//                           className="p-1.5 rounded-lg text-mutes/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
//                         >
//                           <Trash2 className="w-3.5 h-3.5" />
//                         </button>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Error */}
//           {error && <p className="text-red-400 text-xs px-4 pb-1">{error}</p>}

//           {/* Add new inline */}
//           {mode === "add" && (
//             <div className="px-3 pb-2 pt-1 border-t border-mutes/10">
//               <div className="flex items-center gap-2">
//                 <input
//                   autoFocus
//                   value={newCat}
//                   onChange={(e) => {
//                     setNewCat(e.target.value);
//                     setError("");
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleAdd();
//                     if (e.key === "Escape") {
//                       setMode(null);
//                       setNewCat("");
//                       setError("");
//                     }
//                   }}
//                   placeholder="New category name..."
//                   className="flex-1 bg-gray-800 border border-indigo-500/50 text-mutes placeholder-mutes/30 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
//                 />
//                 <button
//                   onClick={handleAdd}
//                   className="px-3 py-2 bg-indigo-500 text-white text-sm rounded-xl hover:opacity-90 transition-opacity font-medium"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Footer actions */}
//           <div className="border-t border-mutes/10 flex">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMode(mode === "add" ? null : "add");
//                 setEditingIdx(null);
//                 setError("");
//                 setNewCat("");
//               }}
//               className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors ${
//                 mode === "add"
//                   ? "text-indigo-400 bg-indigo-500/10"
//                   : "text-mutes/50 hover:text-mutes/80 hover:bg-gray-800"
//               }`}
//             >
//               <Plus className="w-3.5 h-3.5" />
//               Add new
//             </button>
//             <div className="w-px bg-mutes/10" />
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMode(mode === "manage" ? null : "manage");
//                 setEditingIdx(null);
//                 setError("");
//               }}
//               className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors ${
//                 mode === "manage"
//                   ? "text-indigo-400 bg-indigo-500/10"
//                   : "text-mutes/50 hover:text-mutes/80 hover:bg-gray-800"
//               }`}
//             >
//               <Pencil className="w-3.5 h-3.5" />
//               Manage
//             </button>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes animateIn {
//           from { opacity: 0; transform: translateY(-6px) scale(0.98); }
//           to   { opacity: 1; transform: translateY(0)   scale(1);    }
//         }
//         .animate-in {
//           animation: animateIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";

export const CategorySelect = ({ value, onChange }) => {
  const {
    categories,
    isLoading,
    isFetching,
    isSaving,
    isDeleting,
    error: apiError,
    form,
    setForm,
    editId,
    isOpen: _dialogOpen,
    openAdd,
    openEdit,
    onClose,
    handleSave,
    handleDelete,
  } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [localError, setLocalError] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setMode(null);
        setLocalError("");
        setEditingId(null);
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const isDupe = (name, excludeId = null) =>
    categories.some(
      (c) =>
        c.name.toLowerCase() === name.trim().toLowerCase() &&
        c.id !== excludeId,
    );

  const handleAdd = async () => {
    const trimmed = form.name?.trim();
    if (!trimmed) return setLocalError("Name cannot be empty.");
    if (isDupe(trimmed)) return setLocalError("Category already exists.");
    try {
      await handleSave();
      setLocalError("");
      setMode(null);
    } catch {
      setLocalError("Failed to create category.");
    }
  };

  const handleEditSave = async (category) => {
    const trimmed = form.name?.trim();
    if (!trimmed) return setLocalError("Name cannot be empty.");
    if (isDupe(trimmed, category.id))
      return setLocalError("Category already exists.");
    try {
      await handleSave();

      if (value === category.name) onChange(trimmed);
      setEditingId(null);
      setLocalError("");
    } catch {
      setLocalError("Failed to update category.");
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await handleDelete(category.id);
      if (value === category.name) onChange("");
    } catch {
      setLocalError("Failed to delete category.");
    }
  };

  const startEdit = (category) => {
    openEdit(category);
    setEditingId(category.id);
    setLocalError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    onClose();
    setLocalError("");
  };

  const startAdd = () => {
    openAdd();
    setLocalError("");
  };

  const selectCategory = (cat) => {
    onChange(cat.name);
    setIsOpen(false);
    setMode(null);
    setLocalError("");
  };

  const displayError =
    localError || (apiError ? "Failed to load categories." : "");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((o) => !o);
          setMode(null);
          setLocalError("");
        }}
        className="w-full bg-gray-800 border border-mutes/20 text-mutes/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50 flex items-center justify-between hover:border-mutes/40 transition-colors"
      >
        <span className={value ? "text-mutes" : "text-mutes/30"}>
          {value || "Select category"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-mutes/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-gray-900 border border-mutes/20 rounded-2xl shadow-2xl overflow-hidden animate-in">
          <div className="max-h-52 overflow-y-auto py-1">
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center py-6 gap-2 text-mutes/40">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Loading…</span>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-mutes/30 text-xs text-center py-4">
                No categories yet.
              </p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-xl transition-colors ${
                    mode === "manage" ? "" : "hover:bg-gray-800 cursor-pointer"
                  } ${value === cat.name && mode !== "manage" ? "bg-indigo-500/10" : ""}`}
                  onClick={() => mode !== "manage" && selectCategory(cat)}
                >
                  {cat.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                  )}

                  {editingId === cat.id ? (
                    <div
                      className="flex items-center gap-2 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        autoFocus
                        value={form.name}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, name: e.target.value }));
                          setLocalError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(cat);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="flex-1 bg-gray-700 border border-indigo-500/50 text-mutes text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleEditSave(cat)}
                        disabled={isSaving}
                        className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-40"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-mutes/40 hover:text-mutes/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 text-sm ${
                          value === cat.name
                            ? "text-indigo-400 font-semibold"
                            : "text-mutes/70"
                        }`}
                      >
                        {cat.name}
                      </span>
                      {value === cat.name && mode !== "manage" && (
                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}
                      {mode === "manage" && (
                        <div
                          className="flex items-center gap-1 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-1.5 rounded-lg text-mutes/40 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg text-mutes/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {displayError && (
            <p className="text-red-400 text-xs px-4 pb-1">{displayError}</p>
          )}

          {mode === "add" && (
            <div className="px-3 pb-2 pt-1 border-t border-mutes/10">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    setLocalError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                    if (e.key === "Escape") {
                      setMode(null);
                      onClose();
                      setLocalError("");
                    }
                  }}
                  placeholder="New category name…"
                  className="flex-1 bg-gray-800 border border-indigo-500/50 text-mutes placeholder-mutes/30 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAdd}
                  disabled={isSaving}
                  className="px-3 py-2 bg-indigo-500 text-white text-sm rounded-xl hover:opacity-90 transition-opacity font-medium disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-mutes/10 flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const next = mode === "add" ? null : "add";
                setMode(next);
                setEditingId(null);
                setLocalError("");
                if (next === "add") startAdd();
                else onClose();
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                mode === "add"
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-mutes/50 hover:text-mutes/80 hover:bg-gray-800"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add new
            </button>
            <div className="w-px bg-mutes/10" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode(mode === "manage" ? null : "manage");
                setEditingId(null);
                onClose();
                setLocalError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                mode === "manage"
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-mutes/50 hover:text-mutes/80 hover:bg-gray-800"
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              Manage
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes animateIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .animate-in {
          animation: animateIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};
