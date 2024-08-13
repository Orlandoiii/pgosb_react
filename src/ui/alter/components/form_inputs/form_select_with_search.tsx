import { Controller, FieldPath, FieldValues } from 'react-hook-form'
import { useRef } from 'react'

import { useValueOrAsyncFunc } from '../../hooks/use_value_or_async_func'
import { SelectWithSearch } from '../inputs/select_with_search'
import { useFormFieldContext } from '../form/form_context'
import React from 'react'

interface FormSelectWithSearchProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> {
    fieldName: TFieldName
    description: string
    options: string[] | (() => Promise<string[]>)
    optionsDeps?: any[]
    placeholder?: string
    addClearButton?: boolean
    selectionChange?: (option: string) => void
}

function FormSelectWithSearch<T extends FieldValues>({
    fieldName,
    description,
    options,
    optionsDeps,
    selectionChange,
    addClearButton = false,
}: FormSelectWithSearchProps<T>) {
    const { control, fieldError, isSubmitted } =
        useFormFieldContext<T>(fieldName)

    const selectContainer = useRef<HTMLDivElement>(null)
    const { value, isLoading } = useValueOrAsyncFunc(options, optionsDeps)

    console.log(value)
    return (
        <div
            className="relative w-full rounded-md overflow-hidden"
            ref={selectContainer}
        >
            <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                    <SelectWithSearch
                        description={description}
                        options={value}
                        selectedOption={field.value}
                        selectionChange={(option) => {
                            field.onChange(option)
                            selectionChange && selectionChange(option)
                        }}
                        error={fieldError}
                        isSubmited={isSubmitted}
                        isLoading={isLoading}
                        addClearButton={addClearButton}
                    ></SelectWithSearch>
                )}
            ></Controller>
        </div>
    )
}

export default FormSelectWithSearch
