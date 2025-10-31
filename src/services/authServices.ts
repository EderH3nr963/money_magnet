import { supabase } from '../api/supabaseClient';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  });
  if (error) throw error;
  return data;
}

export async function signUp({ email, password, name }: any) {
  const { data, error } = await supabase.auth.signUp({
    email, password, options: {
      data: {
        name
      }
    }
  });
  if (error) throw error;
  return data;
}
