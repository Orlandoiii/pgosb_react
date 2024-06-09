

export default function UserDataGrid({ data }) {

    return (
        <div className="w-fit">
            <table className="table-auto h-[calc(100%-36px)] w-full focus:outline-none whitespace-nowrap rounded-t-md overflow-hidden" tabIndex="0">
                <thead>
                    <tr>
                        {visibleColumns.map((column, index) => (
                            <th key={index} className="py-2 h-12 px-4">
                                {editable ? (
                                    <input
                                        type="text"
                                        className="bg-transparent h-8 w-full rounded-sm pt-2 outline-none 
                                        border-b-2 hover:bg-secondary-over"
                                        value={column.displayName}
                                        onChange={(e) => handleColumnNameChange(index, e.target.value)}
                                    />
                                ) : (
                                    <div className="h-8 w-full text-sm">{column.displayName}</div>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="h-10 bg-white border-b-2 border-gray-200 hover:border-gray-300">
                            {visibleColumns.map((column, colIndex) => (
                                <td key={colIndex} className={`relative text-left text-sm px-4 hover:bg-gray-100 select-none 
                                ${row.cells[column.name].cellStyle}`}>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end h-9 w-full py-2 bg-secondary-base rounded-b-md right-6 select-none">
                <span className="text-white text-sm font-medium pr-8">{summary}</span>
            </div>
        </div>
    );
} 