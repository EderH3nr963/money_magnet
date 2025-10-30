import { useState } from "react"
import { useNavigate } from "react-router"
import { signIn } from "../services/authServices"
import BoxMessage from "../components/BoxMessage"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)

    if (!form.email || !form.password) {
      setError("Preencha e-mail e senha")
      return
    }

    setLoading(true)
    try {
      await signIn(form.email, form.password)
      navigate("/", { replace: true })
    } catch (err: any) {
      const message = err?.error_description || err?.message || "Credenciais inválidas"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <section className="w-full max-w-md bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="px-6 pt-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Entrar
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Acesse sua conta do MoneyMagnet.
          </p>
        </div>

        <form className="px-6 pb-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="voce@exemplo.com"
              className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-gray-100
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:border-purple-500 focus:ring-purple-500 outline-0 border-b-2 py-2 duration-200"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-gray-100
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:border-purple-500 focus:ring-purple-500 outline-0 border-b-2 py-2 duration-200"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-transparent"  
              />
              Lembrar-me
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-purple-600 hover:text-purple-500 hover:underline"
            >
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            className={`w-full font-medium py-3 rounded-lg transition duration-200 hover:scale-[1.02] hover:cursor-pointer
                        ${loading
                ? "bg-gray-600 text-gray-200 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Ainda não tem conta?{" "}
            <a href="/register" className="text-purple-600 hover:underline">
              Criar conta
            </a>
          </p>
        </form>
      </section>

      {error && <BoxMessage error={true} message={error} />}
    </main>
  )
}
