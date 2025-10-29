// Componentes
import NavBar from "../components/NavBar";

// Icons 
import { TrendingUp, TrendingDown } from "react-feather";
import Footer from "../components/Fotter";

// Auth
import { useAuth } from "../context/AuthContext";
import { calculateCurrentMetrics } from "../services/analytics";
import { useEffect, useState } from "react";
import { getTransactionCurrentYear } from "../services/transactionService";
import type { Transaction } from "../types/transactions";
import FloatButtoCSV from "../components/FloatButtoCSV";
import GraficoFluxoFinanceiro from "../components/GraficoFluxoFinanceiro";
import GraficoFonteReceita from "../components/GraficoFonteReceita";

export default function HomePage() {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const data = await getTransactionCurrentYear();
        setTransaction(data);
      } catch (error) {
      }
    }
    fetchTransaction();
  }, []);


  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };


  // Dados calculados dinamicamente
  const metrics = calculateCurrentMetrics(transaction || []);


  // Últimas transações (apenas as 6 mais recentes)
  const recentTransactions = transaction
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
    .map(t => ({
      ...t,
      date: new Date(t.date).toLocaleDateString('pt-BR'),
      value: formatCurrency(Math.abs(t.amount))
    }));

  return (
    <div data-theme="dark">
      <NavBar />
      <main className="mt-4 md:mt-6 lg:mt-10 px-4 md:px-8 lg:px-16 xl:px-20">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Olá, {user?.user_metadata.name.split(' ')[0] || "Micro Herói"}!</h1>
            <p className="text-lg md:text-xl text-gray-600">Acompanhe sua jornada financeira</p>
          </div>
        </header>

        <section className="flex flex-col lg:flex-row w-full justify-center items-start gap-6" aria-labelledby="dashboard-heading">
          <div className="flex flex-col w-full lg:w-1/2 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <article className="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-purple-500 w-full">
                <h3 className="text-gray-500 text-sm font-medium">Receita Total</h3>
                <p className="text-xl md:text-2xl font-semibold text-gray-800 mt-2">{formatCurrency(metrics.receita)}</p>
                <p className={`text-sm mt-1 flex items-center ${metrics.receitaGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.receitaGrowth >= 0 ?
                    <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true"></TrendingUp> :
                    <TrendingDown className="w-4 h-4 mr-1" aria-hidden="true"></TrendingDown>
                  }
                  <span>{formatPercentage(metrics.receitaGrowth)} vs último mês</span>
                </p>
              </article>

              <article className="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-blue-500 w-full">
                <h3 className="text-gray-500 text-sm font-medium">Despesas</h3>
                <p className="text-xl md:text-2xl font-semibold text-gray-800 mt-2">{formatCurrency(metrics.despesa)}</p>
                <p className={`text-sm mt-1 flex items-center ${metrics.despesaGrowth <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.despesaGrowth <= 0 ?
                    <TrendingDown className="w-4 h-4 mr-1" aria-hidden="true"></TrendingDown> :
                    <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true"></TrendingUp>
                  }
                  <span>{formatPercentage(metrics.despesaGrowth)} vs último mês</span>
                </p>
              </article>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <article className="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-green-500 w-full">
                <h3 className="text-gray-500 text-sm font-medium">Lucro</h3>
                <p className="text-xl md:text-2xl font-semibold text-gray-800 mt-2">{formatCurrency(metrics.lucro)}</p>
                <p className={`text-sm mt-1 flex items-center ${metrics.lucroGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.lucroGrowth >= 0 ?
                    <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true"></TrendingUp> :
                    <TrendingDown className="w-4 h-4 mr-1" aria-hidden="true"></TrendingDown>
                  }
                  <span>{formatPercentage(metrics.lucroGrowth)} vs último mês</span>
                </p>
              </article>

              <article className="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-yellow-500 w-full">
                <h3 className="text-gray-500 text-sm font-medium">Margem</h3>
                <p className="text-xl md:text-2xl font-semibold text-gray-800 mt-2">{metrics.margem.toFixed(1)}%</p>
                <p className={`text-sm mt-1 flex items-center ${metrics.margemGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.margemGrowth >= 0 ?
                    <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true"></TrendingUp> :
                    <TrendingDown className="w-4 h-4 mr-1" aria-hidden="true"></TrendingDown>
                  }
                  <span>{formatPercentage(metrics.margemGrowth)} vs último mês</span>
                </p>
              </article>
            </div>
          </div>


          <GraficoFluxoFinanceiro />
        </section>

        <section className="flex flex-col lg:flex-row w-full justify-center items-start gap-6 mt-20 mb-20">
          <GraficoFonteReceita transaction={transaction} />

          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 ">Últimas Transações</h3>
              <a href="/transactions" className="text-sm text-purple-600 hover:bg-gray-200 p-2 rounded-md transition duration-300">Ver todas</a>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <table className="min-w-full bg-white rounded-xl shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{tx.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{tx.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tx.category?.name || 'Nenhuma'}</td>
                      <td className={`px-4 py-3 text-sm font-semibold text-gray-900 ${tx.status === 'Pago' ? ' text-red-800' : tx.status === 'Recebido' ? ' text-green-800' : ' text-yellow-800'}`}>
                        {tx.category?.type === 'receita' ? tx.value : `-${tx.value}`}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'Pago' ? 'bg-red-100 text-red-800' : tx.status === 'Recebido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <FloatButtoCSV />
      </main>
      <Footer />
    </div>
  );
}