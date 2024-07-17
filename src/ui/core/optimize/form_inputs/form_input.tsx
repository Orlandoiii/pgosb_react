import { FieldPath, FieldValues } from 'react-hook-form'
import { IMask } from 'react-imask'
import { useEffect } from 'react'
import React from 'react'

import { useFormContext } from '../form/form_context'
import { getFieldError } from '../form/form_helpers'

interface FormInputProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> {
    fieldName: TFieldName
    description: string
    mask?: {}
    placeholder?: string
}

function FormInput<T extends FieldValues>({
    fieldName,
    description,
    mask,
    placeholder,
}: FormInputProps<T>) {
    const { register, isSubmitted, resetCount, errors } = useFormContext<T>()

    useEffect(() => {
        const input = document.getElementById(description)
        const imask = IMask(input!, mask)
        imask.updateValue()

        return () => imask.destroy()
    }, [resetCount])

    var fieldError = getFieldError(errors, fieldName)
    var registerField = register(fieldName)

    console.error('here')
    return (
        <div>
            <label htmlFor={description}>{description}</label>
            <input
                id={description}
                {...registerField}
                placeholder={placeholder}
                className={`${isSubmitted ? '' : ''}`}
            />

            {fieldError && <span>{fieldError?.message}</span>}
        </div>
    )
}

export default FormInput
