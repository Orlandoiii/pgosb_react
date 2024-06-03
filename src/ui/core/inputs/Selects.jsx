import { useState, useMemo, useEffect, useRef } from 'react'
import Input from './Input'
import InputFloatLabel from './InputFloatLabel';
import { CommonLogic } from "./ShareLogic";

const common = new CommonLogic();

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

function OptionSelectorButton({ open, setOpen, buttonRef }) {
    return (
        <button
            type="button"
            className="absolute top-1/2 right-0.5 transform -translate-y-1/2 w-5 h-5"
            onMouseDown={(e) => {
                e.stopPropagation()
                setOpen((o) => !o)
            }}
        >
            <svg
                ref={buttonRef}
                className={`${!open ? 'fill-gray-400' : ''} hover:fill-blue-400 w-4 
          ${open ? 'fill-blue-400 rotate-180 transition-transform duration-200 ease-in-out' : 'transition-transform duration-200 ease-in-out'}`}
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

function Options({
    options,
    value,
    onSelected,
    setOpen,
    autoCompleted = false,
}) {


    function handleOnClick(v) {
        if (onSelected) onSelected(v)
        setOpen(false)
    }

    return useMemo(() => {
        const OPTIONS = autoCompleted
            ? options.filter(
                (o) =>
                    o
                        .toString()
                        .toLowerCase()
                        .indexOf(value.toString().toLowerCase()) !== -1
            )
            : options

        return OPTIONS.length > 0
            ? OPTIONS.map((o, i) => (
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

function OptionsContainer({
    options,
    value,
    open,
    setOpen,
    onSelected,
    autoCompleted,
}) {
    return (
        <div
            id="options"
            className={`absolute w-full top-15 z-10 border-[#3B82F6]  
            rounded-md overflow-auto transition-all duration-300  
            text-black translate-y-3",
            ${open ? 'max-h-52 border' : 'max-h-0 border-0'}`}
        >
            {
                <Options
                    options={options}
                    value={value}
                    setOpen={setOpen}
                    onSelected={onSelected}
                    autoCompleted={autoCompleted}
                />
            }
        </div>
    )
}

function SelectWithSearch({
    label,
    value,
    type = 'text',
    options = [],
    onChange,
    onChangeRaw,
    useDotLabel = false,
    useFloatingLabel = false,
    useStrongErrColor = false,
    onError
}) {
    const [open, setOpen] = useState(false)

    const ref = useRef(null) // Ref for the main Select div

    const isTouch = useRef(false)

    const [errMessage, setErrMessage] = useState("");

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


    useEffect(() => {
        console.log("aqui")
        if (isTouch.current && options.indexOf(value) === -1) {
            setErrMessage("Debe eligir una opcion valida");
            if (onError)
                onError(true);
            return;
        }
        if (onError)
            onError(false);
        setErrMessage("");

    }, [errMessage, setErrMessage, value])

    function handleOnChange(e) {
        isTouch.current = true;
        if (onChange) onChange(e.target.value)
        if (onChangeRaw) onChangeRaw(e)
    }

    function handleOnSelected(selectValue) {
        if (onChange) onChange(selectValue)
    }

    function handleOnFocus(e) {
        isTouch.current = true;
        setOpen(true)
        if (onChange) onChange('')
    }

    function handleOnClick(e) {

        e.stopPropagation()
        setOpen((o) => !o)
    }

    return (
        <div ref={ref} className="relative space-y-1 text-left bg-inherit">
            {useFloatingLabel ? <InputFloatLabel
                label={label}
                value={value}
                type={type}
                onClick={handleOnClick}
                onChangeEvent={handleOnChange}
                readOnly={false}
                onFocus={handleOnFocus}
                errMessage={errMessage}
                useStrongErrColor={useStrongErrColor}
                icons={<OptionSelectorButton open={open} setOpen={setOpen} />}
            /> :
                <Input
                    label={label}
                    value={value}
                    type={type}
                    onClick={handleOnClick}
                    onChangeEvent={handleOnChange}
                    readOnly={false}
                    onFocus={handleOnFocus}
                    useDotLabel={useDotLabel}
                    errMessage={errMessage}
                    useStrongErrColor={useStrongErrColor}
                    icons={<OptionSelectorButton open={open} setOpen={setOpen} />}
                />
            }

            <OptionsContainer
                open={open}
                setOpen={setOpen}
                options={options}
                value={value}
                onSelected={handleOnSelected}
                autoCompleted={true}
            />
        </div>
    )
}

function Select({
    label,
    value,
    type = 'text',
    options = [],
    onChange,
    onChangeRaw,
    useDotLabel = false,
    useFloatingLabel = false,

}) {
    const [open, setOpen] = useState(false)

    const ref = useRef(null) // Ref for the main Select div

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

    function handleOnChange(e) {
        if (onChange) onChange(e.target.value)
        if (onChangeRaw) onChangeRaw(e)
    }

    function handleOnSelected(selectValue) {
        if (onChange && selectValue !== '') onChange(selectValue)
    }

    function handleOnFocus(e) {
        setOpen(true)
    }

    function handleOnClick(e) {
        e.stopPropagation()
        setOpen((o) => !o)
    }

    return (
        <div ref={ref} className="relative space-y-1 text-left bg-inherit">
            {useFloatingLabel ? <InputFloatLabel
                label={label}
                value={value}
                type={type}
                onClick={handleOnClick}
                onChangeEvent={handleOnChange}
                readOnly={true}
                onFocus={handleOnFocus}
                icons={<OptionSelectorButton open={open} setOpen={setOpen} />}
            /> :
                <Input
                    label={label}
                    value={value}
                    type={type}
                    onClick={handleOnClick}
                    onChangeEvent={handleOnChange}
                    readOnly={true}
                    onFocus={handleOnFocus}
                    useDotLabel={useDotLabel}
                    icons={<OptionSelectorButton open={open} setOpen={setOpen} />}
                />
            }
            <OptionsContainer
                open={open}
                setOpen={setOpen}
                options={options}
                value={value}
                onSelected={handleOnSelected}
                autoCompleted={false}
            />
        </div>
    )
}

export { Select, SelectWithSearch }
