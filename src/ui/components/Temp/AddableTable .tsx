import React, { useEffect, useState } from 'react'

class Unidad {
    constructor(id: string, nombre: string, placa: string, bombero: number) {
        this.Id = id
        this.Nombre = nombre
        this.Placa = placa
        this.Bomberos = bombero
    }

    Id: string
    Nombre: string
    Placa: string
    Bomberos: number
}

interface AddableTableProps {
    title: string
    addButtonText: string
    onAddButtonClick: () => void
    enable?: boolean
}

export function AddableTable({
    title = 'Title',
    addButtonText = 'Agregar',
    onAddButtonClick,
    enable = true,
}: AddableTableProps) {
    var [temp, setTemp] = useState([
        new Unidad('1354', 'Camion de bomberos principal', 'GDJ85S', 5),
        new Unidad('49843', 'Camion de bomberos secundario', 'GDJ85S', 2),
    ])

    var [sortAsc, setSortAsc] = useState(false)
    var [sort, setSort] = useState('')

    useEffect(() => {
        if (sort == '') return
        setTemp([
            ...temp.sort((a, b) => {
                const valueA = a?.[sort as keyof Unidad]
                const valueB = b?.[sort as keyof Unidad]

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

    function changeSort(property: keyof Unidad) {
        if (property == sort) {
            setSortAsc(!sortAsc)
        } else {
            setSort(property)
            setSortAsc(false)
        }
    }

    function anyElement(): boolean {
        return temp.length > 0
    }

    function propertiesCount(): number {
        return anyElement() ? Object.entries(temp[0]).length : 0
    }

    function arrayOfLength(length: number): number[] {
        return anyElement() ? Array<number>(length).fill(0) : []
    }

    console.log(temp)

    return (
        <div className={`space-y-2 ${enable ? 'opacity-100' : 'opacity-50'}`}>
            <div className="text-xl text-slate-700 font-semibold">{title}</div>
            <table className="w-full select-none">
                <thead>
                    <tr className="h-10 border-b border-[#0A2F4E] text-sm text-slate-600">
                        {anyElement() ? (
                            Object.entries(temp[0]).map((property) => (
                                <td
                                    key={property[0]}
                                    className={`w-24 px-4 duration-200 hover:bg-slate-200 ${enable ? 'cursor-pointer' : ''}`}
                                    onClick={
                                        enable
                                            ? () =>
                                                  changeSort(
                                                      property[0] as keyof Unidad
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
                            ))
                        ) : (
                            <td></td>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {anyElement() &&
                        temp.map((element) => (
                            <tr
                                key={element.Id}
                                className={`group/row relative h-10 ${enable ? 'cursor-pointer' : ''} text-sm text-slate-700 duration-200 hover:bg-slate-300`}
                            >
                                {Object.entries(element).map((property) => (
                                    <td
                                        key={property[0]}
                                        className="px-4 hover:border hover:border-slate-600"
                                    >
                                        {property[1]}
                                    </td>
                                ))}
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
