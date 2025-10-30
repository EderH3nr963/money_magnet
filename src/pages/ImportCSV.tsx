import React, { useState } from "react";
import * as XLSX from "xlsx";
import Footer from "../components/Fotter";
import NavBar from "../components/NavBar";
import { insertTransactions } from "../services/transactionService";
import type { InsertTransaction } from "../types/transactions";

export default function ImportCSV() {
  const [data, setData] = useState<InsertTransaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData: InsertTransaction[] = XLSX.utils.sheet_to_json(sheet);

        // Verifica se há dados na planilha
        if (!sheetData || sheetData.length === 0) {
          setError("A planilha está vazia. Por favor, adicione dados antes de importar.");
          setData(null);
          setIsLoading(false);
          return;
        }

        // 🔍 Verifica se as colunas obrigatórias estão presentes
        const requiredColumns = [
          "description",
          "amount",
          "date",
          "category_name",
          "status",
        ];

        const firstRow = sheetData[0];
        const missingColumns = requiredColumns.filter(
          (col) => !(col in firstRow)
        );

        if (missingColumns.length > 0) {
          setError(
            `❌ Colunas obrigatórias ausentes: ${missingColumns.join(
              ", "
            )}. Verifique se a planilha contém todas as colunas necessárias conforme o exemplo abaixo.`
          );
          setData(null);
          setIsLoading(false);
          return;
        }

        // Validação básica dos dados
        const invalidRows: number[] = [];
        sheetData.forEach((row, index) => {
          if (!row.description || !row.amount || !row.date || !row.category_name || !row.status) {
            invalidRows.push(index + 1);
          }
        });

        if (invalidRows.length > 0) {
          setError(
            `⚠️ Dados incompletos encontrados nas linhas: ${invalidRows.join(", ")}. Verifique se todas as células obrigatórias estão preenchidas.`
          );
          setData(null);
          setIsLoading(false);
          return;
        }

        setData(sheetData);
        setSuccess(`✅ Planilha carregada com sucesso! ${sheetData.length} transações encontradas.`);
        setError(null);
      } catch (err) {
        setError("❌ Erro ao processar a planilha. Verifique se o arquivo está no formato correto (.xlsx ou .xls).");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <NavBar />
      <main className="p-6 min-h-screen w-full flex justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <section className="max-w-6xl w-full">
          {/* Container principal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 transition-colors">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 dark:bg-purple-700 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Importar Transações</h1>
                <p className="text-gray-600 dark:text-gray-300">Carregue suas transações a partir de uma planilha Excel</p>
              </div>
            </div>

            {/* Instruções e Exemplo */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Instruções */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700 transition-colors">
                <h2 className="font-bold text-lg mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Instruções de Formato
                </h2>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                  Sua planilha deve conter <strong>exatamente</strong> as seguintes colunas:
                </p>
                <div className="space-y-3">
                  {[
                    ["description", "Descrição da transação (ex: 'Venda do Produto A')"],
                    ["amount", "Valor numérico (ex: 150.30)"],
                    ["date", "Data no formato YYYY-MM-DD (ex: 2025-01-20)"],
                    ["category_name", 'Categoria ("Vendas", "Serviços", "Transporte", etc.)'],
                    ["status", 'Estado (ex: "Pago", "Pendente", "Recebido")']
                  ].map(([col, desc]) => (
                    <div key={col} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="font-semibold text-blue-900 dark:text-blue-100">{col}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exemplo Visual */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700 transition-colors">
                <h2 className="font-bold text-lg mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exemplo de Dados
                </h2>
                <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                  Veja como sua planilha deve estar estruturada:
                </p>
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-green-100 dark:bg-green-800">
                      <tr>
                        {["description", "amount", "date", "category_name", "status"].map((h) => (
                          <th key={h} className="px-2 py-2 text-left font-semibold text-green-900 dark:text-green-100">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Supermercado", "-150.30", "2025-01-20", "Alimentação", "Pago"],
                        ["Salário", "3000.00", "2025-01-15", "Renda", "Pago"],
                        ["Combustível", "-80.00", "2025-01-18", "Transporte", "Pendente"]
                      ].map(([desc, val, date, cat, stat], i) => (
                        <tr key={i} className="border-b border-green-100 dark:border-green-800">
                          <td className="px-2 py-2 text-green-800 dark:text-green-100">{desc}</td>
                          <td className="px-2 py-2 text-green-800 dark:text-green-100">{val}</td>
                          <td className="px-2 py-2 text-green-800 dark:text-green-100">{date}</td>
                          <td className="px-2 py-2 text-green-800 dark:text-green-100">{cat}</td>
                          <td className="px-2 py-2 text-green-800 dark:text-green-100">{stat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Upload */}
            <div className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl p-8 text-center bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors">
              <div className="flex flex-col items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-700 p-4 rounded-full">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    {isLoading ? "Processando arquivo..." : "Selecione sua planilha"}
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 mb-4">
                    Arraste e solte ou clique para selecionar um arquivo .xlsx ou .xls
                  </p>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="block w-full text-sm text-purple-600 dark:text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {isLoading && (
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Analisando dados...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mensagens de feedback */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 dark:text-green-100 text-sm">{success}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tabela de dados importados */}
          {data && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors">
              <div className="bg-linear-to-r from-purple-600 to-purple-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2" />
                    </svg>
                    Dados Importados
                  </h3>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {data.length} transações
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      {["Data", "Descrição", "Categoria", "Valor", "Status"].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {new Date(item.date).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                            {item.category_name || "Sem categoria"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold">
                          <span className={item.amount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                            {item.amount >= 0 ? "+" : ""}R$ {Math.abs(item.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status === "Pago"
                                ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
                                : item.status === "Pendente"
                                  ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100"
                                  : "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                              }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status === "Pago"
                                  ? "bg-red-400"
                                  : item.status === "Pendente"
                                    ? "bg-yellow-400"
                                    : "bg-green-400"
                                }`}
                            ></div>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rodapé da tabela */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">{data.length}</span> transações prontas para importar
                </div>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-purple-800 hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  onClick={async () => {
                    try {
                      await insertTransactions(data);
                      window.location.href = "/";
                    } catch (err: any) {
                      setError(err.message || "Erro inesperado ao importar transações");
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Importar Transações
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
