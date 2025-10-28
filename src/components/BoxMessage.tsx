import { AlertTriangle } from "react-feather";

export default function BoxMessage({ error, message }: { error: boolean, message: string }) {
  return (
    <div className={`absolute top-5 left-1/2 -translate-x-1/2 ${error ? "bg-red-200 border-2 border-red-500" : "bg-green-200 border-2 border-green-500"} text-white px-4 py-2 rounded-md shadow-lg flex items-center flex-row`}>
      <AlertTriangle className={`inline-block w-5 h-5 mr-2 ${error ? "text-red-500" : "text-green-500"}`} />
      <p className={`${error ? "text-red-500" : "text-green-500"} text-sm text-center`}>{message}</p>
    </div>
  )
}