/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import RelativeDrop, { RelativeDropProps } from "../layouts/relative_drop";
import { Virtualize } from "../layouts/virtualize";

export type SelectOption = {
  value: string;
  display: string;
}

interface SelectOptionsProps extends RelativeDropProps {
  options: SelectOption[];
  selectedOption: SelectOption;
  onSelect: (option: SelectOption) => void;
  ref: React.MutableRefObject<SelectOptionsMethods | undefined>;
}

export interface SelectOptionsMethods {
  keyDownHandler: (event: React.KeyboardEvent<any>) => void;
  filterOptions: (search: string, newOptions: SelectOption[]) => void
}

// eslint-disable-next-line react/display-name
const SelectOptionsInternal = forwardRef<SelectOptionsMethods, SelectOptionsProps>(
  ({ options, selectedOption, onSelect, ...rest }, ref) => {
    const [innerSelectedOption, setInnerSelectedOption] = useState<SelectOption>(setInitOption());

    const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([])
    const [search, setSearch] = useState("")

    const container = useRef<HTMLInputElement>();

    useImperativeHandle(ref, () => ({
      keyDownHandler,
      filterOptions
    }));

    useEffect(() => {
      if (options && options.length > 0) {
        const selected = options.filter(x => x == selectedOption)[0]
        setInnerSelectedOption(selected ? selected : options[0]);
      }
    }, [options]);

    function setInitOption(): SelectOption {
      const index = indexOfOption(selectedOption.value);

      if (index && index > -1) return options[index];
      else if (options && options.length > 0) return options[0];
      else return { value: "", display: "" };
    }

    function keyDownHandler(event: React.KeyboardEvent<any>) {
      if (event.altKey || event.ctrlKey || event.shiftKey) return;

      if (event.key.toLowerCase().includes("arrow")) {
        if (event.key.toLowerCase().includes("up")) actionFromKey("up");
        if (event.key.toLowerCase().includes("down")) actionFromKey("down");
      } else if (event.key.toLowerCase() == "enter") actionFromKey("enter");
    }

    function actionFromKey(key: "up" | "down" | "enter") {
      const currentIndex = indexOfOption(innerSelectedOption.value);
      let resultIndex = 0;

      if (currentIndex >= 0) {
        switch (key) {
          case "up":
            if (currentIndex > 0) resultIndex = currentIndex - 1;
            break;
          case "down":
            if (options && options.length > 0 && currentIndex < options.length - 1) resultIndex = currentIndex + 1;
            break;
          case "enter":
            onSelect(innerSelectedOption);
            return;
        }
      }

      setInnerSelectedOption(options[resultIndex]);
      scrollTo(resultIndex);
    }

    function scrollTo(id: number) {
      const item = container.current?.querySelector(`[data-id="${id}"]`);
      item?.scrollIntoView({ behavior: "auto", block: "nearest" });
    }

    function indexOfOption(option: string): number {
      const foundOption = options.filter((item) => item.value == option)[0];
      if (foundOption) return options.indexOf(foundOption);
      return -1;
    }

    function optionBackground(option: SelectOption): string {
      return option === innerSelectedOption ? "bg-slate-300" : "bg-slate-100 hover:bg-slate-200";
    }

    function filterOptions(search: string, newOptions: SelectOption[]) {
      setSearch(search)
      setFilteredOptions(newOptions)
      setInnerSelectedOption(newOptions[0])
    }

    return (
      <RelativeDrop {...rest} gap="overflow-y-auto max-h-64">
        <div ref={container as any} className="flex flex-col w-full h-fit bg-slate-100 ">
          {search == "" ?
            <Virtualize fatherRef={container}>
              {options.map((option, index) => (
                <div
                  data-id={index}
                  key={`${option.display}${option.value}`}
                  onClick={() => onSelect(option)}
                  className={`${optionBackground(option)} h-10 w-full cursor-pointer px-6 py-2`}
                >
                  {option.display}
                </div>
              ))}
            </Virtualize> :
            <Virtualize fatherRef={container}>
              {filteredOptions.map((option, index) => (
                <div
                  data-id={index}
                  key={`${option.display}${option.value}`}
                  onClick={() => onSelect(option)}
                  className={`${optionBackground(option)} h-10 w-full cursor-pointer px-6 py-2`}
                >
                  {option.display}
                </div>
              ))}
            </Virtualize>
          }
        </div>
      </RelativeDrop>
    );
  }
);

export default SelectOptions;

function SelectOptions(props: SelectOptionsProps) {
  return <SelectOptionsInternal {...props} ref={props.ref as ForwardedRef<SelectOptionsMethods>} />;
}
