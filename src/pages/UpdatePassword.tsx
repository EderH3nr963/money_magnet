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
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));

    if (hashParams.get("error")) {
      setError(hashParams.get("error_description") || "Token inválido.")
      setTimeout(() => { window.location.href = "/login" }, 3000)
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
      }, 1000)
    } catch (err: any) {
      setError(err?.message || "Não foi possível atualizar sua senha.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Atualizar sua senha</h1>
        <p className="mt-1 text-sm text-gray-600">Digite sua nova senha e confirme.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              autoComplete="password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              autoComplete="password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium duration-300 hover:cursor-pointer hover:scale-105 text-white ${loading ? 'opacity-70' : 'hover:bg-purple-700'}`}
          >
            {loading ? 'Atualizando...' : 'Atualizar senha'}
          </button>
        </form>

        {success && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

      </section>
      {error && <BoxMessage error={true} message={error} />}
    </main>
  )
}