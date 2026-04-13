import { useTransaction } from "../../../hooks/useTransaction";
import { TransactionCard } from "./transactionCard";
import { TransactionDialog } from "./transactionDialog";

const Transaction = () => {
  const {
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
    isSaving,
    error,
    onClose,
  } = useTransaction();

  return (
    <section className="pb-5">
      <div className="mt-5 mb-5 mr-5 ml-5">
        <div className="max-w-8xl mx-auto">
          <div className="p-5 bg-gray-800/50 border border-mutes/20 rounded-lg">
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-xl md:text-2xl text-mutes font-bold">
                Transactions
              </h1>
              <button
                onClick={openAdd}
                className="py-2 px-4 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Add Transaction
              </button>
            </div>

            {transactions.length === 0 ? (
              isLoading ? (
                <div className="pt-20 pb-16 text-center">
                  <h1 className="text-xl text-mutes font-bold">Loading transactions...</h1>
                </div>
              ) : (
              <div className="pt-20 pb-16 text-center">
                <h1 className="text-xl text-mutes font-bold">
                  No transactions yet
                </h1>
                <p className="text-sm text-mutes/20">
                  Add your first transaction to get started
                </p>
              </div>
              )
            ) : (
              <div className="space-y-3">
                {transactions.map((t) => (
                  <TransactionCard
                    key={t.id}
                    t={t}
                    onEdit={() => openEdit(t)}
                    onDelete={() => handleDelete(t.id)}
                  />
                ))}
              </div>
            )}

            {error?.data?.message ? (
              <p className="mt-4 text-sm text-red-400">{error.data.message}</p>
            ) : null}
          </div>
        </div>
      </div>

      <TransactionDialog
        isOpen={isOpen}
        onClose={onClose}
        form={form}
        setForm={setForm}
        type={type}
        setType={setType}
        recurring={recurring}
        setRecurring={setRecurring}
        onSave={handleSave}
        editId={editId}
        isSaving={isSaving}
      />
    </section>
  );
};

export default Transaction;
