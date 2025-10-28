import { useState } from "react";

export default function DropdownTimerPeriod() {
  const [timePeriod, setTimePeriod] = useState<string>('Últimos 30 dias');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <div className="min-w-20">
      <div className="border-2 border-gray-300 rounded-md px-2 py-1 hover:cursor-pointer  hover:border-purple-300 duration-300" onClick={() => setShowDropdown(!showDropdown)}>
        <p className="text-md">{timePeriod}</p>
      </div>
      <div
        className={`absolute bg-gray-200 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-500 ease-in-out ${showDropdown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <a href="#" onClick={(e) => { e.preventDefault(); setTimePeriod('Últimos 30 dias'); setShowDropdown(false); }} className="block px-5 py-2 text-sm hover:bg-purple-700 hover:text-white rounded mx-1 my-1">Últimos 30 dias</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setTimePeriod('Últimos 60 dias'); setShowDropdown(false); }} className="block px-5 py-2 text-sm hover:bg-purple-700 hover:text-white rounded mx-1 my-1">Últimos 60 dias</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setTimePeriod('Últimos 90 dias'); setShowDropdown(false); }} className="block px-5 py-2 text-sm hover:bg-purple-700 hover:text-white rounded mx-1 my-1">Últimos 90 dias</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setTimePeriod('Últimos 12 meses'); setShowDropdown(false); }} className="block px-5 py-2 text-sm hover:bg-purple-700 hover:text-white rounded mx-1 my-1">Últimos 12 meses</a>
      </div>
    </div>
  )
}