import { Upload } from "react-feather";

export default function FloatButtoCSV() {
  return (
    <a href="/import-csv" className="fixed bottom-10 right-10 bg-purple-600 px-5 py-3 rounded-2xl text-white flex flex-row items-center hover:transform hover:scale-105 duration-300 hover:cursor-pointer">
      <Upload className="w-5 h-5 lg:mr-2" />
      <p className="not-lg:hidden">Importar CSV</p>
    </a>
  )
}