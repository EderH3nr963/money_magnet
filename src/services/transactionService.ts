// services/transactionsService.ts
import { supabase } from "../api/supabaseClient";
import type { Transaction, InsertTransaction, Category, EditTransaction } from "../types/transactions";
import { getCategories } from "./categoriesService";

interface TransactionRow {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: string;
  payment_method?: string | null;
  categories?: Category | Category[] | null;
}

function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    date: row.date,
    status: row.status,
    category: Array.isArray(row.categories)
      ? row.categories[0] || {
        id: 0,
        name: "Sem categoria",
        color: "#ccc",
        type: "despesa",
      }
      : row.categories || {
        id: 0,
        name: "Sem categoria",
        color: "#ccc",
        type: "despesa",
      },
    payment_method: row.payment_method ?? null,

  };
}

/**
 * Retorna transações do ano atual
 */
export async function getTransactionCurrentYear(): Promise<Transaction[]> {
  const currentYear = new Date().getFullYear();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
        id,
        description,
        amount,
        date,
        status,
        payment_method,
        categories:fk_category (
          id,
          name,
          color,
          type
        )
      `
    )
    .gte("date", `${currentYear}-01-01`)
    .lte("date", `${currentYear}-12-31`)
    .order("date", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map(mapTransaction);
}

/**
 * Retorna as 20 transações mais recentes (paginadas)
 */
export async function getTransaction20(page = 1): Promise<Transaction[]> {
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
        id,
        description,
        amount,
        date,
        status,
        payment_method,
        categories:fk_category (
          id,
          name,
          color,
          type
        )
      `
    )
    .order("date", { ascending: false })
    .range(from, to);

  if (error) throw error;
  if (!data) return [];

  return data.map(mapTransaction);
}

/**
 * Deleta transação pelo ID
 */
export async function deleteTransactionById(id: number): Promise<void> {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Insere múltiplas transações
 */
export async function insertTransactions(transactions: InsertTransaction[]): Promise<void> {
  if (!transactions.length) return;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const userId = userData?.user?.id;
  const categories = await getCategories();

  const formatted = transactions.map((t) => {
    const matchedCategory = categories.find((c) => c.name === t.category_name);
    return {
      date: new Date(t.date).toISOString(),
      description: t.description,
      amount: Math.abs(t.amount),
      status: t.status,
      category_id: matchedCategory?.id ?? 6, // fallback padrão
      user_id: userId,
    };
  });

  const { error } = await supabase.from("transactions").insert(formatted);
  if (error) throw error;
}

export async function getTransactionById(id: number): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
        id,
        description,
        amount,
        date,
        status,
        payment_method,
        categories:fk_category (
          id,
          name,
          color,
          type
        )
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return mapTransaction(data);
}

export async function editTransaction(id: number, transaction: EditTransaction): Promise<void> {
  const { error } = await supabase
    .from("transactions")
    .update({
      date: new Date(transaction.date).toISOString(),
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      status: transaction.status,
      category_id: transaction.category_id,
    })
    .eq("id", id);

  if (error) throw error;
}
