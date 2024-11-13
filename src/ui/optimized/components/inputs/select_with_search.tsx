import React from "react";

import Overlay from "../overlay/overlay";
import ArrowDownIcon from "../icons/icons";
import InputController from "../inputs/input_controller";
import TextInputBase from "../inputs/text_input_base";
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
  addClearButton = false,
  selectionChange,
  ...rest
}: Props<T>) {
  const { state: select, dispatch } = useSelect<T>(options, selectedOption, valueKey, displayKeys, selectionChange, isLoading, allowNewValue)
  if (description == 'Marca') console.log('yep', options);
  if (description == 'Vehiculo de Traslado') console.log(select.options, select.state.innerSelectedOption, select.state.preSelectedOption, selectedOption);

  return (
    <div className={`${description ? 'pt-7 pb-3 translate-y-0.5' : ''} w-full`} >
      <div className="relative">
        <button
          type="button"
          tabIndex={-1}
          disabled={disable}
          className={`pointer-events-none  h-12 w-full  outline-none`}
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
            onClick={() => { dispatch({ type: 'CLICKED' }) }}
            onFocus={() => { dispatch({ type: 'FOCUS_IN' }) }}
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
              onClick={() => dispatch({ type: 'CLEAR_CLICKED' })}
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
