export default function ModalConfirmDeleteTransaction({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {

  return (
    <div>
      <div className="fixed inset-0 bg-gray-200/50 flex items-center justify-center dark:bg-gray-900/70">
        <div className="bg-white p-6 rounded-md shadow-md dark:bg-gray-800">
          <p className="text-lg font-bold mb-4 dark:text-gray-100">Confirmação de exclusão</p>
          <p className="mb-4 dark:text-gray-300">Tem certeza de que deseja excluir esta transação?</p>
          <div className="flex justify-end">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md mr-2 hover:cursor-pointer hover:scale-105 duration-200 dark:hover:bg-red-700" onClick={() => onConfirm()}>Excluir</button>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:cursor-pointer hover:bg-gray-400 hover:scale-105 duration-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600" onClick={() => onCancel()}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}