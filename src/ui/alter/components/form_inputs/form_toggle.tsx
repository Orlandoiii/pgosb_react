import { Controller, FieldPath, FieldValues } from 'react-hook-form'

import { useFormContext } from '../form/form_context'
import Toggle from '../buttons/toggle'
import React from 'react'

interface FormToggleProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> {
    fieldName: TFieldName
    description?: string
    height?: string
    width?: string
    option1?: string
    option2?: string
}

function FormToggle<T extends FieldValues>({
    fieldName,
    description,
    height = "h-8",
    width = "w-16",
    option1,
    option2
}: FormToggleProps<T>) {
    const { control } = useFormContext<T>()

    return (
        <div>
            {description && <label htmlFor={description}>{description}</label>}

            <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                    <Toggle
                        height={height}
                        width={width}
                        toggle={field.value}
                        option1={option1}
                        option2={option2}
                        toggleChanged={(toggled) => field.onChange(toggled)}
                    ></Toggle>
                )}
            ></Controller>
        </div>
    )
}

export default FormToggle
