import React, { useState, useEffect, useRef, MutableRefObject } from 'react'
import Input from './Input'
import {
    SelectProps,
    OptionSelectorButton,
    Options,
    OptionsContainer,
} from './Select'
import logger from '../../../logic/Logger/logger'

interface SelectSearchProps extends SelectProps {
    errMessage?: string
    searhValue: string
    setSearhValue: React.Dispatch<React.SetStateAction<string>>
}

export default function SelectSearch({
    inputName,
    label,
    onOpenChange,
    onSelected,
    onFocus,
    options = [],
    openUp = false,
    refCallback,
    errMessage,
    onChange,
    useStrongErrColor,
    searhValue,
    setSearhValue,

    ...rest

    //controlled = false,
}: SelectSearchProps) {
    const [open, setOpen] = useState(false)

    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null)

    const inpRef: React.MutableRefObject<HTMLInputElement | null> | undefined =
        useRef(null)

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
        setOpen(false)
        setSearhValue(selectValue)
        if (onSelected) onSelected(selectValue)
        inpRef?.current?.blur()
    }

    function handleOnFocus(e) {
        setOpen(true)
        setSearhValue('')
        if (onFocus) onFocus(e)
        if (onSelected) onSelected('')
    }

    useEffect(() => {
        if (onOpenChange) onOpenChange(open)
    }, [open])

    return (
        <div
            ref={ref}
            className="relative space-y-1 text-left bg-inherit w-full"
        >
            <Input
                label={label}
                inputName={inputName}
                errMessage={errMessage}
                // {...(controlled ? { value: value } : { defaultValue: value })}
                value={searhValue}
                inputRef={inpRef}
                refCallback={refCallback}
                useStrongErrColor={useStrongErrColor}
                onChange={(e) => {
                    setSearhValue(e.target.value)
                    if (onChange) onChange(e)
                }}
                onFocus={handleOnFocus}
                icons={
                    <OptionSelectorButton
                        open={open}
                        setOpen={setOpen}
                        openUp={openUp}
                    />
                }
                {...rest}
            />

            <OptionsContainer open={open} openUp={openUp}>
                <Options
                    autoCompleted={true}
                    options={options}
                    value={searhValue}
                    setOpen={setOpen}
                    onSelected={handleOnSelected}
                />
            </OptionsContainer>
        </div>
    )
}
