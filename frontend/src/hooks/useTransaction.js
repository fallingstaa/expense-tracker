import { useState } from "react";
import { emptyForm } from "../components/dashboard/transaction/transactionUtils";
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
} from "../redux/feature/transactions/transactionsAPI";

export const useTransaction = (queryParams = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("expense");
  const [recurring, setRecurring] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const { data, isLoading, isFetching, error, refetch } =
    useGetTransactionsQuery(queryParams);

  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();

  const transactions = data?.transactions ?? [];

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
      tags: Array.isArray(t.tags) ? t.tags.join(", ") : t.tags || "",
      notes: t.notes,
      date: t.date,
    });
    setType(t.type);
    setRecurring(t.recurring);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.amount) return;

    const payload = {
      title: form.title,
      amount: Number(form.amount),
      type,
      category: form.category || null,
      tags: form.tags || "",
      notes: form.notes || "",
      recurring,
      date: form.date,
    };

    if (editId) {
      await updateTransaction({ id: editId, payload }).unwrap();
    } else {
      await createTransaction(payload).unwrap();
    }

    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id).unwrap();
  };

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
    isLoading,
    isFetching,
    isSaving: isCreating || isUpdating,
    isDeleting,
    error,
    refetch,
    onClose: () => setIsOpen(false),
  };
};
