import { useEffect, useState } from "react";
import type { Category, EditTransaction, Transaction } from "../types/transactions";
import { editTransaction, getTransactionById } from "../services/transactionService";
import { useNavigate, useParams } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Fotter";
import { getCategories } from "../services/categoriesService";
import BoxMessage from "../components/BoxMessage";

export default function EditTransaction() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate("/transactions", { replace: true });
      return;
    }

    const fetchTransaction = async () => {
      try {
        const dataTransaction = await getTransactionById(Number(id));
        const dataCategories = await getCategories();
        if (!dataTransaction) {
          setMessage("Transação não encontrada.");
          setIsError(true);
          setTimeout(() => navigate("/transactions", { replace: true }), 2000);
          return;
        }
        setTransaction(dataTransaction);
        setCategories(dataCategories);
      } catch {
        setMessage("Erro ao carregar a transação.");
        setIsError(true);
        setTimeout(() => navigate("/transactions", { replace: true }), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 dark:text-gray-300 bg-linear-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        Carregando transação...
      </div>
    );
  }

  if (!transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    setMessage("");

    try {
      const transactionEdit: EditTransaction = {
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        status: transaction.status,
        category_id: transaction.category_id,
      };

      await editTransaction(Number(id), transactionEdit);
      setMessage("Transação editada com sucesso!");
      setIsError(false);
      setTimeout(() => navigate("/transactions", { replace: true }), 2000);
    } catch {
      setMessage("Erro ao editar a transação.");
      setIsError(true);
    }
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen flex justify-center items-center p-6 bg-linear-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <section className="w-full max-w-2xl bg-white dark:bg-gray-900 dark:text-gray-100 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Editar Transação</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Atualize as informações abaixo e salve as alterações.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <input
                id="description"
                type="text"
                value={transaction.description}
                onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500 focus:outline-none duration-200"
                placeholder="Ex: Almoço com cliente"
              />
            </div>

            {/* Valor e Data */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor (R$)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={transaction.amount}
                  onChange={(e) => setTransaction({ ...transaction, amount: parseFloat(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500 focus:outline-none duration-200"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data
                </label>
                <input
                  id="date"
                  type="date"
                  value={transaction.date.split("T")[0]}
                  onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500 focus:outline-none duration-200"
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria
              </label>
              <select
                id="category"
                value={transaction.category_id || ""}
                onChange={(e) => setTransaction({ ...transaction, category_id: Number(e.target.value) })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500 focus:outline-none duration-200"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white dark:bg-gray-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status e Método de Pagamento */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  id="status"
                  value={transaction.status}
                  onChange={(e) => setTransaction({ ...transaction, status: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500 focus:outline-none duration-200"
                >
                  <option value="pendente" className="bg-white dark:bg-gray-900">Pendente</option>
                  <option value="pago" className="bg-white dark:bg-gray-900">Pago</option>
                  <option value="cancelado" className="bg-white dark:bg-gray-900">Cancelado</option>
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Método de Pagamento
                </label>
                <input
                  id="payment_method"
                  type="text"
                  value={transaction.payment_method ?? ""}
                  onChange={(e) => setTransaction({ ...transaction, payment_method: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500 focus:outline-none duration-200"
                  placeholder="Ex: Cartão, Pix, Dinheiro"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/transactions")}
                className="rounded-md border border-gray-300 hover:cursor-pointer dark:border-gray-600 dark:hover:border-red-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-600 hover:text-white hover:scale-105 transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`rounded-md bg-purple-600 px-4 py-2 hover:cursor-pointer text-sm font-medium text-white hover:scale-105 hover:bg-purple-700 transition duration-200 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>

        {message && <BoxMessage error={isError} message={message} />}
      </main>
      <Footer />
    </>
  );
}
