import { Controller, FieldPath, FieldValues } from 'react-hook-form'

import { useFormFieldContext } from '../form/form_context'
import React from 'react'
import Chip from '../data_presenters/chip'

interface Props<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> {
    fieldName: TFieldName
    disable?: boolean
}

function FormChips<T extends FieldValues>({
    fieldName,
    disable = false,
}: Props<T>) {
    const { control, fieldError, isSubmitted } =
        useFormFieldContext<T>(fieldName)

    return (
        <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
                <div className="flex flex-wrap gap-y-2 space-x-4 w-full translate-y-3">
                    {field.value && (field.value as string[]).length && field.value.map((item) => (
                        <Chip
                            text={item}
                            onDelete={(e)=> field.onChange((field.value as string[]).filter(x => x != e))}
                        ></Chip>
                    ))}
                </div>
            )}
        ></Controller>
    )
}

export default FormChips
