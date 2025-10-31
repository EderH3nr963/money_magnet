
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

// Icons
import { Settings, LogOut } from 'react-feather';

export default function NavBar() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = (user?.user_metadata?.name as string | undefined) ?? (user?.email as string | undefined) ?? 'Usuário'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? undefined

  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur shadow-md dark:bg-gray-900 dark:border-gray-700">
      <div className="mx-auto max-w-[100vw] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-500">MoneyMagnet</h1>
          </div>

          {/* Right: Desktop links + Avatar */}
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            <ul className="flex space-x-4">
              <li className="hover:bg-gray-100 px-3 py-1 rounded-lg hover:cursor-pointer group dark:hover:bg-gray-800 dark:text-gray-100">
                <a href="/" className="duration-300 text-mint-500 group-hover:text-purple-500">Dashboard</a>
              </li>
              <li className="hover:bg-gray-100 px-3 py-1 rounded-lg hover:cursor-pointer group dark:hover:bg-gray-800 dark:text-gray-100">
                <a href="/transactions" className="duration-300 text-mint-500 group-hover:text-purple-500 ">Transações</a>
              </li>
              <li className="flex items-center hover:bg-gray-100 px-3 py-1 rounded-lg hover:cursor-pointer group dark:hover:bg-gray-800 dark:text-gray-100">
                <a href="/settings">
                  <Settings className=" text-gray-600 group-hover:text-purple-500 hover:cursor-pointer duration-300 dark:text-gray-200" />
                </a>
              </li>
              <li className="flex items-center hover:bg-red-100 px-3 py-1 rounded-lg hover:cursor-pointer group dark:hover:bg-gray-800 dark:text-gray-100">
                <div onClick={() => signOut()}>
                  <LogOut className=" text-gray-600 group-hover:text-red-500 hover:cursor-pointer duration-300 dark:text-gray-200" />
                </div>
              </li>
            </ul>
            <div className="flex items-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Avatar + Hamburger */}
          <div className="flex items-center gap-3 sm:hidden">
            <div className="flex items-center hover:cursor-pointer">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {/* Hamburger icon */}
              <svg
                className={`h-6 w-6 ${menuOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
              {/* Close icon */}
              <svg
                className={`h-6 w-6 ${menuOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`sm:hidden ${menuOpen ? 'block' : 'hidden'} border-t border-gray-200 dark:border-gray-600`}
        role="dialog"
        aria-modal="true"
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          <a className="block rounded-md px-3 py-2 text-base font-medium text-mint-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" href="/">Dashboard</a>
          <a className="block rounded-md px-3 py-2 text-base font-medium text-mint-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" href="/transactions">Transações</a>
          <a className="block rounded-md px-3 py-2 text-base font-medium text-mint-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" href="/settings">Configurações</a>
          <div onClick={() => signOut()} className="block rounded-md px-3 py-2 text-base font-medium text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">Sair</div>
        </div>
      </div>
    </nav>
  )
}