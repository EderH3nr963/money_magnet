import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BoxMessage from "../components/BoxMessage";
import NavBar from "../components/NavBar";
import Footer from "../components/Fotter";

export default function Settings() {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>("");

  const displayName = (user?.user_metadata?.name as string | undefined) ?? (user?.email as string | undefined) ?? 'Usuário';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? undefined;

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));

    if (hashParams.get("message")) {
      setSuccessMessage(hashParams.get("message"))
    }
  }, [])

  return (
    <>
    <NavBar/>
    <main className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
          <p className="text-gray-600 mt-1">Gerencie seu perfil e informações da conta.</p>
        </div>

        {/* Card */}
        <section className="rounded-2xl bg-white shadow-md border border-gray-200">
          {/* Profile header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-purple-600">{initials}</span>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-900">{user?.user_metadata?.name || displayName}</h2>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a href="/edit-profile" className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 hover:cursor-pointer hover:scale-105 duration-300">
                  Editar perfil
                </a >
                <a href="/update-password" className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 hover:bg-purple-700 py-2 text-sm font-medium text-gray-800 hover:text-white hover:cursor-pointer hover:scale-105 duration-300">
                  Redefinir senha
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800">Informações pessoais</h3>
              <dl className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Nome</dt>
                  <dd className="text-sm font-medium text-gray-900">{user?.user_metadata?.name || '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">E-mail</dt>
                  <dd className="text-sm font-medium text-gray-900">{user?.email || '-'}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800">Preferências</h3>
              <p className="mt-2 text-sm text-gray-600">Em breve você poderá personalizar idioma, moeda e notificações.</p>
            </div>
          </div>
        </section>
      </div>
      {
        successMessage &&
        <BoxMessage error={false} message={successMessage} />
      }
    </main>
    <Footer/>
    </>
  );
}
