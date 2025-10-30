import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { updateEmail, updateUsername } from "../services/userServices"
import BoxMessage from "../components/BoxMessage"

export default function EditPerfil() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email ?? "")
  const [username, setUsername] = useState((user?.user_metadata?.name as string | undefined) ?? "")
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
    if (!username.trim()) {
      setError("Informe um nome de usuário.")
      return
    }

    try {
      setLoading(true)
      if (email !== user?.email) {
        await updateEmail({ email })
      }

      if (username !== user?.user_metadata?.name) {
        await updateUsername({ username })
      }

      setSuccess("Dados atualizados. Se o e-mail foi alterado, confirme via link enviado.")
    } catch (err: any) {
      setError(err?.message || "Não foi possível atualizar o perfil.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Editar Perfil</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Atualize seu e-mail e nome de usuário.</p> 

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1 w-full dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none duration-200"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Alterar e-mail pode exigir confirmação via link.</p>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none duration-200"
              placeholder="Seu nome"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md hover:scale-105 hover:cursor-pointer bg-purple-600 px-4 py-2 text-sm font-medium text-white ${loading ? 'opacity-70' : 'hover:bg-purple-700'} duration-300`}
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>

        {success && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}


        <div className="mt-6 text-center rounded-md hover:scale-105 hover:cursor-pointer duration-300 hover:bg-gray-200 dark:hover:bg-gray-900/60 py-2 group">
          <a href="/settings" className="text-sm text-mint-600 group-hover:text-purple-600 dark:text-gray-300">Voltar para Configurações</a>
        </div>
      </section>
      {error && <BoxMessage error={true} message={error} />}
    </main>
  )
}