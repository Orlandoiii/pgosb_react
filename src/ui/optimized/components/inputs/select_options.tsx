import React, { useEffect, useRef } from "react";

import RelativeDrop, { RelativeDropProps } from "../layouts/relative_drop";
import { Virtualize } from "../layouts/virtualize";

export type SelectOption = {
  value: string;
  display: string;
}

interface Props extends RelativeDropProps {
  options: SelectOption[];
  preSelectedOption: SelectOption;
  onSelect: (option: SelectOption) => void;
}
export function SelectOptions({ options, preSelectedOption, onSelect, ...rest }: Props) {
  const container = useRef<HTMLInputElement>();

  useEffect(() => {
    const index = indexOfOption(preSelectedOption)
    setTimeout(() => scrollTo(index), 0)
  }, [preSelectedOption])

  useEffect(() => {
    const index = indexOfOption(preSelectedOption)
    if (index == -1) return

    setTimeout(() => {
      const itemHeight = container.current?.querySelector(`[data-id="0"]`)?.clientHeight ?? 0;
      container.current?.parentElement?.scrollTo({ top: itemHeight * (index + 1) })
      setTimeout(() => scrollTo(index), 10)
    }, 0)
  }, [])


  function indexOfOption(option: SelectOption): number {
    const foundOption = options.filter((item) => item.value == option.value && item.display == option.display)[0];
    if (foundOption) return options.indexOf(foundOption);
    return -1;
  }

  function scrollTo(id: number) {
    const item = container.current?.querySelector(`[data-id="${id}"]`);
    item?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }

  function optionBackground(option: SelectOption): string {
    return option === preSelectedOption ? "bg-slate-300" : "bg-slate-100 hover:bg-slate-200";
  }

  return (
    <RelativeDrop {...rest} gap="overflow-y-auto max-h-64">
      <div ref={container as any} className="flex flex-col w-full h-fit bg-slate-100 ">
        <Virtualize fatherRef={container}>
          {options.map((option, index) => (
            <div
              data-id={index}
              key={`${option.display}${option.value}`}
              onClick={() => onSelect(option)}
              className={`${optionBackground(option)} h-10 w-full text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer px-6 py-2`}
            >
              {option.display}
            </div>
          ))}
        </Virtualize>
      </div>
    </RelativeDrop>
  );
};
