import React from "react";

interface InputControllerProps {
    description?: string;
    error?: string;
    disable?: boolean;
    isEmpty?: boolean;
    isHover?: boolean;
    isFocus?: boolean;
    isSubmited?: boolean;
}

function InputController({
    description = "",
    error = "",
    disable = false,
    isEmpty = true,
    isHover = false,
    isFocus = false,
    isSubmited = false,
}: InputControllerProps) {
    const descriptionPosition =
        true || !isEmpty || isFocus ? '-translate-y-7' : ''

    const borderColor = disable
        ? 'text-slate-400'
        : isSubmited && error
            ? 'border-red-500'
            : isHover || isFocus
                ? 'border-blue-500'
                : 'border-gray-300'
    const borderVisibility =
        true || error || isHover || isFocus ? 'opacity-100' : 'opacity-0'

    const errorTextColor = isSubmited ? 'text-red-500' : 'text-slate-400'

    return (
        <>
            {description && (
                <span
                    className={`${descriptionPosition} z-10  pointer-events-none absolute left-0 top-0 flex w-auto select-none items-center text-[0.9rem] duration-150 whitespace-nowrap`}
                >
                    {description}:
                </span>
            )}

            <div
                className={`${borderVisibility} z-10 ${borderColor} pointer-events-none absolute left-0 top-0 h-full w-full rounded-md border-2 duration-150`}
            />
            <span
                role="alert"
                className={`${errorTextColor} z-10 pointer-events-none absolute top-0 ml-8 flex h-full w-auto origin-left -translate-x-8 translate-y-8 scale-75 select-none items-center whitespace-nowrap px-4 font-semibold duration-150`}
            >
                {error}
            </span>
        </>
    )
}

export default InputController;
