import { useState } from "react";

interface DataGridProps<T> {
  data: T[];
  summary?: string;
  idPropertyName: string;
  sort?: [string, boolean][];
  sortChanged?: (newSort: [string, boolean][]) => void;
  enable?: boolean;
}

export function DataGrid<T>({
  data = [],
  summary,
  idPropertyName = "",
  enable = true,
  sort,
  sortChanged,
}: DataGridProps<T>) {
  const [selectedCells, setSelectedCells] = useState<[number, number][]>();
  const [cursorCell, setCursorCell] = useState<[number, number]>();

  function changeSort(event: React.MouseEvent<HTMLTableCellElement, MouseEvent>, property: string) {
    if (!sort) return;

    var newSort: [string, boolean][] = [];

    if (event.ctrlKey && sortedBy(property)) {
      sort.map((element) => {
        if (element[0] === property) newSort.push([element[0], !element[1]]);
        else newSort.push(element);
      });
    } else {
      newSort.push([property, true]);
    }
    if (sortChanged) sortChanged([[property, true]]);
  }

  function sortedBy(column: string): boolean {
    if (sort) return sort.filter((element) => element[0] === column).length > 0;
    else return false;
  }

  function sortedAscBy(column: string): boolean {
    if (sort) return sort.filter((element) => element[0] === column)[0][1];
    else return false;
  }

  function anyElement(): boolean {
    return data.length > 0;
  }

  function cellClicked(event: React.MouseEvent<HTMLTableCellElement, MouseEvent>, rowIndex: number, cellIndex: number) {
    console.log(selectedCells);
    if (selectedCells && event.ctrlKey) {
      if (cellIsSelected(rowIndex, cellIndex)) {
        const newSelectedCells = selectedCells.filter((cell) => !(cell[0] === rowIndex && cell[1] === cellIndex));
        console.log(newSelectedCells);
        setSelectedCells(newSelectedCells);
      } else setSelectedCells([...selectedCells, [rowIndex, cellIndex]]);
    } else setSelectedCells([[rowIndex, cellIndex]]);
    setCursorCell([rowIndex, cellIndex]);
  }

  function cellIsSelected(rowIndex: number, cellIndex: number): boolean {
    if (selectedCells) {
      return selectedCells.filter((cell) => cell[0] === rowIndex && cell[1] === cellIndex).length > 0;
    }
    return false;
  }

  return (
    <div className="rounded-3xl overflow-hidden bg-white border">
      <table className="w-full select-none ">
        <thead>
          <tr className="h-14 bg-white">
            {anyElement() ? (
              Object.entries(data[0] as any).map((property) => (
                <td
                  key={property[0]}
                  className={`max-w-[25rem] px-4 duration-200 hover:bg-gray-200 ${enable ? "cursor-pointer" : ""}`}
                  onClick={enable ? (e) => changeSort(e, property[0]) : () => {}}
                >
                  <div className="flex space-x-4 justify-center">
                    <span>{property[0]}</span>
                    <div className={`${sortedBy(property[0]) ? "h-5" : "h-0"} aspect-square duration-200`}>
                      {sortedBy(property[0]) && (
                        <svg
                          className={`fill-gray-300 ${sortedAscBy(property[0]) ? "-rotate-180" : ""} duration-200`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 50 50"
                        >
                          <path d="M23.5219 33.4231L11.6189 21.5171C11.4234 21.3226 11.2682 21.0915 11.1623 20.8369C11.0565 20.5823 11.002 20.3093 11.002 20.0336C11.002 19.7578 11.0565 19.4848 11.1623 19.2302C11.2682 18.9756 11.4234 18.7445 11.6189 18.5501L13.5969 16.5721C13.7913 16.3765 14.0225 16.2214 14.2771 16.1155C14.5317 16.0096 14.8047 15.9551 15.0804 15.9551C15.3562 15.9551 15.6292 16.0096 15.8838 16.1155C16.1384 16.2214 16.3695 16.3765 16.5639 16.5721L25.0049 25.0121L33.4429 16.5741C33.6373 16.3785 33.8685 16.2234 34.1231 16.1175C34.3777 16.0116 34.6507 15.9571 34.9264 15.9571C35.2022 15.9571 35.4752 16.0116 35.7298 16.1175C35.9844 16.2234 36.2155 16.3785 36.4099 16.5741L38.3879 18.5521C38.5835 18.7465 38.7386 18.9776 38.8445 19.2322C38.9504 19.4868 39.0049 19.7598 39.0049 20.0356C39.0049 20.3113 38.9504 20.5843 38.8445 20.8389C38.7386 21.0935 38.5835 21.3246 38.3879 21.5191L26.4879 33.4191C26.2944 33.6146 26.0641 33.7697 25.8102 33.8757C25.5563 33.9816 25.284 34.0361 25.0089 34.0361C24.7339 34.0361 24.4615 33.9816 24.2076 33.8757C23.9538 33.7697 23.7234 33.6146 23.5299 33.4191L23.5219 33.4231Z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </td>
              ))
            ) : (
              <td></td>
            )}
          </tr>
        </thead>
        <tbody>
          {anyElement() &&
            data.map((element, rowIndex) => (
              <tr
                key={(element as any)[idPropertyName]}
                className={`relative h-10 text-sm text-slate-700 border-b-[3px] border-gray-200 hover:border-gray-300 duration-200`}
              >
                {Object.entries(element as any).map((property, cellIndex) => (
                  <td
                    key={property[0]}
                    onClick={(e) => cellClicked(e, rowIndex, cellIndex)}
                    className={`${cellIsSelected(rowIndex, cellIndex) ? "bg-gray-100" : "hover:bg-gray-100"} relative max-w-[25rem] px-4`}
                  >
                    {property[1] as any}
                    {cursorCell && cursorCell[0] === rowIndex && cursorCell[1] === cellIndex && (
                      <div className="absolute top-0 left-0 h-full w-full border border-black"></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end h-16 w-full py-2 bg-white select-none">
        <span className="font-medium pr-8">{summary}</span>
      </div>
    </div>
  );
}
