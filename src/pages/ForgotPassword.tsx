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
    <main className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Redefinição de senha</h1>
        <p className="mt-1 text-sm text-gray-600">Digite seu e-mail para receber um link de redefinição.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium duration-300 hover:cursor-pointer hover:scale-105 text-white ${loading ? 'opacity-70' : 'hover:bg-purple-700'}`}
          >
            {loading ? 'Enviando...' : 'Enviar link de redefinição'}
          </button>
        </form>

        {success && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}


        <div className="mt-3 text-center hover:bg-gray-200 group py-2 duration-300 rounded-md hover:cursor-pointer hover:scale-105">
          <a href="/login" className="text-sm text-mint-600 group-hover:text-purple-600 duration-300">Voltar ao login</a>
        </div>
      </section>
        {error && <BoxMessage error={true} message={error} />}
    </main>
  )
}