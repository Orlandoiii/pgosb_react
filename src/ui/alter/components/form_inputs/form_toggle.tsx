import { Controller, FieldPath, FieldValues } from 'react-hook-form'

import { useFormContext } from '../form/form_context'
import Toggle from '../buttons/toggle'
import React from 'react'

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
                    <Toggle
                        height="h-8"
                        width="w-16"
                        toggle={field.value}
                        toggleChanged={(toggled) => field.onChange(toggled)}
                    ></Toggle>
                )}
            ></Controller>
        </div>
    )
}

export default FormToggle
