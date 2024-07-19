import { FieldPath, FieldValues } from 'react-hook-form'
import React, { ComponentPropsWithoutRef } from 'react'
import { getFieldError, useCustomFormContext } from '../context/CustomFormContext'
import logger from '../../../logic/Logger/logger'
import Input from './Input'


interface FormInputProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> extends ComponentPropsWithoutRef<"input"> {
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
    ...rest
}: FormInputProps<T>) {
    const { register, isSubmitted, resetCount, errors } = useCustomFormContext<T>()


    var fieldError = getFieldError(errors, fieldName)
    var { ref, ...registerField } = register(fieldName)

    logger.log("Renderizando FormInput")

    return (

        <Input
            inputName={fieldName}
            label={description}
            placeholder={placeholder}
            errMessage={fieldError?.message}
            useStrongErrColor={isSubmitted}
            maskDefinition={mask}
            refCallback={ref}
            resetCount={resetCount}
            {...registerField}
            {...rest}
        />



    )
}

export default FormInput