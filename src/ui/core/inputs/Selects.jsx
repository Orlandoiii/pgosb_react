import { useState, useMemo, useEffect, useRef } from 'react'
import Input from './Input'
import logger from '../../../logic/Logger/logger';


function OptionContainerButton({ option, onClick }) {
    function handleOnClick() {
        if (onClick) onClick(option?.toString())
    }

    return (
        <button
            type="button"
            role="option"
            className={`px-4 py-2 w-full h-full text-center 
          cursor-pointer bg-white text-neutral-600 hover:bg-neutral-300`}
            onClick={handleOnClick}
        >
            {option}
        </button>
    )
}

export function OptionSelectorButton({ open, setOpen, buttonRef, openUp }) {
    return (
        <button
            type="button"
            className="absolute top-1/2 right-0.5 transform -translate-y-1/2 w-5 h-5"
            onMouseDown={(e) => {
                e.stopPropagation()
                setOpen((o) => !o)
            }}>
            <svg
                ref={buttonRef}
                className={`${!open ? 'fill-gray-400' : ''} hover:fill-blue-400 w-4 ${openUp ? "rotate-180" : ""}
          ${open ? `fill-blue-400  ${openUp ? "rotate-0" : "rotate-180"}  transition-transform duration-200 ease-in-out` : 'transition-transform duration-200 ease-in-out'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 80 80"
            >
                <path
                    className="st0"
                    d="M61.33,37.48L43.72,55.09c-2.08,2.08-5.45,2.08-7.52,0l-3.46-3.46L18.58,37.48c-2-1.99-2-5.23,0-7.22l0,0
                 c1.99-1.99,5.23-1.99,7.22,0L39.96,44.4l14.15-14.15c2-1.99,5.23-1.99,7.22,0l0,0C63.33,32.25,63.33,35.48,61.33,37.48z"
                />
            </svg>
        </button>
    )
}

export function Options({
    options,
    value,
    onSelected,
    setOpen,
    autoCompleted = false,
}) {


    if (!options)
        return <></>

    if (!value)
        value = ""

    const justOneMacht = useRef("");

    useEffect(() => {
        if (justOneMacht.current != "") {
            setOpen(false);
            onSelected(justOneMacht.current)
        }
    }, [options, value])

    function handleOnClick(v) {
        if (onSelected) onSelected(v)
        setOpen(false)
    }


    return useMemo(() => {
        const OPTIONS = autoCompleted
            ? options?.filter(
                (o) =>
                    o
                        .toString()
                        .toLowerCase()
                        .indexOf(value?.toString().toLowerCase()) !== -1
            )
            : options;

        if (OPTIONS?.length === 1) {
            justOneMacht.current = OPTIONS[0];
        } else {
            justOneMacht.current = "";
        }

        return OPTIONS?.length > 0
            ? OPTIONS?.map((o, i) => (
                <OptionContainerButton
                    option={o}
                    key={i}
                    onClick={handleOnClick}

                />
            ))
            : [
                <OptionContainerButton
                    option={'Sin resultados'}
                    key={'not-found'}
                    onClick={() => {
                        if (onSelected) onSelected(options[0])
                        setOpen(false)
                    }}

                />,
            ]
    }, [options, value])
}

export function OptionsContainer({

    open,
    openUp,
    bottomSeparation = "bottom-12",
    children,
}) {
    return (
        <div
            id="options"
            className={`absolute w-full  ${openUp ? bottomSeparation : "top-18"} z-10 border-[#3B82F6]  
            rounded-md overflow-auto transition-all duration-300  
            text-black translate-y-3",
            ${open ? 'max-h-52 border' : 'max-h-0 border-0'}`}>
            {children}
        </div>
    )
}


export default function Select({
    inputName,
    label,
    useDotLabel = false,
    value,
    type = "text",

    onSelected,
    onFocus,
    onMouseDown,

    register,
    setValue,
    controlled = false,
    options = [],
    openUp = false

}) {

    logger.log("Renderizo new Select")

    const [open, setOpen] = useState(false)

    const ref = useRef(null) // Ref for the main Select div

    const inputRef = useRef(null)


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (open && ref?.current && !ref.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open, setOpen])


    function handleOnSelected(selectValue) {

        if (!controlled && register && selectValue !== '') {

            inputRef.current.value = selectValue;
            if (setValue)
                setValue(inputName, selectValue);
            return;
        }

        if (onSelected && selectValue !== '')
            onSelected(selectValue)

    }

    function handleOnFocus(e) {
        setOpen(true);
        if (onFocus)
            onFocus(e);
    }

    function handleOnClick(e) {
        e.stopPropagation()
        setOpen((o) => !o)
    }

    return (
        <div ref={ref} className="relative space-y-1 text-left bg-inherit w-full">

            <Input
                label={label}
                inputName={inputName}
                value={value}
                controlled={false}

                {...(register ? { register: register } : {})}
                turnOffAutoCompleted={true}
                type={type}
                onClick={handleOnClick}
                onMouseDown={onMouseDown}

                inputRef={inputRef}

                readOnly={true}
                onFocus={handleOnFocus}
                useDotLabel={useDotLabel}
                icons={<OptionSelectorButton open={open} setOpen={setOpen} openUp={openUp} />}
            />

            <OptionsContainer open={open} openUp={openUp}>
                <Options
                    options={options}
                    value={value}
                    setOpen={setOpen}
                    onSelected={handleOnSelected} />
            </OptionsContainer>
        </div>
    )
}

