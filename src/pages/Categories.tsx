import { useEffect, useRef, useState } from "react";
import Footer from "../components/Fotter";
import NavBar from "../components/NavBar";
import type { Category } from "../types/transactions";
import { Edit, Trash } from "react-feather";
import ModalConfirmDeleteTransaction from "../components/ModalConfirmDeleteTransaction";
import BoxMessage from "../components/BoxMessage";
import { useNavigate } from "react-router";
import { deleteCategoryById, getCategories20 } from "../services/categoriesService";

export default function Categories() {
  const navigate = useNavigate();

  //  Estados principais
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);

  //  Modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);

  //  Mensagens de feedback
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  //  Refs para manter valores atualizados no IntersectionObserver
  const isLoadingRef = useRef(isLoading);
  const hasMoreRef = useRef(hasMoreTransactions);
  const pageRef = useRef(currentPage);

  useEffect(() => {
    isLoadingRef.current = isLoading;
    hasMoreRef.current = hasMoreTransactions;
    pageRef.current = currentPage;
  }, [isLoading, hasMoreTransactions, currentPage]);

  //  Função para carregar transações paginadas
  const loadTransactions = async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return;

    setIsLoading(true);
    try {
      const newTransactions = await getCategories20(pageRef.current);

      if (newTransactions.length === 0) {
        setHasMoreTransactions(false);
      } else {
        // Evita duplicações
        setCategories(prev => {
          const existingIds = new Set(prev.map(tx => tx.id));
          const uniqueTransactions = newTransactions.filter(tx => !existingIds.has(tx.id));
          return [...prev, ...uniqueTransactions];
        });
        setCurrentPage(prev => {
          const nextPage = prev + 1;
          pageRef.current = nextPage;
          return nextPage;
        });
      }
    } catch (err) {
      console.log(err)
      setMessage("Erro ao carregar as categorias.");
      setIsError(true);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  //  Carrega a primeira página apenas uma vez
  useEffect(() => {
    loadTransactions();
  }, []);

  //  Scroll infinito com IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current) return;

    let initialTrigger = true;
    const observer = new IntersectionObserver(entries => {
      const first = entries[0];
      if (first.isIntersecting && !isLoadingRef.current && hasMoreRef.current) {
        if (initialTrigger) {
          initialTrigger = false;
          return;
        }
        loadTransactions();
      }
    });

    const loader = loaderRef.current;
    observer.observe(loader);
    return () => observer.unobserve(loader);
  }, []);

  //  Exclusão de transação
  const handleConfirmDelete = async (id: number) => {
    try {
      await deleteCategoryById(id);
      setCategories(prev => prev.filter(tx => tx.id !== id));
      setMessage("Categoria excluída com sucesso!");
      setIsError(false);
    } catch (err: any) {
      setMessage(err.message || "Erro ao excluir categoria.");
      setIsError(true);
    } finally {
      setShowDeleteModal(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen flex flex-col items-center p-4">
        <section className="mt-10 mb-6 w-full max-w-5xl">
          <h1 className="text-3xl font-semibold mb-4 dark:text-gray-200">Categorias de Transação</h1>

          <div className="overflow-x-auto w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <table className="min-w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 rounded-xl">
                <tr>
                  {["Nome", "Tipo", "Cor", "Icon", "Opções"].map(header => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 rounded-xl">
                {categories.map((tx, index) => (
                  <tr key={`${tx.id ?? 'no-id'}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                      {tx.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{tx.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200">
                      <div className={`py-2 px-2`} style={{ backgroundColor: tx.color}} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200">
                      {tx.icon}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => navigate(`/edit-transaction/${tx.id}`)} className="text-blue-600 hover:cursor-pointer hover:text-white hover:bg-blue-600 rounded-md p-1 duration-200 hover:scale-105">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:cursor-pointer hover:text-white hover:bg-red-600 rounded-md p-1 duration-200 hover:scale-105"
                          onClick={() => {
                            setCategoryIdToDelete(tx.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*  Loader / Scroll Infinito */}
          <div ref={loaderRef} className="py-6 flex items-center justify-center text-gray-500">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-300"></div>
            ) : hasMoreTransactions ? "Deslize para carregar mais" : "Fim da lista"}
          </div>
        </section>

        {/*  Modal de exclusão */}
        {showDeleteModal && categoryIdToDelete && (
          <ModalConfirmDeleteTransaction
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => handleConfirmDelete(categoryIdToDelete)}
          />
        )}

        {/*  Mensagens de feedback */}
        {message && <BoxMessage message={message} error={isError} />}
      </main>
      <Footer />
    </>
  );
}
