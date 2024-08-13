interface ToggleProps {
  height?: string;
  width?: string;
  toggle: boolean;
  option1?: string;
  option2?: string;
  toggleChanged: (toggled: boolean) => void;
}

function Toggle({ height = "h-10", width = "w-32", toggle, option1, option2, toggleChanged }: ToggleProps) {
  return (
    <div
      className={`group relative flex-none ${height} ${width} overflow-hidden rounded-full border-[3px] border-white ${toggle ? "bg-primary hover:bg-primary-light" : "bg-gray-300 hover:bg-gray-400"} cursor-pointer duration-200`}
      onClick={() => toggleChanged(!toggle)}
    >
      <div
        className={`absolute top-0 left-0 flex h-full w-full items-center justify-center text-white duration-200 ${toggle ? "translate-x-0" : "-translate-x-full"}`}
      >
        <span className="ml-2 text-lg font-semibold">{option1}</span>
        <div className="aspect-square h-full"></div>
      </div>

      <div
        className={`absolute top-0 left-0 flex h-full w-full items-center justify-center text-white duration-200 ${toggle ? "translate-x-full" : "translate-x-0"}`}
      >
        <div className="aspect-square h-full"></div>
        <span className="mr-2 text-lg font-semibold">{option2}</span>
      </div>

      <div className="flex h-full w-full">
        <div className={`h-full w-full p-1.5 duration-200 ${toggle ? "translate-x-full" : "translate-x-0"}`}>
          <div className="aspect-square h-full rounded-full bg-white"></div>
        </div>
        <div className="aspect-square h-full p-1" />
      </div>
    </div>
  );
}

export default Toggle;
