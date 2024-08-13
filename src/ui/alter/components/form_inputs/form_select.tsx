import { Controller, FieldPath, FieldValues } from 'react-hook-form'
import { useRef } from 'react'

import { useFormFieldContext } from '../form/form_context'
import { Select } from '../inputs/select'
import { useValueOrAsyncFunc } from '../../hooks/use_value_or_async_func'
import React from 'react'

interface FormSelectProps<
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

function FormSelect<T extends FieldValues>({
    fieldName,
    description,
    options,
    optionsDeps,
    selectionChange,
    addClearButton = false,
}: FormSelectProps<T>) {
    const { control, fieldError, isSubmitted } =
        useFormFieldContext<T>(fieldName)

    const selectContainer = useRef<HTMLDivElement>(null)
    const { value, isLoading } = useValueOrAsyncFunc(options, optionsDeps)
    console.log('Select rerendered')

    return (
        <div
            className="relative w-full rounded-md overflow-hidden"
            ref={selectContainer}
        >
            <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                    <Select
                        description={description}
                        options={value}
                        selectedOption={field.value}
                        selectionChange={(option) => {
                            console.log('changedOption', option)

                            field.onChange(option)
                            selectionChange && selectionChange(option)
                        }}
                        error={fieldError}
                        isSubmited={isSubmitted}
                        isLoading={isLoading}
                        addClearButton={addClearButton}
                    ></Select>
                )}
            ></Controller>
        </div>
    )
}

export default FormSelect
