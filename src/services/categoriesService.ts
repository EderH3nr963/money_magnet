import { supabase } from "../api/supabaseClient";
import type { Category, CategoryWithoutId } from "../types/transactions";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select(`
    id,
    name,
    color,
    type
  `)
    .eq("deleted", false)

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Retorna as 20 transações mais recentes (paginadas)
 */
export async function getCategories20(page = 1): Promise<Category[]> {
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
        id,
        name,
        type,
        color,
        icon
      `
    )
    .eq("deleted", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  if (!data) return [];

  return data;
}

export async function deleteCategoryById(id: number): Promise<void> {
  const { error } = await supabase.from("categories").update({
    deleted: true
  }).eq("id", id)

  if (error) throw error;
}

export async function getCategoryById (id: number) {
  const { data, error } = await supabase.from("categories").select(`
    id,
    name,
    type,
    color,
    icon
  `).eq("id", id).eq("deleted", false)

  if (error) throw error;
  if (!data) return null;

  return data[0];
}

export async function editCategory (id: number, category: Category) {
  const { error } = await supabase.from("categories").update({
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
  }).eq("id", id)

  if (error) throw error;
}

export async function addCategory (category: CategoryWithoutId) {
  const { error } = await supabase.from("categories").insert({
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
  })

  if (error) throw error;
}