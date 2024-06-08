export default function SearchButton({ }) {
    return (
        <form className="pl-6 flex justify-center items-center border border-slate-200 rounded-full space-x-1 shadow-sm ">
            <button className="w-[42px] h-[42px] p-0.5 rounded-l-full flex justify-center items-center bg-[#F5F5F5]">
                <svg className="w-[25px] h-[25px] fill-slate-400 hover:fill-[#3C50E0]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z" fill="">
                    </path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z" fill="">
                    </path>
                </svg>
            </button>
            <div className="h-[42px] w-full ">
                <input type="text" className="bg-[#F5F5F5] text-sm h-full w-full 
                 outline-none rounded-r-full" placeholder="Escribe para buscar" />
            </div>
        </form>
    )
}