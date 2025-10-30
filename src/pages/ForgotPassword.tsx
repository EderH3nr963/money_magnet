import { useState } from "react"
import { sendResetEmail } from "../services/userServices"
import BoxMessage from "../components/BoxMessage"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Informe um e-mail válido.")
      return
    }

    try {
      setLoading(true)
      await sendResetEmail(email)
      setSuccess("Se o e-mail existir, enviamos instruções para redefinir sua senha.")
    } catch (err: any) {
      setError(err?.message || "Não foi possível enviar o e-mail de redefinição.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-100 p-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Redefinição de senha</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Digite seu e-mail para receber um link de redefinição.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-purple-500 focus:outline-none duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md bg-purple-600 hover:cursor-pointer text-white font-medium py-2 hover:scale-105 transition duration-200 ${loading ? "opacity-70" : "hover:bg-purple-700"
              }`}
          >
            {loading ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>

        {success && (
          <div className="mt-4 rounded-md border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-3 text-sm text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        <div className="mt-3 text-center hover:bg-gray-200 dark:hover:bg-gray-800 group py-2 duration-300 rounded-md hover:cursor-pointer hover:scale-105">
          <a href="/login" className="text-sm text-mint-600 group-hover:text-purple-600 duration-300">Voltar ao login</a>
        </div>
      </section>

      {error && <BoxMessage error={true} message={error} />}
    </main>
  )
}
