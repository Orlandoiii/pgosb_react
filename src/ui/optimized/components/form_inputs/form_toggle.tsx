import { Controller, FieldPath, FieldValues } from "react-hook-form";
import React from "react";

import { useFormContext } from "../form/form_context";
import Toggle, { ToggleProps } from "../buttons/toggle";

interface FormToggleProps<T extends FieldValues, TFieldName extends FieldPath<T> = FieldPath<T>> extends ToggleProps {
  fieldName: TFieldName;
  description?: string;
} 

function FormToggle<T extends FieldValues>({ fieldName, description = "", ...rest }: FormToggleProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <div>
      {description && <label htmlFor={description}>{description}</label>}

      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Toggle {...rest} height={rest.height ?? "h-8"} width={rest.width ?? "w-16"} toggle={field.value} toggleChanged={(toggled) => field.onChange(toggled)}></Toggle>
        )}
      ></Controller>
    </div>
  );
}

export default FormToggle;
