import { useState } from "react";
import { signUp } from "../services/authServices";
import BoxMessage from "../components/BoxMessage";

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPass: ''
  });
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(undefined);

    if (form.password !== form.confirmPass) {
      setError('As senhas não coincidem');
      return;
    }

    if (!form.email || !form.password || !form.name) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const data = await signUp({
        name: form.name,
        email: form.email,
        password: form.password
      });
      console.log(data);
    } catch (err: any) {
      const message = err?.error_description || err?.message || 'Erro desconhecido';
      console.log(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 pt-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-sm text-gray-600 mt-1">Comece a organizar seu negócio com o MoneyMagnet.</p>
        </div>

        <form className="px-6 pb-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="name"
              type="text"
              required
              placeholder="Seu nome"
              className="mt-1 w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 outline-0 border-b-2 py-2 duration-200"
              autoComplete="name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              required
              placeholder="voce@exemplo.com"
              className="mt-1 w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 outline-0 border-b-2 py-2 duration-200"
              autoComplete="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 ">Senha</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="mt-1 w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 outline-0 border-b-2 py-2 duration-200"
                autoComplete="new-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar senha</label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="mt-1 w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 outline-0 border-b-2 py-2 duration-200"
                autoComplete="new-password"
                onChange={(e) => setForm({ ...form, confirmPass: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="terms"
              type="checkbox"
              required
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Aceito os termos de uso e política de privacidade
            </label>
          </div>

          <button
            type="submit"
            onClick={() => !loading && handleSubmit()}
            className={`w-full ${!loading ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-600 text-white"} font-medium py-3 rounded-lg  hover:cursor-pointer hover:scale-105 transition duration-200`}
          >
            {loading ? 'Carregando...' : 'Criar conta'}
          </button>

          <p className="text-sm text-center text-gray-600">
            Já tem conta? <a href="/login" className="text-purple-600 hover:underline">Entrar</a>
          </p>
        </form>
      </section>
      {error &&
        <BoxMessage error={true} message={error} />
      }
    </main>
  );
}