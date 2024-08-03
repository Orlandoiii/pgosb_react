import React, { ComponentPropsWithoutRef } from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'
import { useCustomFormContext } from '../context/CustomFormContext'
import { useValueOrAsyncFunc } from '../hooks/useValueOrAsyncFunc'
import Select from './Select'
import logger from '../../../logic/Logger/logger'

interface FormSelectProps<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
> extends ComponentPropsWithoutRef<'input'> {
    fieldName: TFieldName
    options: string[] | (() => Promise<string[]>)
    description: string
    openUp?: boolean
}

function FormSelect<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
>({
    fieldName,
    options,
    description,
    openUp = false,
    value,
    ...rest
}: FormSelectProps<T>) {
    const { register, setValue, errors } = useCustomFormContext<T>()

    const { value: selectOptions, isLoading } = useValueOrAsyncFunc(options)
    const { ref, ...restRegister } = register(fieldName)
    //Esta aqui para forzar el render del select
    //const [selectedValue, setSelectedValue] = useState(value && value != "" ? value : options[0]);

    return (
        <div className="relative w-full">
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
                    setValue(fieldName, v as any)
                    //setSelectedValue(v);
                }}
            />
            {isLoading && (
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-end px-6">
                    <div className="animate-pulse">
                        <svg
                            className="w-32 fill-gray-600 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 80 80"
                        >
                            <path d="M17.94,17.94C12.29,23.58,8.8,31.39,8.8,40s3.5,16.42,9.14,22.06l-6.22,6.22C4.48,61.05,0,51.05,0,40c0-11.05,4.48-21.05,11.71-28.28L17.94,17.94z" />
                            <path d="M80,40c0,11.05-4.48,21.05-11.72,28.28l-6.22-6.22c5.65-5.64,9.14-13.45,9.14-22.06s-3.49-16.42-9.14-22.06l6.22-6.22C75.52,18.95,80,28.96,80,40z" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormSelect
