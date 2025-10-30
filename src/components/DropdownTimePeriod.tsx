import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DropdownTimerPeriod({ timePeriod, setTimePeriod }: { timePeriod: number, setTimePeriod: (year: number) => void }) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { user } = useAuth();

  const initialYear = user?.createdAt?.getFullYear() || new Date().getFullYear();

  const years = [];
  for (let i = initialYear; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }

  return (
    <div className="min-w-20">
      <div className="border-2 border-gray-300 text-center rounded-md px-2 py-1 hover:cursor-pointer  hover:border-purple-300 duration-300 dark:border-gray-600 dark:hover:border-purple-600" onClick={() => setShowDropdown(!showDropdown)}>
        <p className="text-md dark:text-gray-200">{timePeriod}</p>
      </div>
      <div
        className={`absolute bg-gray-200 dark:bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-500 ease-in-out ${showDropdown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {
          <>
          {years.map((year) => (
            <button key={year} onClick={(e) => { e.preventDefault(); setTimePeriod(year); setShowDropdown(false); }} className="block px-5 py-2 text-sm hover:bg-purple-700 hover:text-white dark:text-gray-200 rounded mx-1 my-1 duration-200">
              {year}
            </button>
          ))}
          </>
        }
      </div>
    </div>
  )
}