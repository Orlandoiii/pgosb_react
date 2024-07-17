import { Controller, FieldPath, FieldValues } from 'react-hook-form'
import React from 'react'

import { useFormContext } from '../form/form_context'

interface FormToggleProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> {
    fieldName: TFieldName
    description: string
}

function FormToggle<T extends FieldValues>({
    fieldName,
    description,
}: FormToggleProps<T>) {
    const { control } = useFormContext<T>()

    return (
        <div>
            <label htmlFor={description}>{description}</label>

            <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                    <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                    />
                )}
            ></Controller>
        </div>
    )
}

export default FormToggle
