
import React, { ComponentPropsWithoutRef, useState } from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'
import { useCustomFormContext } from '../context/CustomFormContext'
import { useValueOrAsyncFunc } from '../hooks/useValueOrAsyncFunc'
import Select from './Select'
import logger from '../../../logic/Logger/logger'



interface FormSelectProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> extends ComponentPropsWithoutRef<"input"> {
    fieldName: TFieldName
    options: string[] | (() => Promise<string[]>)
    description: string
    openUp?: boolean,
}

function FormSelect<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
>({ fieldName,
    options,
    description,
    openUp = false,
    value,
    ...rest

}: FormSelectProps<T>) {
    const { register, setValue, errors } = useCustomFormContext<T>()

    const selectOptions = useValueOrAsyncFunc(options)
    const { ref, ...restRegister } = register(fieldName);
    //Esta aqui para forzar el render del select
    //const [selectedValue, setSelectedValue] = useState(value && value != "" ? value : options[0]);

    logger.error("Form SELECT", errors);

    return (
        <Select

            refCallback={ref}
            openUp={openUp}
            label={description}
            inputName={fieldName}
            options={selectOptions}

            //value={value}
            {...restRegister}
            {...rest}
            onSelected={(v) => {
                setValue(fieldName, v as any);
                //setSelectedValue(v);
            }}
        />
    )
}

export default FormSelect
