import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,


} from "@tanstack/react-table"

import moock_data from "../../../assets/MOCK_DATA.json"
import logger from "../../../logic/Logger/logger";
import { useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "../icons/AddIcon";
import ModifyIcon from "../icons/ModifyIcon";
import DeleteIcon from "../icons/DeleteIcon";


function SortIcon({ isSorted }) {

    return (
        <>
            <span className="inline-flex flex-col space-y-[3px]">
                <span className="inline-block">
                    <svg className={`${isSorted && isSorted == "asc" ? "fill-[#3c50e0]" : "fill-gray-200"}`} width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 0L0 5H10L5 0Z" fill="">
                        </path>
                    </svg>
                </span>
                <span className="inline-block">
                    <svg className={`${isSorted && isSorted == "desc" ? "fill-[#3c50e0]" : "fill-gray-200"}`} width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill="">
                        </path>
                    </svg>
                </span>
            </span>
        </>
    )
}


function BackwardButton({ onClick, disabled = false }) {
    return (
        <button onClick={onClick}
            className={`flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-[#3c50e0] 
                ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            disabled={disabled}>
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z" fill="">
                </path>
            </svg>
        </button>
    )
}

function ForwardButton({ onClick, disabled = false }) {
    return (
        <button onClick={onClick}
            disabled={disabled}
            className={`flex cursor-pointer items-center justify-center rounded-md 
            p-1 px-2 hover:bg-primary hover:text-[#3c50e0]  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z" fill="">
                </path>
            </svg>
        </button>
    )
}

function NumberButton({ number = 1, active = false, onClick }) {
    return (
        <button onClick={onClick} className={` false h-8 mx-1 flex cursor-pointer items-center justify-center rounded-md 
            p-1 px-3 ${active ? "bg-[#0A2F4E] text-white" : ""} 
        hover:bg-[#1D74C1] hover:text-white`}>{number}
        </button>
    )
}


function ColumnFilter({ column, table }) {

    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()


    return (
        <span className="block w-[180px] text-center" onClickCapture={(e) => { e.stopPropagation() }}>
            <input
                onChange={e => column.setFilterValue(e.target.value)}
                onClick={e => e.stopPropagation()}
                placeholder={`Search...`}
                type="text"
                value={(columnFilterValue ?? '')}
                className="font-light text-sm w-full  focus:border-[#3c50e0]
                                                    h-[12] rounded-sm border border-stroke px-3 py-1 
                                                    outline-none border-gray-300 focus:border-primary"/>
        </span>
    )
}


function Checkbox({
    indeterminate,
    className = '',
    ...rest }) {
    const ref = useRef(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input 
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    )
}

export default function TableDataGrid({ rawData, onAdd, onUpdate, onDelete, configHeader = null }) {



    const COLUMNS = [];


    COLUMNS.push(
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
    )

    Object.entries(rawData[0])
        .forEach(([key, _]) => {
            COLUMNS.push(
                {
                    
                    header: configHeader && configHeader[key] ? configHeader[key] : key,
                    accessorKey: key,
                    //footer: key,
                }
            )
        })


    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => rawData, [])




    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })


    const inputSetPageRef = useRef(null);


    const [sorting, setSorting] = useState([]);


    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,

        state: {
            pagination: pagination,
            sorting: sorting,
            globalFilter: globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting


    })


    // const [rowSelection, setRowSelection] = React.useState({})




    return (
        <>

            <div className="bg-[white] flex flex-col overflow-hidden ">

                <header className="w-full mx-auto flex justify-between  py-4 px-8">

                    <div className="flex space-x-4">
                        <button onClick={(e) => { if (onAdd) onAdd() }}
                            className="w-[40px] h-[40px] p-1.5 bg-slate-200 rounded-full flex justify-center items-center shadow-md">
                            <AddIcon />
                        </button>
                        <button onClick={(e) => { if (onUpdate) onUpdate() }}
                            className="w-[40px] h-[40px] p-1.5 bg-slate-200 rounded-full flex justify-center items-center shadow-md">
                            <ModifyIcon />
                        </button>

                        <button onClick={(e) => { if (onDelete) onDelete() }}
                            className="w-[40px] h-[40px] p-2 bg-slate-200 rounded-full flex justify-center items-center shadow-md">
                            <DeleteIcon />
                        </button>
                    </div>


                    <div className="w-1/2 pr-2">
                        <input type="text" className="outline-none p-3 h-12 w-full border border-gray-300 rounded-md" placeholder="Buscar..."
                            value={globalFilter} onChange={(e) => { setGlobalFilter(e.target.value) }}
                        />
                    </div>




                    <div className=" flex items-center justify-end font-medium">
                        <select className="bg-transparent pl-2" value={table.getState().pagination.pageSize} onChange={(e) => {
                            const value = e.target.value;
                            table.setPageSize(value);
                        }}>
                            <option>5</option>
                            <option>10</option>
                            <option>15</option>
                            <option>25</option>
                            <option>50</option>
                            <option>75</option>
                            <option>100</option>
                            <option>500</option>
                        </select>
                        <p className="pl-2 text-black text-sm font-medium">Registros Por Página</p>
                    </div>

                </header>


                <div className="max-h-[600px] overflow-auto">
                    <table className="border-collapse w-full mt-2" >
                        <thead>
                            {table.getHeaderGroups().map(headerGroup =>
                                <tr className="sticky top-0" key={headerGroup.id}>
                                    {headerGroup.headers.map(header =>
                                        <th key={header.column?.id} className={`border-y bg-white 
                                            border-gray-200 h-20 px-1 cursor-pointer 
                                             ${header.column.getCanSort() ? "cursor-pointer" : "cursor-none"}
                                            `}
                                            {...{

                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            <div className="flex flex-col justify-center items-center">
                                                <div className="w-full h-full whitespace-nowrap p-2 text-md  text-center font-medium 
                                        text-[#64748b] flex justify-center items-center">
                                                    <p className="px-2">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </p>

                                                    <SortIcon isSorted={header.column.getIsSorted()}
                                                    />
                                                </div>
                                                {header.column.getCanFilter() ? <ColumnFilter column={header.column} table={table} /> : null}


                                            </div>


                                        </th>
                                    )}
                                </tr>
                            )}
                        </thead>
                        <tbody className=" ">
                            {table.getRowModel().rows.map(row =>
                                <tr key={row.id} className="even:bg-[rgba(214,234,248,0.31)]  text-[#0A2F4E] overflow-auto [&>*:nth-child(2)]:text-[#1D74C1]">
                                    {row.getVisibleCells().map(cell =>
                                        <td key={cell.id} className="whitespace-nowrap max-w-[220px] text-ellipsis overflow-x-hidden  h-20 p-2 text-sm text-center font-medium border-b border-gray-200">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="flex justify-between items-center min-h-20 py-4 px-8">



                    <div>
                        <label htmlFor="goToPageInput">Ir a: </label>
                        <input ref={inputSetPageRef} id="goToPageInput" type='number'
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                let pageNumber = e.target.value ? Number(e.target.value) : 0

                                if (pageNumber < 0) {
                                    pageNumber = 0;
                                } if (pageNumber >= table.getPageCount()) {

                                    pageNumber = table.getPageCount();
                                    inputSetPageRef.current.value = pageNumber;

                                }
                                table.setPageIndex(pageNumber - 1);
                            }}
                            className="border border-gray-400 outline-none 
                            rounded-sm p-1 max-w-[70px] focus:border-[#3c50e0] hover:border-[#3c50e0]" />
                    </div>

                    <div className="flex justify-center items-center">
                        <BackwardButton onClick={() => {
                            if (table.getCanPreviousPage())
                                table.previousPage()

                        }} disabled={!table.getCanPreviousPage()} />
                        <NumberButton number={"Primera"} active={table.getState().pagination.pageIndex == 0} onClick={() => {
                            if (table.getCanPreviousPage())
                                table.firstPage()
                        }} />


                        <NumberButton number={"Ultima"} active={table.getState().pagination.pageIndex + 1 === table.getPageCount()} onClick={() => {
                            if (table.getCanNextPage())
                                table.lastPage()
                        }} />
                        <ForwardButton onClick={() => { table.nextPage() }} disabled={!table.getCanNextPage()} />
                    </div>

                    <p className="text-gray-500">Mostrando <strong className="text-black">{table.getState().pagination.pageIndex + 1}</strong> de
                        <strong className="text-black"> {table.getPageCount().toLocaleString()}</strong></p>

                </footer>


            </div>




        </>
    )
}