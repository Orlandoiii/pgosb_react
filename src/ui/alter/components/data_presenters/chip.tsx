import React from 'react'

interface ChipProps {
    text: string
    onDelete: (text: string) => void
}

function chip({ text, onDelete }: ChipProps) {
    return (
        <div className="py-2 px-4 rounded-full space-x-2 bg-[#0A2F4E]">
            {text}
            <button
                onClick={() => onDelete(text)}
                className="h-full aspect-square rounded-full bg-white hover:bg-opacity-40 bg-opacity-0 flex items-center justify-center"
            >
                ✖
            </button>
        </div>
    )
}

export default chip
