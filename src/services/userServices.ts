import { supabase } from '../api/supabaseClient';

export async function sendResetEmail(email: string) {
  const redirectTo = `${window.location.origin}/update-password`;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw error;
  }
  return data;
}

export async function updatePassword({ password }: { password: string }) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  supabase.auth.signOut();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateEmail({ email }: { email: string }) {
  const { data, error } = await supabase.auth.updateUser({
    email
  }, {
    emailRedirectTo: `${window.location.origin}/settings`,
  });

  if (error) {
    throw error;
  }
  return data;
}

export async function updateUsername({ username }: { username: string }) {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      name: username
    }
  });

  if (error) {
    throw error;
  }
  return data;
}
