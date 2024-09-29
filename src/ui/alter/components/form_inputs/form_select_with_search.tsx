import { Controller, FieldPath, FieldValues } from 'react-hook-form'
import { useRef } from 'react'

import { useValueOrAsyncFunc } from '../../hooks/use_value_or_async_func'
import { SelectWithSearch } from '../inputs/select_with_search'
import { useFormFieldContext } from '../form/form_context'
import React from 'react'

interface FormSelectWithSearchProps<T extends FieldValues, O, TFieldName extends FieldPath<T> = FieldPath<T>> {
  fieldName: TFieldName;
  description: string;
  options: O[] | (() => Promise<O[]>);
  displayKeys?: (keyof O)[];
  valueKey?: keyof O;
  optionsDeps?: any[];
  placeholder?: string;
  fatherLoading?: boolean;
  allowNewValue?: boolean;
  addClearButton?: boolean;
  selectionChange?: (option: string) => void;
}

function FormSelectWithSearch<T extends FieldValues, O>({
  fieldName,
  description,
  options,
  displayKeys,
  valueKey,
  optionsDeps,
  selectionChange,
  allowNewValue = false,
  fatherLoading = false,
  addClearButton = false,
}: FormSelectWithSearchProps<T, O>) {
  const { control, fieldError, isSubmitted } = useFormFieldContext<T>(fieldName);
  const { value, isLoading } = useValueOrAsyncFunc(options, optionsDeps);

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => {
         
          return (
            <SelectWithSearch
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
              allowNewValue={allowNewValue}
              addClearButton={addClearButton}
            ></SelectWithSearch>
          )
        }}
      ></Controller>
    </div>
  );
}

export default FormSelectWithSearch;
