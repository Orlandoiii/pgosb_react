import React, { useEffect, useState } from 'react'
import Button from '../../core/buttons/Button'
import SelectSearch from '../../core/inputs/SelectSearch'
import { SelectWithSearch } from '../../alter/components/inputs/select_with_search'

type FriendlyNames<T> = {
    [K in keyof T]: string
}

interface AddableTableProps<T> {
    title: string
    addButtonText: string
    onAddButtonClick?: () => void
    enable?: boolean
    data: T[]
    defaultSort?: keyof T
    idPropertyName: string
    nameConverter?: { [K in keyof T]?: string }
    onEditButtonClick?: (id: string) => void
    onDeleteButtonClick?: (id: string) => void
    options?: string[]
    optionsDescription?: string
    options2?: string[]
    optionsDescription2?: string
    onAddOption?: (data: any, data2: any) => void
}

export function AddableTable<T>({
    title = 'Title',
    addButtonText = 'Agregar',
    onAddButtonClick,
    enable = true,
    data = [],
    defaultSort,
    idPropertyName = '',
    nameConverter,
    onEditButtonClick,
    onDeleteButtonClick,
    options,
    options2,
    optionsDescription,
    optionsDescription2,
    onAddOption,
}: AddableTableProps<T>) {
    const [internalData, setInternalData] = useState(data)

    const [sortAsc, setSortAsc] = useState(false)
    const [sort, setSort] = useState(defaultSort ? defaultSort : idPropertyName)

    const [selectedOption, setSelectedOption] = useState('')
    const [selectedOption2, setSelectedOption2] = useState('')
    const [showInnerAdd, setShowInnerAdd] = useState(false)

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

    useEffect(() => {
        setInternalData([
            ...data.sort((a, b) => {
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
                    console.log(typeof valueA)
                    console.log(typeof valueB)
                    throw new Error('Unsupported property type for sorting')
                }
            }),
        ])
    }, [data])

    function changeSort(property: keyof T) {
        if (property == sort) {
            setSortAsc(!sortAsc)
        } else {
            setSort(property)
            setSortAsc(false)
        }
    }

    function anyElement(): boolean {
        return internalData.length > 0
    }

    function propertiesCount(): number {
        return anyElement()
            ? nameConverter
                ? Object.entries(nameConverter as any).length
                : Object.entries(internalData[0] as any).length
            : 0
    }

    function arrayOfLength(length: number): number[] {
        return anyElement() ? Array<number>(length).fill(0) : []
    }

    function blurOptionsHandler() {
        if (!options) return

        let selected: string = options.filter(
            (item) => item === selectedOption
        )[0]

        selected = selected ? selected : ''
        setSelectedOption(selected)
    }

    return (
        <div
            className={`space-y-2 ${enable ? 'opacity-100' : 'opacity-50'} w-full`}
        >
            <div className="text-xl text-slate-700 font-semibold">{title}</div>
            <table className="w-full select-none rounded-lg ">
                <thead className=" rounded-t-lg">
                    <tr
                        key={'headers'}
                        className="relative h-10 w-full border-b rounded-t-lg border-[#0A2F4E] text-sm text-slate-200 bg-[#0A2F4E]"
                    >
                        {anyElement() &&
                            Object.entries(internalData[0] as any).map(
                                (property) => (
                                    <>
                                        {!nameConverter ||
                                        (nameConverter &&
                                            nameConverter.hasOwnProperty(
                                                String(property[0])
                                            )) ? (
                                            <td
                                                key={`${title}-${property[0]}-header`}
                                                className={`  px-4 duration-200 hover:bg-[#1d4368] ${enable ? 'cursor-pointer' : ''}`}
                                                onClick={
                                                    enable
                                                        ? () =>
                                                              changeSort(
                                                                  String(
                                                                      property[0]
                                                                  ) as keyof T
                                                              )
                                                        : () => {}
                                                }
                                            >
                                                <div className="flex space-x-4">
                                                    <span>
                                                        {nameConverter
                                                            ? nameConverter[
                                                                  property[0]
                                                              ]
                                                            : property[0]}
                                                    </span>
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
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                )
                            )}
                        <td className="absolute top-0 left-0  pointer-events-none"></td>
                    </tr>
                </thead>
                <tbody>
                    {anyElement() &&
                        internalData.map((element) => (
                            <tr
                                key={`${title}-${element[idPropertyName]}-row`}
                                onClick={() =>
                                    onEditButtonClick &&
                                    onEditButtonClick(element[idPropertyName])
                                }
                                className={`group/row relative h-10 w-full ${enable ? 'cursor-pointer' : ''} bg-slate-200 text-sm text-slate-700 duration-200 border-b-2 border-slate-300 hover:border-slate-400 hover:bg-slate-300`}
                            >
                                {Object.entries(element as any).map(
                                    (property) =>
                                        !nameConverter ||
                                        nameConverter.hasOwnProperty(
                                            String(property[0])
                                        ) ? (
                                            <td
                                                key={`${title}-${property[0]}-cell`}
                                                className="px-4 whitespace-nowrap "
                                            >
                                                {typeof property[1] === 'object'
                                                    ? Object.entries(
                                                          property[1] as any
                                                      )
                                                          .map((x) => x[1])
                                                          .join(',')
                                                    : (property[1] as any)}
                                            </td>
                                        ) : (
                                            <></>
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
                        className={`relative ${showInnerAdd ? 'h-24' : 'h-12'}  ${enable ? 'cursor-pointer' : ''} duration-200 hover:bg-slate-300 overflow-x-hidden`}
                    >
                        <td>
                            <div
                                className={`${showInnerAdd && options ? '' : '-translate-x-full opacity-0 pointer-events-none'} absolute left-0 top-0 flex h-full w-full items-center bg-slate-200 space-x-4 px-2`}
                            >
                                <SelectWithSearch
                                    description={optionsDescription}
                                    options={options}
                                    controlled={true}
                                    selectedOption={selectedOption}
                                    selectionChange={(e) =>
                                        setSelectedOption(e)
                                    }
                                ></SelectWithSearch>

                                {options2 && options2.length > 0 && (
                                    <SelectWithSearch
                                        description={optionsDescription2}
                                        options={options2}
                                        controlled={true}
                                        selectedOption={selectedOption2}
                                        selectionChange={(e) =>
                                            setSelectedOption2(e)
                                        }
                                    ></SelectWithSearch>
                                )}

                                {/* <SelectSearch
                                    tabIndex={showInnerAdd ? undefined : -1}
                                    inputName={'model'}
                                    options={options!}
                                    searhValue={selectedOption}
                                    setSearhValue={setSelectedOption}
                                    onBlur={blurOptionsHandler}
                                    openUp={false}
                                /> */}

                                <div className="h-full flex space-x-4 items-center pt-4">
                                    <Button
                                        enable={selectedOption != ''}
                                        colorType="bg-[#3C50E0]"
                                        onClick={() => {
                                            onAddOption
                                                ? onAddOption(
                                                      selectedOption,
                                                      selectedOption2
                                                  )
                                                : undefined
                                            setShowInnerAdd(false)
                                            setSelectedOption('')
                                        }}
                                        children={'Guardar'}
                                    ></Button>

                                    <button
                                        onClick={(e) => {
                                            setShowInnerAdd(false)
                                            setSelectedOption('')
                                            e.stopPropagation()
                                        }}
                                        className="pointer-events-auto h-7 aspect-square flex items-center text-lg justify-center bg-slate-400 border-2 border-white rounded-md text-white hover:bg-rose-500 duration-200"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>

                            <button
                                className={`${showInnerAdd && options ? 'translate-x-full opacity-0 pointer-events-none w-[0%]' : 'w-[100%]'} absolute left-0 top-0 flex h-full items-center px-2 bg-slate-200 text-slate-500 duration-200 hover:text-slate-800 hover:bg-slate-300`}
                                onClick={() => {
                                    options
                                        ? setShowInnerAdd(true)
                                        : onAddButtonClick && onAddButtonClick()
                                }}
                                disabled={!enable}
                            >
                                <span className="font-bold">+</span>
                                <span className="text-xs">
                                    {' '}
                                    {addButtonText}{' '}
                                </span>
                            </button>
                        </td>
                        {anyElement() && <td className="w-0"></td>}
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
