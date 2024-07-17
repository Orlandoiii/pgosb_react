import { FieldPath, FieldValues, PathValue } from 'react-hook-form'
import React from 'react'

import { useValueOrAsyncFunc } from '../hooks/use_value_or_async_func'
import { useFormContext } from '../form/form_context'
import { getFieldError } from '../form/form_helpers'

interface FormSelectProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> {
    fieldName: TFieldName
    options: string[] | (() => Promise<string[]>)
    description: string
    placeholder?: string
}

function FormSelect<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
>({ fieldName, options, description, placeholder }: FormSelectProps<T>) {
    const { register, setValue, isSubmitted, errors } = useFormContext<T>()

    const selectOptions = useValueOrAsyncFunc(options)
    const fieldError = getFieldError(errors, fieldName)
    //   setValue("" as TFieldName, "" as PathValue<T, TFieldName>);

    return (
        <div>
            <label htmlFor={description}>{description}</label>
            <input
                id={description}
                {...register(fieldName)}
                placeholder={placeholder}
            />
            {fieldError && (
                <span className={`${isSubmitted ? '' : ''}`}>
                    {fieldError?.message}
                </span>
            )}
        </div>
    )
}

export default FormSelect
