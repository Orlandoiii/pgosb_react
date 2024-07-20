
import React, { ComponentPropsWithoutRef, useState } from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'
import { getFieldError, useCustomFormContext } from '../context/CustomFormContext'
import { useValueOrAsyncFunc } from '../hooks/useValueOrAsyncFunc'
import SelectSearch from './SelectSearch'
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

let counter = 0;

function FormSelectSearch<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
>({ fieldName,
    options,
    description,
    openUp = false,
    ...rest

}: FormSelectProps<T>) {

    counter++;
    logger.log("Renderizo search select", counter);

    const { register, setValue, errors, isSubmitted } = useCustomFormContext<T>()


    const fieldError = getFieldError(errors, fieldName)

    //const [searhValue, setSearhValue] = useState('');

    const selectOptions = useValueOrAsyncFunc(options)

    const { ref, onChange, ...restRegister } = register(fieldName);

    const [searhValue, setSearhValue] = useState("");


    //logger.error("ERROR EN SELECT:", fieldError?.message)

    return (
        <SelectSearch

            refCallback={ref}
            openUp={openUp}
            label={description}
            inputName={fieldName}
            options={selectOptions}
            useStrongErrColor={isSubmitted}
            searhValue={searhValue}
            setSearhValue={setSearhValue}
            //value={selectedValue}
            {...restRegister}
            {...rest}
            errMessage={fieldError?.message}
            onChange={(e) => {
                onChange(e);
                setValue(fieldName, e.target.value as any);
                //setSearhValue(e.target.value);
            }}
            onSelected={(v) => {
                const result = new Event('change', { bubbles: false });
                Object.defineProperty(result, 'target', {
                    value: v,
                    writable: false,
                });
                onChange(result)
                setValue(fieldName, v as any);
                //setSearhValue(v)
            }}
        />
    )
}

export default FormSelectSearch
