import { FieldPath, FieldValues } from 'react-hook-form'

import { InputType } from '../inputs/masks_and_validations/format_and_validation'
import { useFormFieldContext } from '../form/form_context'
import TextInput from '../inputs/text_input'
import React from 'react'

interface FormInputProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> {
    type?: InputType
    fieldName: TFieldName
    description: string
    placeholder?: string
    disable?: boolean
}

function FormInput<T extends FieldValues>({
    type = 'Any',
    fieldName,
    description,
    disable = false,
}: FormInputProps<T>) {
    const { fieldRegister, fieldError, isSubmitted } =
        useFormFieldContext<T>(fieldName)

    return (
        <div>
            <TextInput
                disable={disable}
                type={type}
                description={description}
                error={fieldError}
                isSubmited={isSubmitted}
                {...fieldRegister}
            ></TextInput>
        </div>
    )
}

export default FormInput
