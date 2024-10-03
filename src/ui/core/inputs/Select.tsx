import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    MutableRefObject,
    Dispatch,
    SetStateAction,
} from 'react'
import Input, { InputProps } from './Input'
import logger from '../../../logic/Logger/logger'

function OptionContainerButton({
    option,
    color = 'bg-slate-100 hover:bg-slate-200',
    onClick,
}) {
    function handleOnClick() {
        if (onClick) onClick(option?.toString())
    }

    return (
        <button
            type="button"
            role="option"
            className={`px-4 py-2 w-full h-full text-center 
          cursor-pointer ${color} text-neutral-600 `}
            onClick={handleOnClick}
        >
            {option}
        </button>
    )
}

interface OptionSelectorButtonProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    buttonRef?: MutableRefObject<SVGSVGElement> | undefined
    openUp: boolean
}

export function OptionSelectorButton({
    open,
    setOpen,
    buttonRef,
    openUp,
}: OptionSelectorButtonProps) {
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
                className={`${!open ? 'fill-gray-400' : ''} hover:fill-blue-400 w-4 ${openUp ? 'rotate-180' : ''}
          ${open ? `fill-blue-400  ${openUp ? 'rotate-0' : 'rotate-180'}  transition-transform duration-200 ease-in-out` : 'transition-transform duration-200 ease-in-out'}`}
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

interface OptionsProps {
    options: Array<string> | (() => Promise<string[]>)
    value?: string
    selectedOption?: string
    onSelected: (v: string) => void | undefined
    setOpen: Dispatch<SetStateAction<boolean>>
    autoCompleted?: boolean
}

export function Options({
    options,
    value = '',
    selectedOption = '',
    onSelected,
    setOpen,
    autoCompleted = false,
}: OptionsProps) {
    if (!options || !Array.isArray(options)) return <></>

    // const justOneMacht = useRef("");

    function handleOnClick(v) {
        if (onSelected) onSelected(v)
        //setOpen(false)
    }

    const OPTIONS = autoCompleted
        ? options?.filter(
              (o) =>
                  o
                      .toString()
                      .toLowerCase()
                      .indexOf(value?.toString().toLowerCase()) !== -1
          )
        : options

    // if (OPTIONS?.length === 1) {
    //     justOneMacht.current = OPTIONS[0];
    // } else {
    //     justOneMacht.current = "";
    // }

    // useEffect(() => {
    //     if (justOneMacht.current != "") {
    //         setOpen(false);
    //         onSelected(justOneMacht.current)
    //     }
    // }, [options, value])

    return useMemo(() => {
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
                      option={'NO APLICA'}
                      key={'not-found'}
                      onClick={() => {
                          if (onSelected) onSelected("N/A")
                          setOpen(false)
                      }}
                  />,
              ]
    }, [options, value])
}

export function OptionsContainer({
    open,
    openUp,
    bottomSeparation = 'bottom-12',
    children,
}) {
    return (
        <div
            id="options"
            className={`absolute w-full  ${openUp ? bottomSeparation : 'top-18'} z-10 border-[#3B82F6]  
            rounded-md overflow-auto transition-all duration-300  
            text-black translate-y-3",
            ${open ? 'max-h-52 border opacity-100' : 'max-h-0 border-0 opacity-0'}`}
        >
            {children}
        </div>
    )
}

export interface SelectProps extends InputProps {
    options: Array<string> | (() => Promise<string[]>)
    openUp?: boolean
    onOpenChange?: (openState: boolean) => void | undefined
    onSelected?: (selectedValue: string) => void | undefined
    onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined
    controlled?: boolean
}

export default function Select({
    inputName,
    label,
    onOpenChange,
    onSelected,
    onFocus,
    options = [],
    openUp = false,
    inputRef,
    refCallback,
    ...rest
    //controlled = false,
}: SelectProps) {
    logger.log('Renderizo new Select')

    const [open, setOpen] = useState(false)

    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null)

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
        if (onSelected && selectValue !== '') onSelected(selectValue)
    }

    function handleOnFocus(e) {
        setOpen(true)
        if (onFocus) onFocus(e)
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
                // {...(controlled ? { value: value } : { defaultValue: value })}
                // value={value}
                inputRef={inputRef}
                refCallback={refCallback}
                readOnly={true}
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
                    options={options}
                    // value={value}
                    setOpen={setOpen}
                    onSelected={handleOnSelected}
                />
            </OptionsContainer>
        </div>
    )
}
