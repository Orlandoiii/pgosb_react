const defaultBgColors = {
    Primary: 'bg-[#007BFF]',
    Secondary: 'bg-[#6C757D]',
    Success: 'bg-[#28A745]',
    Danger: 'bg-[#DC3545]',
    Warning: 'bg-[#6C757D]',
}

export default function Button({
    children,
    colorType = defaultBgColors.Primary,
    onClickRaw,
    onClick,
}) {
    function handleOnClick(e) {
        if (onClickRaw) onClickRaw(e)

        if (onClick) onClick()
    }

    return (
        <button
            className={`block px-3 py-2 border-2  bg-[#3C50E0] text-white  
            text-md rounded-md shadow hover:bg-[#0069D9]`}
            onClick={handleOnClick}
        >
            {children}
        </button>
    )
}
