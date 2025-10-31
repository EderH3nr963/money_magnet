export type CategoryType = "receita" | "despesa";

export interface Category {
  id: number;
  name: string;
  color: string;
  type: CategoryType;
  icon?: string;
}

export interface Transaction {
  id: number;
  date: string; // ISO string
  description: string;
  category: Category;
  category_id?: number;
  amount: number; // positivo (receita) ou negativo (despesa)
  status: string;
  payment_method: string | null;
}

export interface InsertTransaction {
  date: string;
  description: string;
  category_id?: number;
  category_name?: string;
  amount: number;
  status: string;
  user_id?: string;
}

export interface EditTransaction {
  date: string;
  description: string;
  category_id?: number;
  amount: number;
  status: string;
}
