import { useState } from "react";
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useGetTagsQuery,
  useUpdateTagMutation,
} from "../redux/feature/transactions/tagApi";

const emptyTagForm = {
  name: "",
  color: "",
};

export const useTag = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyTagForm);
  const [editId, setEditId] = useState(null);

  const { data, isLoading, isFetching, error, refetch } = useGetTagsQuery();

  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

  const tags = data?.tags ?? [];

  const openAdd = () => {
    setEditId(null);
    setForm(emptyTagForm);
    setIsOpen(true);
  };

  const openEdit = (tag) => {
    setEditId(tag.id);
    setForm({
      name: tag.name ?? "",
      color: tag.color ?? "",
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
      await updateTag({ id: editId, payload }).unwrap();
    } else {
      await createTag(payload).unwrap();
    }

    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteTag(id).unwrap();
  };

  const closeDialog = () => setIsOpen(false);

  return {
    isOpen,
    form,
    editId,
    tags,

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

export const useTags = useTag;
