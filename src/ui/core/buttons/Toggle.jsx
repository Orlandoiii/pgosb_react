import { useState } from "react"

function CheckIcon({ }) {
    return (

        <div className="w-5 h-5 p-1 bg-[whitesmoke] rounded-full">

            <svg fill="#0A2F4E" viewBox="0 0 12 12">
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z">
                </path>
            </svg>
        </div>
    )
}

function XIcon({ }) {
    return (
        <div className="w-5 h-5 p-1 bg-[whitesmoke] rounded-full">
            <svg fill="white" viewBox="0 0 12 12">
                <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                </path>
            </svg>
        </div>

    )
}



export default function Toggle({ active, setActive }) {
    return (
        <button type="button"
            className={`relative  w-[48px]  h-[25px]  ring-2   ${active ? "bg-[#0A2F4E] ring-offset-2 ring-[#0A2F4E]" :
                "bg-[#E5E7EB] ring-offset-1 ring-gray-400"}  flex px-1 py-1 rounded-full shadow-sm border-1 border-slate-400 
                transition-all ease-in-out duration-300`}
            onClick={() => { setActive(a => !a) }}
        >
            <span className={`absolute transition-position ease-in-out duration-300 
                              top-1/2 transform -translate-y-1/2 ${active ? "translate-x-full opacity-100" : "translate-x-0 opacity-0"}`}>
                <CheckIcon />
            </span>
            <span className={`absolute transition-position ease-in-out duration-300 right-1.5
                              top-1/2 transform -translate-y-1/2 ${active ? "opacity-0" : "-translate-x-full opacity-100"}`}>
                <XIcon />
            </span>
        </button>
    )
}