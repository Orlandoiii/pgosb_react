import { Controller, FieldPath, FieldValues } from 'react-hook-form'
import React, { ComponentPropsWithoutRef } from 'react'
import {
    useCustomFormContext,
} from '../context/CustomFormContext'
import logger from '../../../logic/Logger/logger'
import Toggle from '../buttons/Toggle'

interface FormInputProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> extends ComponentPropsWithoutRef<'input'> {
    fieldName: TFieldName
}

function FormToggle<T extends FieldValues>({
    fieldName,
    ...rest
}: FormInputProps<T>) {
    const { control } = useCustomFormContext<T>()

    // var fieldError = getFieldError(errors, fieldName)
    // var { ref, ...registerField } = register(fieldName)

    logger.log('Renderizando FormInput')

    return (
        <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
                // <input
                //     type="checkbox"
                //     checked={field.value}
                //     onChange={(e) => field.onChange}
                //     onBlur={field.onBlur}
                //     name={field.name}
                //     ref={field.ref}
                // />

                <Toggle
                    active={field.value}
                    onClick={() => field.onChange(!field.value)}
                ></Toggle>

                // <Input
                //     inputName={fieldName}
                //     label={description}
                //     placeholder={placeholder}
                //     errMessage={fieldError?.message}
                //     useStrongErrColor={isSubmitted}
                //     maskDefinition={mask}
                //     refCallback={ref}
                //     resetCount={resetCount}
                //     {...registerField}
                //     {...rest}
                // />
            )}
        ></Controller>
    )
}

export default FormToggle
