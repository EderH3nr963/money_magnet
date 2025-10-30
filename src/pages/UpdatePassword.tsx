import { useEffect, useState } from "react"
import { updatePassword } from "../services/userServices"
import BoxMessage from "../components/BoxMessage"

export default function UpdatePassword() {
  const [confirmPassword, setConfirmPassword] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""))

    if (hashParams.get("error")) {
      setError(hashParams.get("error_description") || "Token inválido.")
      setTimeout(() => {
        window.location.href = "/login"
      }, 3000)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    try {
      setLoading(true)
      await updatePassword({ password })
      setSuccess("Sua senha foi atualizada com sucesso.")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
    } catch (err: any) {
      setError(err?.message || "Não foi possível atualizar sua senha.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 shadow-lg dark:shadow-black/30">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Atualizar sua senha</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Digite sua nova senha e confirme para continuar.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nova Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-700 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-700 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:scale-105 hover:bg-purple-700 transition duration-200 hover:cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Atualizando..." : "Atualizar senha"}
          </button>
        </form>

        {success && (
          <div className="mt-4 rounded-md border border-green-700 bg-green-900/30 p-3 text-sm text-green-400">
            {success}
          </div>
        )}
      </section>

      {error && <BoxMessage error={true} message={error} />}
    </main>
  )
}
