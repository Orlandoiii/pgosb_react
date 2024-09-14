import React from "react";

interface ChipsProps<T> {
  options: T[];
  direction?: 'Vertical' | 'Horizontal';
  selectedOption: T;
  onSelectionChanged: (newSelectedOption: T) => void;
}

function Chips<T>({ options, direction = 'Horizontal', selectedOption, onSelectionChanged }: ChipsProps<T>) {
  function horizontalChipStyle(option: T): string {
    if (option === selectedOption) return "text-white bg-primary hover:bg-primary-light";
    else return "text-gray-500 bg-gray-300 hover:text-gray-700 hover:bg-gray-400";
  }

  function verticalChipStyle(option: T): string {
    if (option === selectedOption) return "border-[#0A2F4E]";
    else return "border-slate-400 border-opacity-50 hover:border-opacity-100 duration-200";
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className={`flex flex-none items-center ${direction === 'Vertical' ? "flex-col space-y-4" : "space-x-2"}  pb-2`}>
        {options.map((option) =>
        (
          <>
            {direction === 'Vertical' && <button
              key={String(option)}
              onClick={(e) => {
                onSelectionChanged(option);
                e.preventDefault();
              }}
              className={`${verticalChipStyle(option)} flex flex-none h-10 w-full items-center justify-center text-slate-700 rounded-lg border-b-4 bg-white font-semibold`}>
              {String(option)}
            </button>}
            {direction === 'Horizontal' && <button
              key={String(option)}
              onClick={(e) => {
                onSelectionChanged(option);
                e.preventDefault();
              }}
              className={`${horizontalChipStyle(option)} py-1.5 px-4 flex flex-none rounded-full shadow-md text-sm items-center justify-center duration-200`}
            >
              {String(option)}
            </button>}
          </>
        )
        )}
      </div>
    </div>
  );
}

export default Chips;
