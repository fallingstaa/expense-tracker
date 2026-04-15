// import { useState, useRef, useEffect } from "react";
// import { ChevronDown, Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react";

// const DEFAULT_TAGS = [
//   { id: 1, name: "Food", color: "#f97316" },
//   { id: 2, name: "Transport", color: "#3b82f6" },
//   { id: 3, name: "Shopping", color: "#a855f7" },
//   { id: 4, name: "Health", color: "#22c55e" },
// ];

// export const TagSelector = ({
//   value = [],
//   onChange,
//   defaultTags = DEFAULT_TAGS,
// }) => {
//   const [tags, setTags] = useState(defaultTags);
//   const [isOpen, setIsOpen] = useState(false);
//   const [mode, setMode] = useState(null); // null | "add" | "manage"
//   const [editingId, setEditingId] = useState(null);
//   const [editName, setEditName] = useState("");
//   const [newTagName, setNewTagName] = useState("");
//   const [localError, setLocalError] = useState("");
//   const [selected, setSelected] = useState(new Set(value));
//   const ref = useRef(null);
//   const nextId = useRef(100);

//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setIsOpen(false);
//         setMode(null);
//         setLocalError("");
//         setEditingId(null);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const isDupe = (name, excludeId = null) =>
//     tags.some(
//       (t) =>
//         t.name.toLowerCase() === name.trim().toLowerCase() &&
//         t.id !== excludeId,
//     );

//   const toggleTag = (tag) => {
//     if (mode === "manage") return;
//     const next = new Set(selected);
//     next.has(tag.id) ? next.delete(tag.id) : next.add(tag.id);
//     setSelected(next);
//     onChange?.(tags.filter((t) => next.has(t.id)).map((t) => t.name));
//   };

//   const handleAdd = () => {
//     const trimmed = newTagName.trim();
//     if (!trimmed) return setLocalError("Name cannot be empty.");
//     if (isDupe(trimmed)) return setLocalError("Tag already exists.");
//     const id = nextId.current++;
//     setTags((prev) => [...prev, { id, name: trimmed, color: "#6366f1" }]);
//     setNewTagName("");
//     setLocalError("");
//     setMode(null);
//   };

//   const handleEditSave = (tag) => {
//     const trimmed = editName.trim();
//     if (!trimmed) return setLocalError("Name cannot be empty.");
//     if (isDupe(trimmed, tag.id)) return setLocalError("Tag already exists.");
//     setTags((prev) =>
//       prev.map((t) => (t.id === tag.id ? { ...t, name: trimmed } : t)),
//     );
//     setEditingId(null);
//     setEditName("");
//     setLocalError("");
//   };

//   const handleDelete = (tag) => {
//     setTags((prev) => prev.filter((t) => t.id !== tag.id));
//     const next = new Set(selected);
//     next.delete(tag.id);
//     setSelected(next);
//     onChange?.(
//       tags.filter((t) => next.has(t.id) && t.id !== tag.id).map((t) => t.name),
//     );
//   };

//   const startEdit = (tag) => {
//     setEditingId(tag.id);
//     setEditName(tag.name);
//     setLocalError("");
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditName("");
//     setLocalError("");
//   };

//   const selectedTags = tags.filter((t) => selected.has(t.id));

//   return (
//     <div className="relative" ref={ref}>
//       {/* Label */}
//       <label className="text-sm text-mutes mb-2 flex items-center gap-2">
//         <Tag className="w-4 h-4" />
//         Tags
//       </label>

//       {/* Trigger */}
//       <button
//         type="button"
//         onClick={() => {
//           setIsOpen((o) => !o);
//           setMode(null);
//           setLocalError("");
//         }}
//         className="w-full bg-gray-800 border border-mutes/20 text-mutes/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50 flex items-center justify-between hover:border-mutes/40 transition-colors"
//       >
//         {selectedTags.length === 0 ? (
//           <span className="text-mutes/30">Select tags</span>
//         ) : (
//           <div className="flex flex-wrap gap-1.5">
//             {selectedTags.map((tag) => (
//               <span
//                 key={tag.id}
//                 className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-xs"
//               >
//                 {tag.name}
//               </span>
//             ))}
//           </div>
//         )}
//         <ChevronDown
//           className={`w-4 h-4 text-mutes/40 transition-transform duration-200 shrink-0 ml-2 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-gray-900 border border-mutes/20 rounded-2xl shadow-2xl overflow-hidden animate-in">
//           <div className="max-h-52 overflow-y-auto py-1">
//             {tags.length === 0 ? (
//               <p className="text-mutes/30 text-xs text-center py-4">
//                 No tags yet.
//               </p>
//             ) : (
//               tags.map((tag) => (
//                 <div
//                   key={tag.id}
//                   className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-xl transition-colors ${
//                     mode === "manage" ? "" : "hover:bg-gray-800 cursor-pointer"
//                   } ${selected.has(tag.id) && mode !== "manage" ? "bg-indigo-500/10" : ""}`}
//                   onClick={() => toggleTag(tag)}
//                 >
//                   {/* Color dot */}
//                   {tag.color && (
//                     <span
//                       className="w-2.5 h-2.5 rounded-full shrink-0"
//                       style={{ backgroundColor: tag.color }}
//                     />
//                   )}

//                   {editingId === tag.id ? (
//                     <div
//                       className="flex items-center gap-2 w-full"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <input
//                         autoFocus
//                         value={editName}
//                         onChange={(e) => {
//                           setEditName(e.target.value);
//                           setLocalError("");
//                         }}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") handleEditSave(tag);
//                           if (e.key === "Escape") cancelEdit();
//                         }}
//                         className="flex-1 bg-gray-700 border border-indigo-500/50 text-mutes text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
//                       />
//                       <button
//                         onClick={() => handleEditSave(tag)}
//                         className="text-green-400 hover:text-green-300 transition-colors"
//                       >
//                         <Check className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={cancelEdit}
//                         className="text-mutes/40 hover:text-mutes/70 transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <span
//                         className={`flex-1 text-sm ${
//                           selected.has(tag.id) && mode !== "manage"
//                             ? "text-indigo-400 font-semibold"
//                             : "text-mutes/70"
//                         }`}
//                       >
//                         {tag.name}
//                       </span>
//                       {selected.has(tag.id) && mode !== "manage" && (
//                         <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
//                       )}
//                       {mode === "manage" && (
//                         <div
//                           className="flex items-center gap-1 shrink-0"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <button
//                             onClick={() => startEdit(tag)}
//                             className="p-1.5 rounded-lg text-mutes/40 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
//                           >
//                             <Pencil className="w-3.5 h-3.5" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(tag)}
//                             className="p-1.5 rounded-lg text-mutes/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
//                           >
//                             <Trash2 className="w-3.5 h-3.5" />
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>

//           {localError && (
//             <p className="text-red-400 text-xs px-4 pb-1">{localError}</p>
//           )}

//           {/* Add new input */}
//           {mode === "add" && (
//             <div className="px-3 pb-2 pt-1 border-t border-mutes/10">
//               <div className="flex items-center gap-2">
//                 <input
//                   autoFocus
//                   value={newTagName}
//                   onChange={(e) => {
//                     setNewTagName(e.target.value);
//                     setLocalError("");
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleAdd();
//                     if (e.key === "Escape") {
//                       setMode(null);
//                       setNewTagName("");
//                       setLocalError("");
//                     }
//                   }}
//                   placeholder="New tag name…"
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
//                 const next = mode === "add" ? null : "add";
//                 setMode(next);
//                 setEditingId(null);
//                 setLocalError("");
//                 setNewTagName("");
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
//                 setEditingId(null);
//                 setLocalError("");
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

import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  Tag,
} from "lucide-react";
import { useTags } from "../../../hooks/useTag";

function normalizeTagValue(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [];
}

function sameName(a, b) {
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}

const animateStyle =
  "@keyframes animateIn { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }" +
  ".animate-in { animation: animateIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }";

export const TagSelector = ({ value = [], onChange }) => {
  const {
    tags,
    isLoading,
    isFetching,
    isSaving,
    isDeleting,
    error: apiError,
    form,
    setForm,
    openAdd,
    openEdit,
    onClose,
    handleSave,
    handleDelete,
  } = useTags();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); // null | "add" | "manage"
  const [editingId, setEditingId] = useState(null);
  const [localError, setLocalError] = useState("");
  const ref = useRef(null);

  const selectedNames = useMemo(() => normalizeTagValue(value), [value]);

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

  const isSelected = (name) => selectedNames.some((n) => sameName(n, name));

  const isDupe = (name, excludeId = null) =>
    tags.some((t) => sameName(t.name, name) && t.id !== excludeId);

  const toggleTag = (tag) => {
    if (mode === "manage") return;

    const exists = isSelected(tag.name);
    const next = exists
      ? selectedNames.filter((n) => !sameName(n, tag.name))
      : [...selectedNames, tag.name];

    onChange?.(next);
  };

  const handleAddTag = async () => {
    const trimmed = form.name?.trim();
    if (!trimmed) return setLocalError("Name cannot be empty.");
    if (isDupe(trimmed)) return setLocalError("Tag already exists.");

    try {
      await handleSave();
      setLocalError("");
      setMode(null);
    } catch {
      setLocalError("Failed to create tag.");
    }
  };

  const handleEditSave = async (tag) => {
    const trimmed = form.name?.trim();
    if (!trimmed) return setLocalError("Name cannot be empty.");
    if (isDupe(trimmed, tag.id)) return setLocalError("Tag already exists.");

    const wasSelected = isSelected(tag.name);

    try {
      await handleSave();

      if (wasSelected) {
        const next = selectedNames.map((n) =>
          sameName(n, tag.name) ? trimmed : n,
        );
        onChange?.(next);
      }

      setEditingId(null);
      setLocalError("");
    } catch {
      setLocalError("Failed to update tag.");
    }
  };

  const handleDeleteTag = async (tag) => {
    try {
      await handleDelete(tag.id);

      if (isSelected(tag.name)) {
        const next = selectedNames.filter((n) => !sameName(n, tag.name));
        onChange?.(next);
      }
    } catch {
      setLocalError("Failed to delete tag.");
    }
  };

  const startEdit = (tag) => {
    openEdit(tag);
    setEditingId(tag.id);
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

  const displayError = localError || (apiError ? "Failed to load tags." : "");

  const selectedTags = selectedNames.map((name, index) => {
    const found = tags.find((t) => sameName(t.name, name));
    return (
      found || {
        id: "selected-" + index + "-" + name,
        name,
        color: null,
      }
    );
  });

  return (
    <div className="relative" ref={ref}>
      <label className="text-sm text-mutes mb-2 flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Tags
      </label>

      <button
        type="button"
        onClick={() => {
          setIsOpen((o) => !o);
          setMode(null);
          setLocalError("");
        }}
        className="w-full bg-gray-800 border border-mutes/20 text-mutes/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mutes/50 flex items-center justify-between hover:border-mutes/40 transition-colors"
      >
        {selectedTags.length === 0 ? (
          <span className="text-mutes/30">Select tags</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-xs"
              >
                {tag.color ? (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                ) : null}
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <ChevronDown
          className={
            "w-4 h-4 text-mutes/40 transition-transform duration-200 shrink-0 ml-2 " +
            (isOpen ? "rotate-180" : "")
          }
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
            ) : tags.length === 0 ? (
              <p className="text-mutes/30 text-xs text-center py-4">
                No tags yet.
              </p>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className={
                    "group flex items-center gap-2 px-3 py-2 mx-1 rounded-xl transition-colors " +
                    (mode === "manage"
                      ? ""
                      : "hover:bg-gray-800 cursor-pointer ") +
                    (isSelected(tag.name) && mode !== "manage"
                      ? "bg-indigo-500/10"
                      : "")
                  }
                  onClick={() => mode !== "manage" && toggleTag(tag)}
                >
                  {tag.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                  )}

                  {editingId === tag.id ? (
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
                          if (e.key === "Enter") handleEditSave(tag);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="flex-1 bg-gray-700 border border-indigo-500/50 text-mutes text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleEditSave(tag)}
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
                        className={
                          "flex-1 text-sm " +
                          (isSelected(tag.name) && mode !== "manage"
                            ? "text-indigo-400 font-semibold"
                            : "text-mutes/70")
                        }
                      >
                        {tag.name}
                      </span>

                      {isSelected(tag.name) && mode !== "manage" && (
                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}

                      {mode === "manage" && (
                        <div
                          className="flex items-center gap-1 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => startEdit(tag)}
                            className="p-1.5 rounded-lg text-mutes/40 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag)}
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
                    if (e.key === "Enter") handleAddTag();
                    if (e.key === "Escape") {
                      setMode(null);
                      onClose();
                      setLocalError("");
                    }
                  }}
                  placeholder="New tag name…"
                  className="flex-1 bg-gray-800 border border-indigo-500/50 text-mutes placeholder-mutes/30 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddTag}
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
              className={
                "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors " +
                (mode === "add"
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-mutes/50 hover:text-mutes/80 hover:bg-gray-800")
              }
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
              className={
                "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors " +
                (mode === "manage"
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-mutes/50 hover:text-mutes/80 hover:bg-gray-800")
              }
            >
              <Pencil className="w-3.5 h-3.5" />
              Manage
            </button>
          </div>
        </div>
      )}

      <style>{animateStyle}</style>
    </div>
  );
};
