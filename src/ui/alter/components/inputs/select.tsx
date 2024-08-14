import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import TextInputBase from "./text_input_base";
import InputController from "./input_controller";
import SelectOptions from "./select_options";
import ArrowDownIcon from "../icons/icons";
import { modalService } from "../../../core/overlay/overlay_service";
import { OverlayModalConfig } from "../../../core/overlay/models/overlay_item";
import Overlay from "../../../core/overlay/overlay";

interface SelectProps<T> extends React.InputHTMLAttributes<HTMLInputElement> {
  options: T[] | string[] | undefined;
  selectedOption?: string;
  displayKey?: keyof T;
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

const optionsModalConfig = new OverlayModalConfig("Modal", "", "FadeIn", true);

export function Select<T>({
  options,
  selectedOption = "",
  displayKey,
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
  const [innerSelectedOption, setInnerSelectedOption] = useState("");
  const selectContainer = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState({
    isHover: false,
    isFocus: false,
    isEmpty: true,
    optionsOpen: false,
  });
  const [closeOptions, setCloseOptions] = useState<() => void>();

  const setFocus = useCallback((isFocused: boolean) => {
    setState((prevState) => ({ ...prevState, isFocus: isFocused }));
  }, []);

  const setHover = useCallback((isHovered: boolean) => {
    setState((prevState) => ({ ...prevState, isHover: isHovered }));
  }, []);

  const selectedOptionChangedHandler = useCallback(
    (option: string) => {
      if (options && options?.length > 0) {
        if (controlled) selectionChange!(option);
        else setInnerSelectedOption(option);
      }
      setFocus(false);
    },
    [selectionChange, setFocus]
  );

  const innerOptions = useMemo(
    options && options.length > 0 ? () => options.map((option) => optionDisplay(option)) : () => ["Sin datos"],
    [options, displayKey]
  );

  useEffect(() => {
    const { isFocus, optionsOpen } = state;
    if (isFocus && !optionsOpen) {
      const { closeModal } = modalService.pushModal(
        SelectOptions,
        {
          options: innerOptions,
          selectedOption,
          onSelect: selectedOptionChangedHandler,
          relativeContainer: selectContainer,
        },
        optionsModalConfig,
        () => {
          setFocus(false);
          setState((prevState) => ({ ...prevState, optionsOpen: false }));
        }
      );
      setCloseOptions(() => closeModal);
      setState((prevState) => ({ ...prevState, optionsOpen: true }));
    } else if (!isFocus && optionsOpen && closeOptions) {
      closeOptions();
      setState((prevState) => ({ ...prevState, optionsOpen: false }));
    }
  }, [state.isFocus, state.optionsOpen]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isEmpty: (controlled ? selectedOption.length : innerSelectedOption.length) === 0,
    }));
  }, [selectedOption, innerSelectedOption]);

  useEffect(() => {
    if (isLoading || selectedOption == "") return;

    if (
      (controlled && innerOptions.filter((item) => item == selectedOption).length < 1) ||
      (!controlled && innerOptions.filter((item) => item == innerSelectedOption).length < 1)
    ) {
      if (controlled && selectionChange) selectionChange("");
      else if (!controlled) setInnerSelectedOption("");
    }
  }, [innerOptions]);

  function optionDisplay(option: string | T): string {
    if (typeof option === "string") return option;
    else return String(option[displayKey!]);
  }

  const handleBlur = useCallback(() => {
    window.setTimeout(() => {
      setFocus(false);
    }, 75);
  }, [setFocus]);

  return (
    <div className={`${description ? 'pt-7 pb-3 translate-y-0.5' : ''} w-full`}>
      <div className="relative">
        <button
          disabled={disable}
          tabIndex={isLoading || disable ? -1 : undefined}
          className={`${isLoading || disable ? " pointer-events-none" : ""} relative h-11 w-full cursor-pointer outline-none`}
          ref={selectContainer}
          onClick={() => setFocus(true)}
          onFocus={() => setFocus(true)}
          onBlur={handleBlur}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <TextInputBase
            type={"Any" as any}
            {...rest}
            tabIndex={-1}
            disabled={disable}
            value={controlled ? selectedOption : innerSelectedOption}
            className="pointer-events-none"
          />
          <div className="absolute h-full w-full flex items-center justify-end top-0 left-0 pointer-events-none pr-2.5">
            <div className={`${state.optionsOpen ? "rotate-180" : ""} inset-0 pointer-events-auto duration-200`}>
              <ArrowDownIcon />
            </div>
          </div>
        </button>

        <div className="absolute h-full w-full flex items-center justify-end top-0 left-0 pointer-events-none pr-7">
          {((controlled && selectedOption != "") || (!controlled && innerSelectedOption != "")) && addClearButton && (
            <button
              onClick={() => selectedOptionChangedHandler("")}
              className="h-7 w-7 duration-150 aspect-square hover:text-blue-500 rounded-full text-gray-400 flex items-center justify-center text-xs font-semibold pointer-events-auto"
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
          type={"Loader"}
          position={"Center-Right"}
          background={"bg-black bg-opacity-10"}
          className={"animate-pulse px-4 py-2"}
        ></Overlay>
      </div>
    </div>
  );
}
