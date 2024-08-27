import React from 'react'

interface ToggleProps {
    height?: string
    width?: string
    toggle: boolean
    option1?: string
    option2?: string
    useActiveColors?: boolean
    toggleChanged: (toggled: boolean) => void
}

function Toggle({
    height = 'h-10',
    width = 'w-32',
    toggle,
    option1,
    option2,
    useActiveColors = true,
    toggleChanged,
}: ToggleProps) {
    return (
        <div
            className={`group relative flex-none ${height} ${width} overflow-hidden rounded-full border-[3px] border-white ${toggle || !useActiveColors ? 'bg-[#0A2F4E] hover:bg-opacity-75' : 'bg-gray-400 hover:bg-gray-300'} cursor-pointer duration-200`}
            onClick={() => toggleChanged(!toggle)}
        >
            <div
                className={`absolute top-0 left-0 flex h-full w-full items-center justify-center text-white duration-200 ${toggle ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <span className="ml-2 font-semibold">{option1}</span>
                <div className="h-full aspect-square"></div>
            </div>

            <div
                className={`absolute top-0 left-0 flex h-full w-full items-center justify-center text-white duration-200 ${toggle ? 'translate-x-full' : 'translate-x-0'}`}
            >
                <div className="h-full aspect-square"></div>
                <span className="mr-2 font-semibold">{option2}</span>
            </div>

            <div className="flex w-full h-full">
                <div
                    className={`h-full w-full p-1.5 duration-200 ${toggle ? 'translate-x-full' : 'translate-x-0'}`}
                >
                    <div className="bg-white rounded-full h-full aspect-square"></div>
                </div>
                <div className="p-1 h-full aspect-square" />
            </div>
        </div>
    )
}

export default Toggle
