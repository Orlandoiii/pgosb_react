import React from "react";

import RelativeDrop, { RelativeDropProps } from "../layouts/relative_drop";

interface SelectOptionsProps extends RelativeDropProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

function SelectOptions({ options, selectedOption, onSelect, ...rest }: SelectOptionsProps) {
  function optionBackground(option: string): string {
    return option === selectedOption ? "bg-slate-300" : "bg-slate-100 hover:bg-slate-200";
  }

  console.log(options);
  return (
    <RelativeDrop {...rest}>
      <div className="w-full h-fit max-h-64 flex flex-col overflow-y-auto">
        {options.map((option) => (
          <div key={option} onClick={() => onSelect(option)} className={`${optionBackground(option)} w-full px-6 py-2`}>
            {option}
          </div>
        ))}
      </div>
    </RelativeDrop>
  );
}

export default SelectOptions;
