import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../redux/feature/transactions/categoriesApi";

const emptyCategoryForm = {
  name: "",
  color: "",
};

export const useCategories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyCategoryForm);
  const [editId, setEditId] = useState(null);

  const { data, isLoading, isFetching, error, refetch } =
    useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = data?.categories ?? [];

  const openAdd = () => {
    setEditId(null);
    setForm(emptyCategoryForm);
    setIsOpen(true);
  };

  const openEdit = (category) => {
    setEditId(category.id);
    setForm({
      name: category.name ?? "",
      color: category.color ?? "",
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    const name = form.name?.trim();
    if (!name) return;

    const payload = {
      name,
      color: form.color?.trim() || null,
    };

    if (editId) {
      await updateCategory({ id: editId, payload }).unwrap();
    } else {
      await createCategory(payload).unwrap();
    }

    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id).unwrap();
  };

  const closeDialog = () => setIsOpen(false);

  return {
    isOpen,
    form,
    editId,
    categories,

    setForm,
    openAdd,
    openEdit,
    onClose: closeDialog,

    handleSave,
    handleDelete,

    isLoading,
    isFetching,
    isSaving: isCreating || isUpdating,
    isDeleting,
    error,
    refetch,
  };
};
