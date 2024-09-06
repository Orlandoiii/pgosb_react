import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'

import TextInputBase from './text_input_base'
import InputController from './input_controller'
import SelectOptions from './select_options'
import ArrowDownIcon from '../icons/icons'
import {
    OverlayItem,
    OverlayModalConfig,
} from '../../../core/overlay/models/overlay_item'
import { modalService } from '../../../core/overlay/overlay_service'
import Overlay from '../../../core/overlay/overlay'

interface SelectWithSearchProps<T>
    extends React.InputHTMLAttributes<HTMLInputElement> {
    options: T[] | string[] | undefined
    selectedOption?: string
    displayKey?: keyof T
    valueKey?: keyof T
    description?: string
    error?: string
    disable?: boolean
    isSubmited?: boolean
    isLoading?: boolean
    controlled?: boolean
    addClearButton?: boolean
    selectionChange?: (option: string) => void
}

const optionsModalConfig = new OverlayModalConfig(
    'Modal',
    'black',
    'FadeIn',
    true
)

export function SelectWithSearch<T>({
    options,
    selectedOption = '',
    displayKey,
    valueKey,
    description = '',
    error = '',
    disable = false,
    isSubmited = false,
    isLoading = false,
    controlled = true,
    addClearButton = false,
    selectionChange,
    ...rest
}: SelectWithSearchProps<T>) {
    const [innerSelectedOption, setInnerSelectedOption] = useState('')
    const selectContainer = useRef<HTMLButtonElement>(null)
    const textInput = useRef<HTMLInputElement>(null)
    const [state, setState] = useState({
        isHover: false,
        isFocus: false,
        isEmpty: true,
        optionsOpen: false,
    })
    const [optionsModal, setOptionsModal] = useState<OverlayItem<any>>()
    const [closeOptions, setCloseOptions] = useState<() => void>()
    const [search, setSearch] = useState(selectedOption)

    const setFocus = useCallback((isFocused: boolean) => {
        setState((prevState) => ({ ...prevState, isFocus: isFocused }))
    }, [])

    const setHover = useCallback((isHovered: boolean) => {
        setState((prevState) => ({ ...prevState, isHover: isHovered }))
    }, [])

    const selectedOptionChangedHandler = useCallback(
        (option: string) => {
            if (options && options?.length > 0) {
                if (controlled) selectionChange!(option)
                else setInnerSelectedOption(option)
            }
            setFocus(false)
        },
        [selectionChange, setFocus]
    )

    const innerOptions = useMemo(
        options && options.length > 0
            ? () => options.map((option) => optionDisplay(option))
            : () => ['Sin datos'],
        [options, displayKey]
    )

    useEffect(() => {
        const { isFocus, optionsOpen } = state
        if (isFocus && !optionsOpen) {
            const { modal, closeModal } = modalService.pushModal(
                SelectOptions,
                {
                    options: innerOptions,
                    selectedOption,
                    onSelect: selectedOptionChangedHandler,
                    relativeContainer: selectContainer,
                },
                optionsModalConfig,
                () => {
                    setFocus(false)
                    setState((prevState) => ({
                        ...prevState,
                        optionsOpen: false,
                    }))
                }
            )
            console.log('modal', modal)

            textInput.current?.focus()
            setOptionsModal(modal)
            setCloseOptions(() => closeModal)
            setState((prevState) => ({ ...prevState, optionsOpen: true }))
        } else if (!isFocus && optionsOpen && closeOptions) {
            closeOptions()
            setState((prevState) => ({ ...prevState, optionsOpen: false }))
        }
    }, [state.isFocus, state.optionsOpen])

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            isEmpty:
                (controlled
                    ? selectedOption.length
                    : innerSelectedOption.length) === 0,
        }))
    }, [selectedOption, innerSelectedOption])

    useEffect(() => {
        if (isLoading || selectedOption == '') return
        if (
            (controlled &&
                innerOptions.filter((item) => item == selectedOption).length <
                    1) ||
            (!controlled &&
                innerOptions.filter((item) => item == innerSelectedOption)
                    .length < 1)
        ) {
            if (controlled && selectionChange) selectionChange('')
            else if (!controlled) setInnerSelectedOption('')
        }
    }, [innerOptions])

    const handleBlur = useCallback(() => {
        window.setTimeout(() => {
            setFocus(false)
            setSearch('')
        }, 75)
    }, [setFocus])

    function optionDisplay(option: string | T): string {
        if (typeof option === 'string') return option
        else return String(option[displayKey!])
    }

    function searchChangedHandler(text: string) {
        if (optionsModal) {
            const newOptions = innerOptions.filter((innerOption) =>
                innerOption.toLowerCase().includes(text.toLowerCase())
            )
            modalService.updateModal(optionsModal, {
                ...optionsModal.props,
                options: newOptions,
            })
        }
        setSearch(text)
    }

    return (
        <div
            className={`${description ? 'pt-7 pb-3 translate-y-0.5' : ''} w-full`}
        >
            <div className="relative">
                <button
                    type="button"
                    tabIndex={-1}
                    disabled={disable}
                    className={`${isLoading || disable ? ' pointer-events-none' : ''} h-11 w-full cursor-pointer outline-none`}
                    ref={selectContainer}
                    onClick={() => setFocus(true)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <TextInputBase
                        type={'Any' as any}
                        {...rest}
                        tabIndex={disable ? -1 : undefined}
                        ref={textInput}
                        disabled={disable}
                        value={
                            state.isFocus
                                ? search
                                : controlled
                                  ? selectedOption
                                  : innerSelectedOption
                        }
                        onFocus={() => setFocus(true)}
                        onBlur={handleBlur}
                        onChange={(e) =>
                            searchChangedHandler(e.currentTarget.value)
                        }
                        className="pointer-events-none"
                    />

                    <div className="top-0 left-0 absolute flex justify-end items-center pr-2.5 w-full h-full pointer-events-none">
                        <div
                            className={`${state.optionsOpen ? 'rotate-180' : ''} ${disable ? 'pointer-events-none' : 'pointer-events-auto'} inset-0 duration-200`}
                        >
                            <ArrowDownIcon />
                        </div>
                    </div>
                </button>

                <div className="top-0 left-0 absolute flex justify-end items-center pr-7 w-full h-full pointer-events-none">
                    {((controlled && selectedOption != '') ||
                        (!controlled && innerSelectedOption != '')) &&
                        addClearButton && (
                            <button
                                type="button"
                                onClick={() => selectedOptionChangedHandler('')}
                                className="flex justify-center items-center rounded-full w-7 h-7 font-semibold text-gray-400 text-xs hover:text-blue-500 duration-150 pointer-events-auto aspect-square"
                            >
                                ✕
                            </button>
                        )}
                </div>

                <InputController
                    description={description}
                    error={error}
                    disable={disable}
                    isEmpty={state.isEmpty}
                    isHover={state.isHover}
                    isFocus={state.isFocus}
                    isSubmited={isSubmited}
                />
                <Overlay
                    isVisible={isLoading}
                    type={'Loader'}
                    position={'Center-Right'}
                    background={'bg-black bg-opacity-10'}
                    className={'animate-pulse px-4 py-2'}
                ></Overlay>
            </div>
        </div>
    )
}
