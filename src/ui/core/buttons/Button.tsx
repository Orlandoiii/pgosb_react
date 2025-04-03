import React, { MouseEventHandler, PropsWithChildren } from 'react'

const defaultBgColors = {
    Primary: 'bg-btc_primary',
    Secondary: 'bg-[#2286DD]',
    Success: 'bg-[#28A745]',
    Danger: 'bg-[#DC3545]',
    Warning: 'bg-[#6C757D]',
}

interface ButtonProps {
    colorType?: string
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined
    hoverColor?: string
    width?: string
    height?: string
    enable?: boolean
}

export default function Button({
    children,
    colorType = defaultBgColors.Primary,
    onClick,
    hoverColor = 'hover:bg-btc_secondary',
    width = '',
    height = '',
    enable = true,
}: PropsWithChildren<ButtonProps>) {
    console.log('enable', enable)

    return (
        <button
            disabled={!enable}
            className={`block ${height} ${width} px-3 py-2 ${enable ? colorType : 'bg-slate-500'} text-white 
    text-xl rounded-md shadow-md text-nowrap font-semibold ${enable ? hoverColor : 'hover:bg-slate-500 pointer-events-none '} `}
            onClick={(e) => {
                if (!enable) return
                onClick && onClick(e)
            }}
        >
            {children}
        </button>
    )
}
