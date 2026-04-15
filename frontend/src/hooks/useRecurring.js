import { useState } from "react";
import {
  useCreateRecurringTransactionMutation,
  useDeleteRecurringTransactionMutation,
  useGetRecurringTransactionsQuery,
  useRunDueRecurringTransactionsMutation,
  useUpdateRecurringTransactionMutation,
} from "../redux/feature/transactions/recurringAPI";

const emptyRecurringForm = {
  title: "",
  amount: "",
  type: "expense",
  category: "",
  tags: "",
  notes: "",
  frequency: "monthly",
  interval: 1,
  nextRunAt: "",
  active: true,
};

export const useRecurring = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyRecurringForm);
  const [editId, setEditId] = useState(null);

  const { data, isLoading, isFetching, error, refetch } =
    useGetRecurringTransactionsQuery();

  const [createRecurringTransaction, { isLoading: isCreating }] =
    useCreateRecurringTransactionMutation();
  const [updateRecurringTransaction, { isLoading: isUpdating }] =
    useUpdateRecurringTransactionMutation();
  const [deleteRecurringTransaction, { isLoading: isDeleting }] =
    useDeleteRecurringTransactionMutation();
  const [runDueRecurringTransactions, { isLoading: isRunningDue }] =
    useRunDueRecurringTransactionsMutation();

  const recurringTransactions = data?.recurring ?? [];

  const openAdd = () => {
    setEditId(null);
    setForm(emptyRecurringForm);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title ?? "",
      amount: item.amount ?? "",
      type: item.type ?? "expense",
      category: item.category ?? "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      notes: item.notes ?? "",
      frequency: item.frequency ?? "monthly",
      interval: item.interval ?? 1,
      nextRunAt: item.nextRunAt ? String(item.nextRunAt).slice(0, 10) : "",
      active: item.active !== false,
    });
    setIsOpen(true);
  };

  const buildPayload = () => ({
    title: form.title,
    amount: Number(form.amount),
    type: form.type,
    category: form.category || null,
    tags: form.tags || "",
    notes: form.notes || "",
    frequency: form.frequency || "monthly",
    interval: Number(form.interval) || 1,
    nextRunAt: form.nextRunAt || null,
    active: form.active !== false,
  });

  const handleSave = async () => {
    if (!form.title || !form.amount) return;

    const payload = buildPayload();

    if (editId) {
      await updateRecurringTransaction({ id: editId, payload }).unwrap();
    } else {
      await createRecurringTransaction(payload).unwrap();
    }

    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteRecurringTransaction(id).unwrap();
  };

  const handleRunDue = async () => {
    return runDueRecurringTransactions().unwrap();
  };

  const closeDialog = () => setIsOpen(false);

  return {
    isOpen,
    form,
    editId,
    recurringTransactions,

    setForm,
    openAdd,
    openEdit,
    onClose: closeDialog,

    handleSave,
    handleDelete,
    handleRunDue,

    isLoading,
    isFetching,
    isSaving: isCreating || isUpdating,
    isDeleting,
    isRunningDue,
    error,
    refetch,
  };
};
