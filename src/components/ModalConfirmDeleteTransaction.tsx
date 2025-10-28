import { useState } from "react";

export default function ModalConfirmDeleteTransaction({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {

  return (
    <div>
      <div className="fixed inset-0 bg-gray-200/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          <p className="text-lg font-bold mb-4">Confirmação de exclusão</p>
          <p className="mb-4">Tem certeza de que deseja excluir esta transação?</p>
          <div className="flex justify-end">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md mr-2 hover:cursor-pointer hover:scale-105 duration-200" onClick={() => onConfirm()}>Excluir</button>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:cursor-pointer hover:bg-gray-400 hover:scale-105 duration-200" onClick={() => onCancel()}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}