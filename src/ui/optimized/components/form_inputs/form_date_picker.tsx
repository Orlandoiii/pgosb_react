import { Controller, FieldPath, FieldValues } from "react-hook-form";
import React from "react";

import { useFormFieldContext } from "../form/form_context";
import DateTimePicker from "../../../core/datetime_picker/DateTimePicker";
import InputController from "../inputs/input_controller";

interface Props<T extends FieldValues, TFieldName extends FieldPath<T> = FieldPath<T>> {
  fieldName: TFieldName;
  description?: string;
  placeholder?: string;
  disable?: boolean;
}

export function FormDatePicker<T extends FieldValues>({
  fieldName,
  description = '',
  disable = false,
}: Props<T>) {
  const { control, fieldError, isSubmitted } = useFormFieldContext<T>(fieldName);

  return (
    <div className="w-full">
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <DateTimePicker
              onChange={(date) => {
                field.onChange(date);
              }}
              selected={field.value}
              height='h-10'
              timeInterval={1}
            />
            <InputController
              description={description}
              error={fieldError}
              disable={disable}
              isSubmited={isSubmitted}
            />
          </div>
        )}
      ></Controller>

    </div>
  );
}
