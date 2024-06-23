import { useState, useEffect, useRef } from 'react';
import Input from './Input';
import { OptionSelectorButton, Options, OptionsContainer } from './Selects';


export default function SelectWithSearch({
    label,
    inputName,
    value,
    type = 'text',
    options = [],
    onChange,
    onChangeRaw,
    useDotLabel = false,
    useStrongErrColor = false,
    onError,
    openUp = false,
    disabled = false
}) {
    const [open, setOpen] = useState(false)

    const ref = useRef(null) // Ref for the main Select div

    const inputRef = useRef(null)

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
        if (onChange)
            onChange(selectValue)
        inputRef.current?.blur();
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
        <div ref={ref} className="relative space-y-1 text-left bg-inherit w-full">

            <Input
                inputName={inputName}
                label={label}
                value={value}
                type={type}
                onClick={handleOnClick}
                onChangeEvent={handleOnChange}
                disabled={disabled}
                readOnly={false}
                controlled={true}
                onFocus={handleOnFocus}
                useDotLabel={useDotLabel}
                errMessage={errMessage}
                useStrongErrColor={useStrongErrColor}
                inputRef={inputRef}
                icons={<OptionSelectorButton open={open} setOpen={setOpen} openUp={openUp} />}
            />

            <OptionsContainer open={open} openUp={openUp} bottomSeparation='bottom-20'>
                <Options
                    options={options}
                    value={value}
                    setOpen={setOpen}
                    onSelected={handleOnSelected}
                    autoCompleted={true}
                />
            </OptionsContainer>


        </div>
    )
}
