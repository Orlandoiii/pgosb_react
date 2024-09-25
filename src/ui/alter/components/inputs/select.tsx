import React from "react";

import TextInputBase from "./text_input_base";
import InputController from "./input_controller";
import ArrowDownIcon from "../icons/icons";
import { useSelect } from "../../hooks/use_select";
import Overlay from "../../../core/overlay/overlay";

interface SelectProps<T> extends React.InputHTMLAttributes<HTMLInputElement> {
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
  selectionChange?: (option: string) => void;
}

export function Select<T>({
  options,
  selectedOption = "",
  displayKeys,
  valueKey,
  description = "",
  error = "",
  disable = false,
  isSubmited = false,
  isLoading = false,
  controlled = true,
  addClearButton = false,
  selectionChange,
  ...rest
}: SelectProps<T>) {
  const { state: select, dispatch } = useSelect<T>(options, selectedOption, valueKey, displayKeys, selectionChange, isLoading)

  return (
    <div className="relative">
      <button
        disabled={disable}
        tabIndex={isLoading || disable ? -1 : undefined}
        className={`${isLoading || disable ? " pointer-events-none" : ""} h-12 w-full cursor-pointer outline-none`}
        ref={select.refs.selectContainer as React.RefObject<HTMLButtonElement>}
        onClick={(e) => {
          dispatch({ type: 'FOCUS_IN_OR_CLICKED' })
          e.stopPropagation()
          e.preventDefault()
        }}
        onFocus={() => dispatch({ type: 'FOCUS_IN_OR_CLICKED' })}
        onBlur={() => dispatch({ type: 'FOCUS_OUT' })}
        onKeyDown={(e) => dispatch({ type: 'KEY_DOWN', payload: e })}
        onMouseEnter={() => dispatch({ type: 'HOVER_IN' })}
        onMouseLeave={() => dispatch({ type: 'HOVER_OUT' })}
      >
        <TextInputBase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type={"Any" as any}
          {...rest}
          tabIndex={-1}
          disabled={disable}
          value={isLoading ? "" : select.state.innerSelectedOption.display}
          className="pointer-events-none"
        />

        <div className="absolute h-full w-full flex items-center justify-end top-0 left-0 pointer-events-none pr-2 space-x-1">
          <div className={`${select.state.optionsOpen ? "rotate-180" : ""} inset-0 pointer-events-auto duration-200`}>
            <ArrowDownIcon />
          </div>
        </div>
      </button>

      <div className="absolute h-full w-full flex items-center justify-end top-0 left-0 pointer-events-none pr-7">
        {(select.state.innerSelectedOption.value != "") && addClearButton && !isLoading && (
          <button
            tabIndex={-1}
            onClick={() => dispatch({ type: 'CLEAR_CLICKED' })}
            className="h-6 w-6 duration-150 aspect-square hover:bg-slate-200 hover:text-red-500 rounded-full text-gray-400 flex items-center justify-center text-xs font-semibold pointer-events-auto"
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
    </div >
  );
}
