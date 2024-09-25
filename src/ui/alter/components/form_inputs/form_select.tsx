import { Controller, FieldPath, FieldValues } from 'react-hook-form'
import { useRef } from 'react'

import { useFormFieldContext } from '../form/form_context'
import { Select } from '../inputs/select'
import { useValueOrAsyncFunc } from '../../hooks/use_value_or_async_func'
import React from 'react'

interface FormSelectProps<T extends FieldValues, O, TFieldName extends FieldPath<T> = FieldPath<T>> {
    fieldName: TFieldName;
    description: string;
    options: O[] | (() => Promise<O[]>);
    displayKeys?: (keyof O)[];
    valueKey?: keyof O;
    optionsDeps?: any[];
    placeholder?: string;
    fatherLoading?: boolean;
    addClearButton?: boolean;
    selectionChange?: (option: string) => void;
}

function FormSelect<T extends FieldValues, O>({
    fieldName,
    description,
    options,
    displayKeys,
    valueKey,
    optionsDeps,
    selectionChange,
    fatherLoading = false,
    addClearButton = false,
}: FormSelectProps<T, O>) {
    const { control, fieldError, isSubmitted } = useFormFieldContext<T>(fieldName);

    const selectContainer = useRef<HTMLDivElement>(null);
    const { value, isLoading } = useValueOrAsyncFunc(options, optionsDeps);

    return (
        <div className="relative w-full rounded-lg overflow-hidden" ref={selectContainer}>
            <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                    <Select
                        description={description}
                        options={value}
                        displayKeys={displayKeys}
                        valueKey={valueKey}
                        selectedOption={field.value}
                        selectionChange={(option) => {
                            field.onChange(option);
                            selectionChange && selectionChange(option);
                        }}
                        error={fieldError}
                        isSubmited={isSubmitted}
                        isLoading={isLoading || fatherLoading}
                        addClearButton={addClearButton}
                    ></Select>
                )}
            ></Controller>
        </div>
    );
}

export default FormSelect;
