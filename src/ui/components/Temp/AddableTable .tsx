import React, { useEffect, useState } from 'react'

interface AddableTableProps<T> {
    title: string
    addButtonText: string
    onAddButtonClick: () => void
    enable?: boolean
    data: T[]
    idPropertyName: string
}

export function AddableTable<T>({
    title = 'Title',
    addButtonText = 'Agregar',
    onAddButtonClick,
    enable = true,
    data = [],
    idPropertyName = '',
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
                        : valueB.localeCompare(valueA) // String comparison
                } else if (
                    typeof valueA === 'number' &&
                    typeof valueB === 'number'
                ) {
                    return sortAsc ? valueA - valueB : valueB - valueA // Numeric comparison
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
            <table className="w-full select-none">
                <thead>
                    <tr className="h-10 border-b border-[#0A2F4E] text-sm text-slate-600">
                        {anyElement() ? (
                            Object.entries(internalData[0] as any).map(
                                (property) => (
                                    <td
                                        key={property[0]}
                                        className={`w-24 px-4 duration-200 hover:bg-slate-200 ${enable ? 'cursor-pointer' : ''}`}
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
                            )
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
                                className={`group/row relative h-10 ${enable ? 'cursor-pointer' : ''} text-sm text-slate-700 duration-200 hover:bg-slate-300`}
                            >
                                {Object.entries(element as any).map(
                                    (property) => (
                                        <td
                                            key={property[0]}
                                            className="px-4 hover:border hover:border-slate-600"
                                        >
                                            {property[1] as any}
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                    <tr
                        className={`relative h-10 ${enable ? 'cursor-pointer' : ''} duration-200 hover:bg-slate-300`}
                    >
                        <td>
                            <button
                                className="absolute left-0 top-0 flex h-full w-full items-center px-2 text-slate-500 duration-200 hover:text-slate-800"
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
