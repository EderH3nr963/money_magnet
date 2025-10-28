import { supabase } from "../api/supabaseClient";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select(`
    id,
    name,
    color,
    type
  `)

  if (error) {
    throw error;
  }
  return data;
}