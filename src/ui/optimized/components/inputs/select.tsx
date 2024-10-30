import React from "react";

import Overlay from "../overlay/overlay";
import ArrowDownIcon from "../icons/icons";
import TextInputBase from "../inputs/text_input_base";
import InputController from "../inputs/input_controller";
import { Modal } from "../layouts/modal";
import { SelectOptions } from "./select_options";
import { useSelect } from "../../hooks/use_select";

interface Props<T> extends React.InputHTMLAttributes<HTMLInputElement> {
  options: T[] | string[] | undefined;
  selectedOption?: string;
  displayKeys?: (keyof T)[];
  valueKey?: keyof T;
  description?: string;
  error?: string;
  disable?: boolean;
  isSubmited?: boolean;
  isLoading?: boolean;
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
  addClearButton = false,
  selectionChange,
  ...rest
}: Props<T>) {
  const { state: select, dispatch } = useSelect<T>(options, selectedOption, valueKey, displayKeys, selectionChange, isLoading)

  return (
    <div className={`${description ? 'pt-7 pb-3 translate-y-0.5' : ''} w-full`}>
      <div className="relative">
        <button
          type="button"
          disabled={disable}
          tabIndex={isLoading || disable ? -1 : undefined}
          className={`${isLoading || disable ? " pointer-events-none" : ""} h-12 w-full cursor-pointer outline-none`}
          ref={select.refs.selectContainer as React.RefObject<HTMLButtonElement>}
          onClick={() => { dispatch({ type: 'CLICKED' }) }}
          onFocus={() => dispatch({ type: 'FOCUS_IN' })}
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

      <Modal isVisible={select.state.optionsOpen} animation={'FadeIn'} background={''} onClickedOut={(e) => dispatch({ type: 'CLICKED_OUT', payload: e })}>
        <SelectOptions
          options={select.options.filtered}
          preSelectedOption={select.state.preSelectedOption}
          relativeContainer={select.refs.selectContainer?.current}
          onSelect={(option) => dispatch({ type: 'CHANGE_SELECTED_OPTION', payload: option })} />
      </Modal>
    </div>
  );
}
