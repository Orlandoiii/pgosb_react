const defaultBgColors = {
    Primary: 'bg-[#0A2F4E]',
    Secondary: 'bg-[#2286DD]',
    Success: 'bg-[#28A745]',
    Danger: 'bg-[#DC3545]',
    Warning: 'bg-[#6C757D]',
}

export default function Button({
    children,
    colorType = defaultBgColors.Primary,
    onClickRaw,
    onClick,
    hoverColor = "hover:bg-[#0069D9]",
    width = ""
}) {
    function handleOnClick(e) {
        if (onClickRaw) onClickRaw(e)

        if (onClick) onClick()
    }

    return (
        <button
            className={` block px-3 py-2 ${colorType} text-white ${width} 
            text-md rounded-md shadow-md ${hoverColor}`}
            onClick={handleOnClick}
        >
            {children}
        </button>
    )
}
