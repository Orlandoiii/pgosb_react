import React from "react";

import TextInputBase from "./text_input_base";
import InputController from "./input_controller";
import ArrowDownIcon from "../icons/icons";
import { useSelect } from "../../hooks/use_select";
import Overlay from "../../../core/overlay/overlay";

interface SelectWithSearchProps<T> extends React.InputHTMLAttributes<HTMLInputElement> {
    options: T[] | string[] | undefined;
    selectedOption?: string;
    displayKeys?: (keyof T)[];
    valueKey?: keyof T;
    description?: string;
    error?: string;
    disable?: boolean;
    isSubmited?: boolean;
    isLoading?: boolean;
    controlled?: boolean;
    addClearButton?: boolean;
    clearAfterSelect?: boolean;
    allowNewValue?: boolean;
    selectionChange?: (option: string) => void;
}

export function SelectWithSearch<T>({
    options,
    selectedOption = "",
    displayKeys,
    valueKey,
    description = "",
    error = "",
    disable = false,
    isSubmited = false,
    isLoading = false,
    allowNewValue = false,
    controlled = true,
    addClearButton = false,
    clearAfterSelect = false,
    selectionChange,
    ...rest
}: SelectWithSearchProps<T>) {
    const { state: select, dispatch } = useSelect<T>(options, selectedOption, valueKey, displayKeys, selectionChange, isLoading, allowNewValue, clearAfterSelect)

    console.log("state option", selectedOption,select.state.innerSelectedOption);
    
    return (
        <div className={`${description ? 'pt-7 pb-3 translate-y-0.5' : ''} w-full`} >

            <div className="relative">
                <button
                    type="button"
                    tabIndex={-1}
                    disabled={disable}
                    className={`pointer-events-none  w-full  outline-none`}
                    ref={select.refs.selectContainer as React.RefObject<HTMLButtonElement>}
                >
                    <TextInputBase
                        type={"Any" as any}
                        {...rest}
                        ref={select.refs.input}
                        disabled={disable}
                        value={
                            isLoading
                                ? ""
                                : select.state.isFocus && select.state.optionsOpen
                                    ? select.state.search
                                    : select.state.innerSelectedOption.display
                        }
                        onClick={(e) => {
                            dispatch({ type: 'FOCUS_IN_OR_CLICKED' })
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onFocus={() => {
                            if (!select.state.isFocus) {
                                dispatch({ type: 'FOCUS_IN_OR_CLICKED' })
                            }
                        }}
                        onChange={(e) => dispatch({ type: 'CHANGE_SEARCH', payload: e.currentTarget.value })}
                        onKeyDown={(e) => dispatch({ type: 'KEY_DOWN', payload: e })}
                        onBlur={() => dispatch({ type: 'FOCUS_OUT' })}
                        onMouseEnter={() => dispatch({ type: 'HOVER_IN' })}
                        onMouseLeave={() => dispatch({ type: 'HOVER_OUT' })}
                        className={`pointer-events-auto`}
                    />
                    <div className="top-0 left-0 absolute flex justify-end items-center space-x-1 pr-2 w-full h-full pointer-events-none">
                        <div
                            className={`${select.state.optionsOpen ? "rotate-180" : ""} inset-0 duration-200`}
                        >
                            <ArrowDownIcon />
                        </div>
                    </div>
                </button>

                <div className="top-0 left-0 absolute flex justify-end items-center pr-7 w-full h-full pointer-events-none">
                    {select.state.innerSelectedOption.value != "" && addClearButton && !isLoading && (
                        <button
                            tabIndex={-1}
                            onClick={(e) => {
                                dispatch({ type: 'CLEAR_CLICKED' })
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            className="flex justify-center items-center hover:bg-slate-200 rounded-full w-6 h-6 font-semibold text-gray-400 text-xs hover:text-red-500 duration-150 pointer-events-auto aspect-square"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <InputController
                    description={description}
                    error={error}
                    disable={disable}
                    isEmpty={select.state.isEmpty || isLoading}
                    isHover={select.state.isHover}
                    isFocus={select.state.isFocus}
                    isSubmited={isSubmited}
                />
                <Overlay
                    isVisible={isLoading}
                    type={"Loader"}
                    position={"Center-Right"}
                    background={"bg-black bg-opacity-10"}
                    className={"animate-pulse px-6 py-2"}
                ></Overlay>
            </div>
        </div>
    );
}
