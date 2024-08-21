import { FieldPath, FieldValues } from 'react-hook-form'
import React, { ComponentPropsWithoutRef, ReactNode } from 'react'
import {
    getFieldError,
    useCustomFormContext,
} from '../context/CustomFormContext'
import logger from '../../../logic/Logger/logger'
import Input from './Input'

interface FormInputProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> extends ComponentPropsWithoutRef<'input'> {
    fieldName: TFieldName
    description: string
    mask?: {}
    placeholder?: string,
    useUppercase?:boolean,
    icons?: ReactNode
}

function FormInput<T extends FieldValues>({
    fieldName,
    description,
    mask,
    placeholder,
    icons,
    useUppercase = true,

    ...rest
}: FormInputProps<T>) {
    const { register, isSubmitted, resetCount, errors } =
        useCustomFormContext<T>()
    console.log(errors)

    var fieldError = getFieldError(errors, fieldName)
    var { ref, ...registerField } = register(fieldName)

    logger.log('Renderizando FormInput', errors)

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
            icons={icons}
            useUppercase={useUppercase}
            {...registerField}
            {...rest}
        />
    )
}

export default FormInput
