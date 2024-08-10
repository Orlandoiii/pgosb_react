import { FieldPath, FieldValues } from 'react-hook-form'
import React, { ComponentPropsWithoutRef, ReactNode } from 'react'
import {
    getFieldError,
    useCustomFormContext,
} from '../context/CustomFormContext'
import logger from '../../../logic/Logger/logger'
import Input from './Input'
import TextArea from './TextArea'

interface FormTextAreaProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> extends ComponentPropsWithoutRef<'textarea'> {
    fieldName: TFieldName
    description?: string
    mask?: {}
    placeholder?: string
    icons?: ReactNode
}

function FormTextArea<T extends FieldValues>({
    fieldName,
    description,
    mask,
    placeholder,
    icons,
    ...rest
}: FormTextAreaProps<T>) {
    const { register, isSubmitted, resetCount, errors } =
        useCustomFormContext<T>()
    console.log(errors)

    var fieldError = getFieldError(errors, fieldName)
    var { ref, ...registerField } = register(fieldName)

    logger.log('Renderizando FormInput', errors)

    return (
        <TextArea
            inputName={fieldName}
            label={description}
            placeholder={placeholder}
            errMessage={fieldError?.message}
            useStrongErrColor={isSubmitted}
            maskDefinition={mask}
            refCallback={ref}
            resetCount={resetCount}
            icons={icons}
            {...registerField}
            {...rest}
        />
    )
}

export default FormTextArea
