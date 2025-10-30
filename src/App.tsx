import HomePage from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Settings from './pages/Settings'
import EditPerfil from './pages/EditPerfil'
import ForgotPassword from './pages/ForgotPassword'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './context/AuthContext'
import type { ReactNode } from 'react'
import UpdatePassword from './pages/UpdatePassword'
import TransactionsPage from './pages/Transactions'
import ImportCSV from './pages/ImportCSV'
import EditTransaction from './pages/EditTransaction'
import ThemeProvider, { useTheme } from './context/ThemeContext'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RoutesReact() {
  return (
      <Routes>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/edit-transaction/:id" element={<PrivateRoute><EditTransaction /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditPerfil /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
        <Route path="/import-csv" element={<PrivateRoute><ImportCSV /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
  )
}

function ApplyTheme({children}: {children: ReactNode}) {
  const { theme } = useTheme();

  return (
    <div data-theme={theme === 'light' ? 'light' : 'dark'} className='dark:bg-gray-900'>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApplyTheme>
          <BrowserRouter>
            <RoutesReact />
          </BrowserRouter>
        </ApplyTheme>
      </AuthProvider>
    </ThemeProvider>
  )
}