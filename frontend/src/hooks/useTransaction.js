import { useState } from "react";
import { emptyForm } from "../components/dashboard/transaction/transactionUtils";

export const useTransaction = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("expense");
  const [recurring, setRecurring] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setType("expense");
    setRecurring(false);
    setIsOpen(true);
  };

  const openEdit = (t) => {
    setEditId(t.id);
    setForm({
      title: t.title,
      amount: t.amount,
      category: t.category,
      tags: t.tags,
      notes: t.notes,
      date: t.date,
    });
    setType(t.type);
    setRecurring(t.recurring);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.amount) return;
    setTransactions(
      editId
        ? transactions.map((t) =>
            t.id === editId ? { ...form, type, recurring, id: t.id } : t,
          )
        : [...transactions, { ...form, type, recurring, id: Date.now() }],
    );
    setIsOpen(false);
  };

  const handleDelete = (id) =>
    setTransactions(transactions.filter((t) => t.id !== id));

  return {
    isOpen,
    type,
    recurring,
    transactions,
    form,
    editId,

    setForm,
    setType,
    setRecurring,

    openAdd,
    openEdit,
    handleSave,
    handleDelete,
    onClose: () => setIsOpen(false),
  };
};
