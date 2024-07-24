import React, { MouseEventHandler, PropsWithChildren } from "react"


const defaultBgColors = {
    Primary: 'bg-[#0A2F4E]',
    Secondary: 'bg-[#2286DD]',
    Success: 'bg-[#28A745]',
    Danger: 'bg-[#DC3545]',
    Warning: 'bg-[#6C757D]',
}

interface ButtonProps {
    colorType?: string,
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined
    hoverColor?: string,
    width?: string,
    height?: string
}

export default function Button({
    children,
    colorType = defaultBgColors.Primary,
    onClick,
    hoverColor = "hover:bg-[#0069D9]",
    width = "",
    height = ""
}: PropsWithChildren<ButtonProps>) {

    return (
        <button
            className={`block ${height}  ${width} px-3 py-2 ${colorType} text-white 
            text-md rounded-md shadow-md ${hoverColor} `}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
