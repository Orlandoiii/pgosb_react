import React from 'react'

interface ChipProps {
    text: string
    onDelete: (text: string) => void
}

function chip({ text, onDelete }: ChipProps) {
    return (
        <div className="flex justify-normal items-center bg-slate-200 pr-1 pl-4 rounded-full w-fit h-10 text-slate-600 text-sm">
            <span className="max-w-44 text-ellipsis whitespace-nowrap overflow-hidden">
                {text}
            </span>
            <div className="w-1"></div>
            <button
                onClick={(e) => {
                    onDelete(text)
                    e.preventDefault()
                    e.stopPropagation()
                }}
                className="flex flex-none justify-center items-center bg-white bg-opacity-0 hover:bg-opacity-40 rounded-full w-9 h-9"
            >
                ✖
            </button>
        </div>
    )
}

export default chip
