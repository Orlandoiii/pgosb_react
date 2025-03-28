import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table'

import { useEffect, useMemo, useRef, useState } from 'react'
import AddIcon from '../icons/AddIcon'
import ModifyIcon from '../icons/ModifyIcon'
import DeleteIcon from '../icons/DeleteIcon'
import logger from '../../../logic/Logger/logger'
import { useLayout } from '../context/LayoutContext'
import AlertController from '../alerts/AlertController'
import DownloadIcon from '../icons/DownloadIcon'
import { CsvBuilder } from 'filefy';
import PrintIcon from '../icons/PrintIcon'
import DateTimePickerRange from '../datetime_picker/DateTimePickerRange'
import { parse, isAfter, isBefore, isEqual } from 'date-fns';
import CleanIcon from '../icons/CleanIcon'
import FilterIcon from '../icons/FilterIcon'
import ModalContainer from '../modal/ModalContainer'
import Select from '../inputs/Select'
import Input from '../inputs/Input'
import Button from '../buttons/Button'
import DateTimePicker from '../datetime_picker/DateTimePicker'


const alert = new AlertController()

// Replace TypeScript types/interfaces with JSDoc comments for better documentation
/**
 * @typedef {'igual' | 'similar' | 'mayor' | 'menor' | 'mayorIgual' | 'menorIgual' | 'empieza' | 'termina' | 'vacio' | 'noVacio' | 'diferente'} FilterOperator
 */

/**
 * @typedef {Object} FilterOption
 * @property {string} column
 * @property {FilterOperator} operator
 * @property {string|boolean|Date[]|null} value
 * @property {string} columnType
 */

// Add this helper function to get operators based on column type
function getOperatorsByColumnType(columnType) {
    switch (columnType) {
        case 'bool':
            return [
                { value: 'igual', label: 'Es igual a' }
            ];
        case 'date':
        case 'datetime':
            return []; // Remove operators for date types
        default:
            return [
                { value: 'igual', label: 'Es igual a' },
                { value: 'diferente', label: 'Es diferente de' },
                { value: 'similar', label: 'Contiene' },
                { value: 'empieza', label: 'Empieza con' },
                { value: 'termina', label: 'Termina con' },
                { value: 'vacio', label: 'Está vacío' },
                { value: 'noVacio', label: 'No está vacío' }
            ];
    }
}

function formatBooleanValue(value) {
    if (value === true || value === "true")
        return "SI"

    return "NO"
}

function arrayFilter(row, columnId, filterValue) {
    const cellValue = row.getValue(columnId);

    if (!cellValue || !Array.isArray(cellValue)) return false;

    const search = filterValue.toLowerCase().trim();


    return cellValue.sort().join(',').toLowerCase().includes(search);
}


function dateRangeFilter(row, columnId, filterValue) {

    const cellValue = row.getValue(columnId);

    if (!cellValue) return false;



    const [start, end] = filterValue;


    let date;
    try {
        // First, try parsing as ISO string
        date = parse(cellValue, 'dd-MM-yyyy HH:mm:ss', new Date());
        // If parsing results in an invalid date, try a more flexible approach
        if (isNaN(date.getTime())) {
            date = new Date(cellValue);
        }
    } catch (error) {
        console.error("Error parsing date:", error);
        return false;
    }

    // Check if the parsed date is valid
    if (isNaN(date.getTime())) {
        console.error("Invalid date:", cellValue);
        return false;
    }
    logger.log("DATE FILTER EVALUATED DATE START END", date, start, end)


    if (start && end) {

        const isAfterStart = isAfter(date, start)
        const isBeforeEnd = isBefore(date, end)
        const isEqualStart = isEqual(date, start)
        const isEqualEnd = isEqual(date, end)

        logger.log("DATE FILTER EVALUATED", isAfterStart, isBeforeEnd, isEqualStart, isEqualEnd)

        return isEqualStart || isEqualEnd || (isBeforeEnd && isAfterStart);

    } else if (start) {
        return isAfter(date, start) || isEqual(date, start);
    } else if (end) {
        return isBefore(date, end) || isEqual(date, end);
    }
    return true;
}

function defaultFilter(row, columnId, filterValue) {
    const cellValue = row.getValue(columnId);

    // Handle null/undefined values
    if (cellValue === null || cellValue === undefined) {
        // For isEmpty/notEmpty operators
        if (typeof filterValue === 'object' && filterValue.operator) {
            return filterValue.operator === 'vacio';
        }
        return false;
    }

    if (Array.isArray(cellValue)) {
        return arrayFilter(row, columnId, filterValue);
    }

    if (typeof cellValue === 'boolean') {
        return booleanFilter(row, columnId, filterValue);
    }

    // Handle object filter value with operator
    if (typeof filterValue === 'object' && filterValue.operator) {
        const value = filterValue.value.toString().toUpperCase();
        const cellStr = cellValue.toString().toUpperCase();

        switch (filterValue.operator) {
            case 'igual':
                return cellStr === value;
            case 'diferente':
                return cellStr !== value;
            case 'similar':
                return cellStr.includes(value);
            case 'empieza':
                return cellStr.startsWith(value);
            case 'termina':
                return cellStr.endsWith(value);
            case 'vacio':
                return cellStr.trim() === '';
            case 'noVacio':
                return cellStr.trim() !== '';
            default:
                return cellStr.includes(value);
        }
    }

    // Default string contains search
    const search = filterValue.toString().toUpperCase();
    return cellValue.toString().toUpperCase().includes(search);
}

function booleanFilter(row, columnId, filterValue) {
    const cellValue = row.getValue(columnId);

    if (cellValue === null || cellValue === undefined) return false;

    if (typeof cellValue === 'boolean') {
        return cellValue === filterValue;
    }

    return false;
}

function formatDate(date) {

    if (date == null) {
        return ""
    }

    const pad = (num) => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
function formatDateForFilter(date) {
    if (!date) return null;

    const pad = (num) => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}



function SortIcon({ isSorted }) {
    return (
        <>
            <span className="inline-flex flex-col space-y-[3px]">
                <span className="inline-block">
                    <svg
                        className={`${isSorted && isSorted == 'asc' ? 'fill-[#3c50e0]' : 'fill-gray-200'}`}
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M5 0L0 5H10L5 0Z" fill=""></path>
                    </svg>
                </span>
                <span className="inline-block">
                    <svg
                        className={`${isSorted && isSorted == 'desc' ? 'fill-[#3c50e0]' : 'fill-gray-200'}`}
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z"
                            fill=""
                        ></path>
                    </svg>
                </span>
            </span>
        </>
    )
}

function BackwardButton({ onClick, disabled = false }) {
    return (
        <button
            onClick={onClick}
            className={`flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-[#3c50e0] 
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={disabled}
        >
            <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z"
                    fill=""
                ></path>
            </svg>
        </button>
    )
}

function ForwardButton({ onClick, disabled = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex cursor-pointer items-center justify-center rounded-md 
            p-1 px-2 hover:bg-primary hover:text-[#3c50e0]  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z"
                    fill=""
                ></path>
            </svg>
        </button>
    )
}

function NumberButton({ number = 1, active = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={` false h-8 mx-1 flex cursor-pointer items-center justify-center rounded-md 
            p-1 px-3 ${active ? 'bg-[#0A2F4E] text-white' : ''} 
        hover:bg-[#1D74C1] hover:text-white`}
        >
            {number}
        </button>
    )
}

function DefaultColumnFilter({ column }) {
    const columnFilterValue = column.getFilterValue()

    return (
        <span
            className="block w-[180px] text-center"
            onClickCapture={(e) => {
                e.stopPropagation()
            }}
        >
            <input
                onChange={(e) => column.setFilterValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
               
                type="text"
                value={columnFilterValue ?? ''}
                className="border-black border-2  border-stroke bg-[#2A3956] text-white  focus:border-white px-3 py-1  rounded-md w-full h-auto font-light text-sm outline-none"
            />
        </span>
    )
}

function DateColumnFilter({ column }) {

    const [open, setOpen] = useState(false)



    const [visualStartDate, setVisualStartDate] = useState("");
    const [visualEndDate, setVisualEndDate] = useState("");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateChange = (date) => {

        logger.log("STARTDATE", date)

        setStartDate(date ?? null);
        setEndDate(date ?? null)

        if (date != null) {
            setVisualStartDate(formatDate(date));
            setVisualEndDate(formatDate(date));
        }
    };

    const handleEndDateChange = (date) => {

        logger.log("END DATE", date)

        setEndDate(date ?? null);

        if (date != null) {
            setVisualEndDate(formatDate(date));
        }
    };

    const clearFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setVisualStartDate("");
        setVisualEndDate("");
    };

    const applyFilter = () => {


        const startDateString = startDate ? startDate : null;
        const endDateString = endDate ? endDate : null;


        logger.log("APPLY FILTER", startDateString, endDateString)

        column?.setFilterValue([
            startDateString,
            endDateString
        ]);



    };

    return (
        <>
            <button className='border-black border-2  border-stroke bg-[#2A3956] text-white  focus:border-white px-0.5 py-0.5  rounded-md w-full h-auto font-light text-sm outline-none' type='button' onClick={(e) => {
                e.stopPropagation()
                setOpen(true)
            }}>
                <p className='text-xs font-medium'>Desde: {visualStartDate}</p>
                <p className='text-xs font-medium'>Hasta: {visualEndDate}</p>



            </button>
            <DateTimePickerRange
                open={open}
                onClose={() => { setOpen(false) }}
                startDate={startDate}
                endDate={endDate}
                handleDateChange={handleDateChange}
                handleEndDateChange={handleEndDateChange}
                onClear={() => {
                    setOpen(false)
                    clearFilter()
                    column.setFilterValue([Date.Min_VALUE, Date.Max_VALUE])
                }}
                onConfirm={() => {
                    setOpen(false)
                    applyFilter()
                }}
            />

        </>
    )
}

function BooleanColumnFilter({ column }) {
    const [checkboxState, setCheckboxState] = useState('indeterminate');

    const handleChange = (e) => {
        e.stopPropagation();
        switch (checkboxState) {
            case 'indeterminate':
                setCheckboxState('checked');
                column.setFilterValue(true);
                break;
            case 'checked':
                setCheckboxState('unchecked');
                column.setFilterValue(false);
                break;
            case 'unchecked':
                setCheckboxState('indeterminate');
                column.setFilterValue(undefined);
                break;
        }
    };

    return (
        <div>
            <input
                type="checkbox"
                ref={(el) => {
                    if (el) {
                        el.indeterminate = checkboxState === 'indeterminate';
                    }
                }}
                className=""
                checked={checkboxState === 'checked'}
                onChange={handleChange}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
function ColumnFilter({ column, layoutColumn = null }) {

    //logger.log("LAYOUT COLUMN", column)

    if (layoutColumn?.type == 'bool') {
        return <BooleanColumnFilter column={column} />
    }

    if (layoutColumn == null || (layoutColumn?.type != 'date' && layoutColumn?.type != 'datetime')) {
        return <DefaultColumnFilter column={column} />
    }


    return <DateColumnFilter column={column} layoutColumn={layoutColumn} />


}

function Checkbox({ indeterminate, className = '', ...rest }) {
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

const checkBoxHeader = {
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
}

// Add this new component at the top of the file with other component definitions
function DateRangeFilterInput({ startDate, endDate, handleDateChange, handleEndDateChange }) {
    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Desde:</label>
                <DateTimePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    placeholderText="Seleccione fecha inicial..."
                    width="w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Hasta:</label>
                <DateTimePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    placeholderText="Seleccione fecha final..."
                    width="w-full"
                    minDate={startDate ?? undefined}
                    minTime={startDate ?? undefined}
                    disabled={!startDate}
                />
            </div>
        </div>
    );
}

// Add the FilterModal component
function FilterModal({ table, layout, onClose, activeFilters }) {
    const [selectedColumn, setSelectedColumn] = useState('')
    const [selectedColumnLabel, setSelectedColumnLabel] = useState('')
    const [selectedOperator, setSelectedOperator] = useState('')
    const [selectedOperatorLabel, setSelectedOperatorLabel] = useState('Es igual a')
    const [filterValue, setFilterValue] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [booleanValue, setBooleanValue] = useState(null)

    // Get visible columns with their full configuration
    const visibleColumns = useMemo(() => {
        return table.getAllColumns()
            .filter(col => col.id !== 'select' && col.getIsVisible())
            .map(col => {
                const layoutConfig = layout?.find(v => v.column_name === col.id)
                return {
                    value: col.id,
                    label: col.columnDef.header?.toString(),
                    type: layoutConfig?.type || 'string'
                }
            })
    }, [table, layout])

    // Get column configuration from layout
    const selectedColumnConfig = layout?.find(
        (v) => v.column_name === selectedColumn
    )

    const columnType = selectedColumnConfig?.type || 'string'
    const operators = getOperatorsByColumnType(columnType)

    const handleApplyFilter = () => {
        if (!selectedColumn) return;

        const column = table.getColumn(selectedColumn)
        if (!column) return;

        let value;
        switch (columnType) {
            case 'bool':
                value = booleanValue;
                break;
            case 'date':
            case 'datetime':
                value = [startDate, endDate];
                break;
            default:
                if (['vacio', 'noVacio'].includes(selectedOperator)) {
                    value = {
                        operator: selectedOperator,
                        value: ''
                    };
                } else {
                    value = {
                        value: filterValue.toUpperCase(),
                        operator: selectedOperator
                    };
                }
        }

        column.setFilterValue(value);
        
        // Reset form for next filter
        setSelectedColumn('');
        setSelectedColumnLabel('');
        setSelectedOperator('');
        setSelectedOperatorLabel('Es igual a');
        setFilterValue('');
        setStartDate(null);
        setEndDate(null);
        setBooleanValue(null);
    }

    return (
        <div className="w-full h-full min-h-[400px] min-w-[400px] pt-4 space-y-4">
            {/* Active Filters Section */}
            {activeFilters.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Filtros Activos ({activeFilters.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {activeFilters.map((filter, index) => (
                            <div 
                                key={`${filter.column}-${index}`}
                                className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm"
                            >
                                <span className="mr-2">{filter.columnLabel}: {filter.value}</span>
                                <button
                                    onClick={() => {
                                        const column = table.getColumn(filter.column);
                                        if (column) {
                                            column.setFilterValue(undefined);
                                        }
                                    }}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <span className="px-1">×</span>
                                </button>
                            </div>
                        ))}
                    </div>
                 
                    <hr className="my-4" />
                </div>
            )}

            {/* Existing Filter Form */}
            <div className="flex flex-col gap-2">
                <h2 className='text-md font-medium'>Filtrar por</h2>
                <Select
                    inputName="column-select"
                    label="Columna"
                    value={selectedColumnLabel}
                    options={visibleColumns.map(col => col.label)}
                    onSelected={(value) => {
                        const col = visibleColumns.find(c => c.label === value)
                        if (col) {
                            setSelectedColumn(col.value)
                            setSelectedColumnLabel(value)
                            
                            // Only set operator for non-date columns
                            if (col.type !== 'date' && col.type !== 'datetime') {
                                const defaultOperator = getOperatorsByColumnType(col.type)[0]
                                setSelectedOperator(defaultOperator?.value || 'igual')
                                setSelectedOperatorLabel(defaultOperator?.label || 'Es igual a')
                            } else {
                                // For date columns, clear operator state
                                setSelectedOperator('')
                                setSelectedOperatorLabel('')
                            }
                            
                            // Reset values
                            setFilterValue('')
                            setStartDate(null)
                            setEndDate(null)
                            setBooleanValue(null)
                        }
                    }}
                />
            </div>

            {selectedColumn && (
                <>
                    {/* Only show operator select for non-date columns */}
                    {columnType !== 'date' && columnType !== 'datetime' && (
                        <div className="flex flex-col gap-2">
                            <Select
                                inputName="operator-select"
                                label="Operador"
                                value={selectedOperatorLabel}
                                options={operators.map(op => op.label)}
                                onSelected={(value) => {
                                    const op = operators.find(o => o.label === value)
                                    if (op) {
                                        setSelectedOperator(op.value)
                                        setSelectedOperatorLabel(value)
                                    }
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Render appropriate input based on column type */}
            {selectedColumn && !['vacio', 'noVacio'].includes(selectedOperator) && (
                <div className="flex flex-col gap-2">
                    {columnType === 'bool' ? (
                        <Select
                            inputName="boolean-select"
                            label="Valor"
                            value={booleanValue === null ? '' : (booleanValue ? 'SI' : 'NO')}
                            options={['SI', 'NO']}
                            onSelected={(value) => setBooleanValue(value === 'SI')}
                        />
                    ) : columnType === 'date' || columnType === 'datetime' ? (
                        <DateRangeFilterInput
                            startDate={startDate}
                            endDate={endDate}
                            handleDateChange={setStartDate}
                            handleEndDateChange={setEndDate}
                        />
                    ) : (
                        <Input
                            inputName="filter-value"
                            label="Valor"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value.toUpperCase())}
                        />
                    )}
                </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    onClick={onClose}
                    variant="secondary"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleApplyFilter}
                    variant="primary"
                >
                    Aplicar
                </Button>
            </div>
        </div>
    )
}

// New component for row action buttons
function RowActionButtons({ row, onUpdate, onDelete, permissions, showEditButton, showDeleteButton }) {
    return (
        <div 
            className="sticky right-0 pr-2 top-0 h-12 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none"
            style={{
                backgroundColor: 'transparent',
                width: 0,
                float: 'right',
                marginLeft: '-96px' // Increased to accommodate larger buttons
            }}
        >
            <div className="flex items-center pointer-events-auto">
                <div className="flex space-x-2 pl-6 pr-1 py-1">
                    {showEditButton && permissions['update'] && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!permissions['update']) {
                                    alert.notifyInfo('Usted no tiene permiso para editar');
                                    return;
                                }
                                if (onUpdate) {
                                    row.toggleSelected(true);
                                    onUpdate(row.original);
                                }
                            }}
                            className="flex justify-center items-center bg-[#0A2F4E] text-white rounded-full w-9 h-9 shadow-md opacity-10 hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                    )}
                    {showDeleteButton && permissions['delete'] && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!permissions['delete']) {
                                    alert.notifyInfo('Usted no tiene permiso para eliminar');
                                    return;
                                }
                                if (onDelete) {
                                    row.toggleSelected(true);
                                    onDelete([row.original]);
                                }
                            }}
                            className="flex justify-center items-center text-white rounded-full w-9 h-9 bg-rose-700 shadow-md opacity-10 hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TableDataGrid({
    rawData,
    onAdd,
    onDoubleClickRow,
    onUpdate,
    onDelete,
    onPrint,
    showAddButton = true,
    showEditButton = true,
    showDeleteButton = true,
    showPrintButton = false,
    permissions,
    child,
    showDownloadButton = false,
    exportFileName = 'data',
    showCleanFiltersButton = true,
    showFilterButton = true,
}) {
    logger.log('LOAD MODAL Renderizo TableDataGrid')

    const { layout } = useLayout()

    logger.log('DATA GRID CONFIG:', layout)
    logger.log('DATA GRID DATA:', rawData)

    logger.log('DATA GRID PERMISSION:', permissions)


    const COLUMNS = []

    COLUMNS.push(checkBoxHeader)

    if (Array.isArray(rawData) && rawData.length > 0 && rawData[0]) {
        Object.entries(rawData[0]).forEach(([value, keyName]) => {
            if (layout != null) {
                const config = layout?.find((v) => v.column_name == value)
                if (config) {

                    if (config.visibility)

                        COLUMNS.push({

                            header: config.display_name,
                            accessorKey: value,

                            filterFn: config.type == 'date' || config.type == 'datetime' ? 'dateRange' : 'default',

                            cell: ({ getValue }) => {
                                const value = getValue();
                                if (typeof value === 'boolean') {

                                    return formatBooleanValue(value);

                                } else if (Array.isArray(value)) {

                                    return value?.sort()?.join(','); // Join array elements with comma and space
                                } else {

                                    return value;
                                }
                            },

                            //footer: key,
                        })
                } else {
                    logger.log('DATO FALTANTE:', value)
                }
            } else {
                COLUMNS.push({
                    header: keyName,
                    accessorKey: value,

                    //footer: key,
                })
            }
        })
    } else {
        COLUMNS.push({
            header: 'SIN DATOS',
            accessorKey: 'SIN DATOS',
            //footer: key,
        })
    }




    const columns = useMemo(() => COLUMNS, [rawData])

    const data = useMemo(() => rawData, [rawData])

    const [rowSelection, setRowSelection] = useState({})

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 })

    const inputSetPageRef = useRef(null)

    const [sorting, setSorting] = useState([])

    const [globalFilter, setGlobalFilter] = useState('')

    const [openModal, setOpenModal] = useState(false)

    const [activeFilters, setActiveFilters] = useState([]);






    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        filterFns: {
            dateRange: dateRangeFilter,
            default: defaultFilter
        },
        state: {
            pagination: pagination,
            sorting: sorting,
            globalFilter: globalFilter,
            rowSelection: rowSelection,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
    })





    useEffect(() => {
        const filters = [];
        
        // Add global filter if present
        if (globalFilter && globalFilter.trim() !== '') {
            filters.push({
                column: 'global',
                columnLabel: 'Búsqueda global',
                value: globalFilter,
                type: 'global'
            });
        }
        
        // Add column filters
        table.getAllColumns().forEach(column => {
            const filterValue = column.getFilterValue();
            if (filterValue !== undefined) {
                const layoutConfig = layout?.find(v => v.column_name === column.id);
                const columnLabel = column.columnDef.header?.toString();
                
                if (layoutConfig?.type === 'date' || layoutConfig?.type === 'datetime') {
                    if (Array.isArray(filterValue) && filterValue.some(v => v != null)) {
                        filters.push({
                            column: column.id,
                            columnLabel,
                            value: `Desde: ${formatDate(filterValue[0])} - Hasta: ${formatDate(filterValue[1])}`,
                            type: 'date'
                        });
                    }
                } else if (layoutConfig?.type === 'bool') {
                    filters.push({
                        column: column.id,
                        columnLabel,
                        value: filterValue ? 'SI' : 'NO',
                        type: 'bool'
                    });
                } else if (typeof filterValue === 'object' && filterValue.operator) {
                    const operatorLabel = getOperatorsByColumnType('string')
                        .find(op => op.value === filterValue.operator)?.label || '';
                    filters.push({
                        column: column.id,
                        columnLabel,
                        value: `${operatorLabel} "${filterValue.value}"`,
                        type: 'string'
                    });
                }
            }
        });
        
        setActiveFilters(filters);
    }, [table.getState().columnFilters, globalFilter, layout]);

    function getTotalSelectedRows() {
        const rowModel = table.getSelectedRowModel()

        if (!rowModel || !rowModel.rows) return 0

        return rowModel.rows.length
    }


    function handleDownload() {

        if (!permissions['export']) {
            alert.notifyInfo(
                'Usted no tiene permiso para exportar'
            )
            return
        }

        const rowsToExport = table.getSortedRowModel()
            .rows.map(row => row.original);



        const visibleColumns = COLUMNS.filter(column => column.id != 'select' && column.accessorKey);


        const rowsToExportArray = rowsToExport.map(row =>
            visibleColumns.map(column => {
                const value = row[column.accessorKey];
                // Convert value to string, replace newlines with spaces, and trim
                return value !== undefined && value !== null
                    ? value.toString().replace(/\n/g, ' ').trim()
                    : '';
            })
        );


        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const exportName = `${exportFileName}-${formattedDate}.csv`;


        const csv = new CsvBuilder(exportName)
            .setDelimeter(";")
            .setColumns(visibleColumns.map(c => c.header))
            .addRows(rowsToExportArray);

        csv.exportFile();

    }


    function resetAllFilters() {

        setGlobalFilter('')

        // Reset all column filters
        table.getAllColumns().forEach(column => {
            column.setFilterValue(undefined)
        })

    }




    function handlePrint() {


        //

        if (!permissions['print']) {
            alert.notifyInfo(
                'Usted no tiene permiso para imprimir'
            )
            return
        }

        const rowsToPrint = table.getSortedRowModel()
            .rows.map(row => row.original);

        let value = { "data": rowsToPrint, "filters": activeFilters }

        logger.log('PRINT DATA:', value)

        onPrint(value)
    }

    // Update the getActiveFiltersCount function
    const getActiveFiltersCount = useMemo(() => {
        let count = 0;
        
        // Count global filter if present
        if (globalFilter && globalFilter.trim() !== '') {
            count++;
        }
        
        // Count column filters
        table.getAllColumns().forEach(column => {
            const filterValue = column.getFilterValue();
            if (filterValue !== undefined && filterValue !== null) {
                const layoutConfig = layout?.find(v => v.column_name === column.id);
                
                // Handle date range filters
                if (layoutConfig?.type === 'date' || layoutConfig?.type === 'datetime') {
                    if (Array.isArray(filterValue) && filterValue.some(v => v != null)) {
                        count++;
                    }
                }
                // Handle boolean filters
                else if (layoutConfig?.type === 'bool') {
                    if (filterValue !== undefined) {
                        count++;
                    }
                }
                // Handle string filters with operators
                else if (typeof filterValue === 'object' && filterValue.operator) {
                    count++;
                }
                // Handle simple string filters
                else if (filterValue !== '') {
                    count++;
                }
            }
        });
        
        return count;
    }, [table.getState().columnFilters, globalFilter, layout]);

    return (
        <>
            <div className='flex flex-col pb-24 w-full h-full'>
                <div className="flex flex-col flex-1 bg-[white] h-60 overflow-hidden">
                    <header className="flex justify-between mx-auto px-8 py-4 w-full  bg-[#445C71] rounded-md">
                        {/* <pre>{JSON.stringify(table.getState().rowSelection, null, 2)}</pre> */}

                        <div className="flex space-x-4">
                            {showAddButton && (
                                <button
                                    onClick={(e) => {
                                        if (!permissions['add']) {
                                            alert.notifyInfo(
                                                'Usted no tiene permiso para agregar'
                                            )
                                            return
                                        }

                                        if (onAdd) onAdd()
                                    }}
                                    className="flex justify-center items-center bg-slate-200 shadow-md p-1.5 rounded-full w-[40px] h-[40px]"
                                >
                                    <AddIcon
                                        color={
                                            permissions['add']
                                                ? 'fill-[#0A2F4E]'
                                                : 'fill-gray-300'
                                        }
                                    />
                                </button>
                            )}

                            {showEditButton && (
                                <button
                                    onClick={(e) => {

                                        if (!permissions['update']) {
                                            alert.notifyInfo(
                                                'Usted no tiene permiso para editar'
                                            )
                                            return
                                        }

                                        if (!(getTotalSelectedRows() === 1)) {
                                            return
                                        }


                                        const rowModel =
                                            table.getSelectedRowModel()

                                        if (
                                            !rowModel ||
                                            getTotalSelectedRows() != 1
                                        )
                                            return

                                        const selectedRows = rowModel.rows.map(
                                            (r) => r.original
                                        )

                                        if (onUpdate) onUpdate(selectedRows[0])

                                        table.toggleAllRowsSelected(false)
                                    }}
                                    className={`w-[40px] h-[40px] p-1.5 ${getTotalSelectedRows() === 1 &&
                                        permissions['update']
                                        ? 'bg-slate-200'
                                        : 'bg-slate-50'
                                        } bg-slate-200 rounded-full flex 
                                justify-center items-center shadow-md`}
                                >
                                    <ModifyIcon
                                        active={
                                            getTotalSelectedRows() === 1 &&
                                            permissions['update']
                                        }
                                    />
                                </button>
                            )}

                            {showDeleteButton && (
                                <button
                                    onClick={() => {

                                        if (!permissions['delete']) {
                                            alert.notifyInfo(
                                                'Usted no tiene permiso para eliminar'
                                            )
                                            return
                                        }

                                        if (getTotalSelectedRows() < 1) return



                                        const rowModel =
                                            table.getSelectedRowModel()

                                        if (
                                            !rowModel ||
                                            getTotalSelectedRows() < 1
                                        )
                                            return

                                        const selectedRows = rowModel.rows.map(
                                            (r) => r.original
                                        )

                                        if (onDelete) {
                                            let r = onDelete(selectedRows)
                                            if (r) {
                                                r.then((yes) => {
                                                    if (yes)
                                                        table.resetRowSelection()
                                                })
                                            }
                                        }
                                        table.toggleAllRowsSelected(false)
                                    }}
                                    className="flex justify-center items-center bg-slate-200 shadow-md p-2 rounded-full w-[40px] h-[40px]"
                                >
                                    <DeleteIcon
                                        active={
                                            getTotalSelectedRows() >= 1 &&
                                            permissions['delete']
                                        }
                                    />
                                </button>
                            )}

                            {showPrintButton && (
                                <button
                                    onClick={handlePrint}
                                    className="flex justify-center items-center bg-slate-200 shadow-md p-0.5 rounded-full w-[40px] h-[40px]"
                                >
                                    <PrintIcon color={permissions['print'] ? 'black' : 'gray'} />

                                </button>
                            )}

                            {showDownloadButton && (
                                <button
                                    onClick={handleDownload}
                                    className="flex justify-center items-center bg-slate-200 shadow-md p-0.5 rounded-full w-[40px] h-[40px]"
                                >
                                    <DownloadIcon color={permissions['export'] ? '#BE123C' : 'gray'} />

                                </button>
                            )}


                            {showCleanFiltersButton && (


                                <button
                                    onClick={resetAllFilters}
                                    className={`relative flex justify-center items-center bg-slate-200 
                                           shadow-md p-0.5 rounded-full w-[40px] h-[40px]`}
                                >
                                    <div className={`absolute bg-transparent  top-0 left-0 w-full h-full  rounded-full  
                                        ${Object.keys(activeFilters).length > 0 ? 'ring-2 ring-blue-500 animate-pulse' : 'animate-none'}`}></div>

                                    <CleanIcon color={Object.keys(activeFilters).length > 0 ? 'black' : 'gray'} />
                                </button>
                            )}
                            {showFilterButton && (
                                <div className="relative">
                                    <button 
                                        onClick={() => setOpenModal(true)}
                                        className="relative flex justify-center items-center bg-slate-200 shadow-md p-0.5 rounded-full w-[40px] h-[40px]"
                                    >
                                        <FilterIcon />
                                    </button>
                                    {activeFilters.length > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                                            {activeFilters.length}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        <div className="px-4 w-1 flex-1">
                            <input
                                type="text"
                                className="border-gray-300 p-3 border rounded-md w-full h-12 outline-none"
                                placeholder="Buscar..."
                                value={globalFilter}
                                onChange={(e) => {
                                    setGlobalFilter(e.target.value)
                                }}
                            />
                        </div>

                        {child}

                        <div className="flex justify-end items-center font-medium">
                            <select
                                className="bg-transparent pl-2 text-gray-200"
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => {
                                    const value = e.target.value
                                    table.setPageSize(value)
                                }}
                            >
                                <option>5</option>
                                <option>10</option>
                                <option>15</option>
                                <option>25</option>
                                <option>50</option>
                                <option>75</option>
                                <option>100</option>
                                <option>500</option>
                            </select>
                            <p className="pl-2 font-medium text-gray-200 text-sm">
                                Registros Por Página
                            </p>
                        </div>
                    </header>

                    <div className="h-full overflow-auto relative">
                        <table className="border-collapse w-full">
                            <thead>
                                {/* {table.column} */}
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr
                                        className="top-0 sticky bg-[#1C2434] z-40"
                                        key={headerGroup.id}
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.column?.id}
                                                className={`border-y bg-[#1C2434]
                                            border-gray-200 h-20 px-1 cursor-pointer 
                                             ${header.column.getCanSort() ? 'cursor-pointer' : 'cursor-none'}
                                             ${header.column.id === 'select' ? 'sticky left-0 z-50' : ''}
                                            `}
                                                style={{
                                                    left: header.column.id === 'select' ? 0 : undefined,
                                                    backgroundColor: '#1C2434' // Ensure solid background color
                                                }}
                                                {...{
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                <div className="flex flex-col justify-center items-center">
                                                    <div className="flex justify-center items-center p-2 w-full h-full font-medium text-white text-center text-md whitespace-nowrap">
                                                        <p className="px-2">
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                        </p>

                                                        <SortIcon
                                                            isSorted={header.column.getIsSorted()}
                                                        />
                                                    </div>
                                                    {header.column.getCanFilter() ? (
                                                        <ColumnFilter
                                                            column={
                                                                header.column
                                                            }
                                                            table={table}
                                                            layoutColumn={
                                                                layout?.find(
                                                                    (v) => v.column_name == header.column?.columnDef?.accessorKey
                                                                )
                                                            }
                                                        />
                                                    ) : null}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row, rowIndex) => (
                                    <tr
                                        key={row.id}
                                        className={`${rowIndex % 2 === 0 ? 'bg-[rgba(214,234,248,0.31)]' : 'bg-white'} text-[#0A2F4E] 
                                        overflow-auto [&>*:nth-child(2)]:text-[#1D74C1] hover:bg-slate-200 group`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                onDoubleClick={() => {
                                                    if (
                                                        cell.id.includes(
                                                            '_select'
                                                        )
                                                    )
                                                        return

                                                    if (onDoubleClickRow)
                                                        onDoubleClickRow(
                                                            row.original
                                                        )
                                                }}
                                                key={cell.id}
                                                className={`border-gray-200 hover:bg-slate-300 p-2 border-b max-w-[220px] h-12 font-medium text-center text-ellipsis text-sm whitespace-nowrap overflow-x-hidden
                                                ${cell.column.id === 'select' ? 'sticky left-0 z-10' : ''}`}
                                                style={{
                                                    left: cell.column.id === 'select' ? 0 : undefined,
                                                    backgroundColor: cell.column.id === 'select' ? (rowIndex % 2 === 0 ? 'rgba(214,234,248,0.31)' : 'white') : undefined
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                        
                                        {/* Use the new component for row action buttons */}
                                        <RowActionButtons 
                                            row={row} 
                                            onUpdate={onUpdate}
                                            onDelete={onDelete}
                                            permissions={permissions}
                                            showEditButton={showEditButton}
                                            showDeleteButton={showDeleteButton}
                                        />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <footer className="flex justify-between items-center px-8 py-4 min-h-20">
                        <div>
                            <label htmlFor="goToPageInput">Ir a: </label>
                            <input
                                ref={inputSetPageRef}
                                id="goToPageInput"
                                type="number"
                                defaultValue={
                                    table.getState().pagination.pageIndex + 1
                                }
                                onChange={(e) => {
                                    let pageNumber = e.target.value
                                        ? Number(e.target.value)
                                        : 0

                                    if (pageNumber < 0) {
                                        pageNumber = 0
                                    }
                                    if (pageNumber >= table.getPageCount()) {
                                        pageNumber = table.getPageCount()
                                        inputSetPageRef.current.value =
                                            pageNumber
                                    }
                                    table.setPageIndex(pageNumber - 1)
                                }}
                                className="border-gray-400 hover:border-[#3c50e0] focus:border-[#3c50e0] p-1 border rounded-sm max-w-[70px] outline-none"
                            />
                        </div>

                        <div className="flex justify-center items-center">
                            <BackwardButton
                                onClick={() => {
                                    if (table.getCanPreviousPage())
                                        table.previousPage()
                                }}
                                disabled={!table.getCanPreviousPage()}
                            />
                            <NumberButton
                                number={'Primera'}
                                active={
                                    table.getState().pagination.pageIndex == 0
                                }
                                onClick={() => {
                                    if (table.getCanPreviousPage())
                                        table.firstPage()
                                }}
                            />

                            <NumberButton
                                number={'Ultima'}
                                active={
                                    table.getState().pagination.pageIndex +
                                    1 ===
                                    table.getPageCount()
                                }
                                onClick={() => {
                                    if (table.getCanNextPage()) table.lastPage()
                                }}
                            />
                            <ForwardButton
                                onClick={() => {
                                    table.nextPage()
                                }}
                                disabled={!table.getCanNextPage()}
                            />
                        </div>

                        <p className="text-gray-500">
                            Mostrando{' '}
                            <strong className="text-black">
                                {table.getState().pagination.pageIndex + 1}
                            </strong>{' '}
                            de
                            <strong className="text-black">
                                {' '}
                                {table.getPageCount().toLocaleString()}
                            </strong>
                        </p>

                        <div>Registros: {table.getRowCount()}</div>
                    </footer>
                </div>


                <ModalContainer show={openModal} 
                title='Filtros'
                onClose={() => setOpenModal(false)} showX={true}>
                    <FilterModal
                        table={table}
                        layout={layout}
                        onClose={() => setOpenModal(false)}
                        activeFilters={activeFilters}
                    />
                </ModalContainer>
            </div>
        </>
    )
}