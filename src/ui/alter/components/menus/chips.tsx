interface ChipsProps<T> {
  options: T[];
  selectedOption: T;
  onSelectionChanged: (newSelectedOption: T) => void;
}

function Chips<T>({ options, selectedOption, onSelectionChanged }: ChipsProps<T>) {
  function chipStyle(option: T): string {
    if (option === selectedOption) return "text-white bg-primary hover:bg-primary-light";
    else return "text-gray-500 bg-gray-300 hover:text-gray-700 hover:bg-gray-400";
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-none items-center space-x-2 pb-2">
        {options.map((option) => {
          return (
            <button
              key={String(option)}
              onClick={(e) => {
                onSelectionChanged(option);
                e.preventDefault();
              }}
              className={`${chipStyle(option)} py-1.5 px-4 flex flex-none rounded-full shadow-md text-sm items-center justify-center duration-200`}
            >
              {String(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Chips;
