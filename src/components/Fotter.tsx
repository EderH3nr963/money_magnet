export default function Footer() {
  return (
    <footer className="w-full bg-[#1f2937] text-white px-10 py-5 flex flex-row mt-auto items-center">
      <div className="w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-6 mx-4 my-4">
            <a href="#" className="text-[#d1d5db] text-sm duration-200 hover:text-white">Termos de Serviço</a>
            <a href="#" className="text-[#d1d5db] text-sm duration-200 hover:text-white">Política de Privacidade</a>
            <a href="#" className="text-[#d1d5db] text-sm duration-200 hover:text-white">Contato</a>
            <a href="#" className="text-[#d1d5db] text-sm duration-200 hover:text-white">Ajuda</a>
          </div>
          <p className="text-[#9ca3af] text-[0.75rem] mt-4">© 2023 MoneyMagnet Dashboard. Todos os direitos reservados.</p> 

        </div>
      </div>
    </footer>
  )
}