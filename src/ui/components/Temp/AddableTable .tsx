import React, { useEffect, useState } from 'react'

interface AddableTableProps<T> {
    title: string
    addButtonText: string
    onAddButtonClick: () => void
    enable?: boolean
    data: T[]
    idPropertyName: string
    onEditButtonClick?: (id: string) => void
    onDeleteButtonClick?: (id: string) => void
}

export function AddableTable<T>({
    title = 'Title',
    addButtonText = 'Agregar',
    onAddButtonClick,
    enable = true,
    data = [],
    idPropertyName = '',
    onEditButtonClick,
    onDeleteButtonClick,
}: AddableTableProps<T>) {
    var [internalData, setInternalData] = useState(data)

    var [sortAsc, setSortAsc] = useState(false)
    var [sort, setSort] = useState('')

    useEffect(() => {
        if (sort == '') return
        setInternalData([
            ...internalData.sort((a, b) => {
                const valueA = a?.[sort as keyof T]
                const valueB = b?.[sort as keyof T]

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return sortAsc
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA)
                } else if (
                    typeof valueA === 'number' &&
                    typeof valueB === 'number'
                ) {
                    return sortAsc ? valueA - valueB : valueB - valueA
                } else {
                    throw new Error('Unsupported property type for sorting')
                }
            }),
        ])
    }, [sort, sortAsc])

    function changeSort(property: keyof T) {
        if (property == sort) {
            setSortAsc(!sortAsc)
        } else {
            setSort(String(property))
            setSortAsc(false)
        }
    }

    function anyElement(): boolean {
        return internalData.length > 0
    }

    function propertiesCount(): number {
        return anyElement() ? Object.entries(internalData[0] as any).length : 0
    }

    function arrayOfLength(length: number): number[] {
        return anyElement() ? Array<number>(length).fill(0) : []
    }

    return (
        <div className={`space-y-2 ${enable ? 'opacity-100' : 'opacity-50'}`}>
            <div className="text-xl text-slate-700 font-semibold">{title}</div>
            <table className="w-full select-none rounded-lg overflow-hidden">
                <thead>
                    <tr className="relative h-10 w-full border-b border-[#0A2F4E] text-sm text-slate-200 bg-[#0A2F4E]">
                        {anyElement() ? (
                            <>
                                {Object.entries(internalData[0] as any).map(
                                    (property) => (
                                        <td
                                            key={property[0]}
                                            className={`  px-4 duration-200 hover:bg-[#1d4368] ${enable ? 'cursor-pointer' : ''}`}
                                            onClick={
                                                enable
                                                    ? () =>
                                                          changeSort(
                                                              property[0] as keyof T
                                                          )
                                                    : () => {}
                                            }
                                        >
                                            <div className="flex space-x-4">
                                                <span>{property[0]}</span>
                                                {property[0] == sort && (
                                                    <div
                                                        className={`h-5 aspect-square ${sortAsc ? '-rotate-180' : ''} duration-200`}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 -960 960 960"
                                                            fill="#e8eaed"
                                                        >
                                                            <path d="M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )
                                )}
                                <td className="absolute top-0 left-0  pointer-events-non"></td>
                            </>
                        ) : (
                            <td></td>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {anyElement() &&
                        internalData.map((element) => (
                            <tr
                                key={element[idPropertyName]}
                                onClick={() =>
                                    onEditButtonClick &&
                                    onEditButtonClick(element[idPropertyName])
                                }
                                className={`group/row relative h-10 w-full ${enable ? 'cursor-pointer' : ''} bg-slate-200 text-sm text-slate-700 duration-200 border-b-2 border-slate-300 hover:border-slate-400 hover:bg-slate-300`}
                            >
                                {Object.entries(element as any).map(
                                    (property) => (
                                        <td key={property[0]} className="px-4">
                                            {property[1] as any}
                                        </td>
                                    )
                                )}
                                <td className="absolute z-10 top-0 left-0 flex h-full w-full select-none justify-end pointer-events-none">
                                    <div className="sticky flex right-0 h-full w-fit space-x-1 items-center px-8 opacity-0 duration-200 group-hover/row:opacity-100">
                                        <button
                                            onClick={(e) => {
                                                onDeleteButtonClick &&
                                                    onDeleteButtonClick(
                                                        element[idPropertyName]
                                                    )
                                                e.stopPropagation()
                                            }}
                                            className="pointer-events-auto h-7 aspect-square flex items-center text-lg justify-center bg-slate-400 border-2 border-white rounded-md text-white hover:bg-rose-500 duration-200"
                                        >
                                            X
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    <tr
                        className={`relative h-10 ${enable ? 'cursor-pointer' : ''} duration-200 hover:bg-slate-300`}
                    >
                        <td>
                            <button
                                className="absolute left-0 top-0 flex h-full w-full items-center px-2 bg-slate-200 text-slate-500 duration-200 hover:text-slate-800 hover:bg-slate-300"
                                onClick={onAddButtonClick}
                                disabled={!enable}
                            >
                                <span className="font-bold">+</span>
                                <span className="text-xs">
                                    {' '}
                                    {addButtonText}{' '}
                                </span>
                            </button>
                        </td>
                        <td className="w-0"></td>
                        {arrayOfLength(propertiesCount() - 1).map(
                            (property, index) => (
                                <td key={index}></td>
                            )
                        )}
                    </tr>
                </tbody>
            </table>
            <div></div>
        </div>
    )
}
