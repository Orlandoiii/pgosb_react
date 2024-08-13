import { FieldPath, FieldValues } from 'react-hook-form'

import { useFormFieldContext } from '../form/form_context'
import TextInput from '../inputs/text_input'
import React from 'react'

interface FormTextAreaProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> {
    fieldName: TFieldName
    description: string
    placeholder?: string
    disable?: boolean
}

function FormTextArea<T extends FieldValues>({
    fieldName,
    description,
    disable = false,
}: FormTextAreaProps<T>) {
    const { fieldRegister, fieldError, isSubmitted } =
        useFormFieldContext<T>(fieldName)

    return (
        <div>
            <TextInput
                disable={disable}
                description={description}
                error={fieldError}
                isSubmited={isSubmitted}
                {...fieldRegister}
            ></TextInput>
        </div>
    )
}

export default FormTextArea
