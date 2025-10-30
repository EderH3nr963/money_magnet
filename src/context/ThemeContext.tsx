import { createContext, useContext, useState, type ReactNode } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => { },
})


export default function ThemeProvider({ children }: { children: ReactNode }) {
  const themeCurrent = localStorage.getItem("theme") || "light"

  const [theme, setTheme] = useState(themeCurrent)

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
    localStorage.setItem("theme", theme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}