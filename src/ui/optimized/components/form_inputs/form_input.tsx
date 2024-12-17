import { FieldPath, FieldValues } from "react-hook-form";
import React from "react";

import { InputType } from "../inputs/masks_and_validations/format_and_validation";
import { useFormFieldContext } from "../form/form_context";
import TextInput from "../inputs/text_input";

interface FormInputProps<T extends FieldValues, TFieldName extends FieldPath<T> = FieldPath<T>> {
  type?: InputType;
  fieldName: TFieldName;
  description?: string;
  placeholder?: string;
  disable?: boolean;
  minLength?: number;
  maxLength?: number;
}

function FormInput<T extends FieldValues>({
  type = "Any",
  fieldName,
  description = '',
  disable = false,
  minLength = 0,
  maxLength = 200,
}: FormInputProps<T>) {
  const { fieldRegister, fieldError, isSubmitted } = useFormFieldContext<T>(fieldName);

  return (
    <div className="h-full w-full">
      <TextInput
        disable={disable}
        type={type}
        description={description}
        error={fieldError}
        isSubmited={isSubmitted}
        {...fieldRegister}
        minLength={minLength}
        maxLength={maxLength}
      ></TextInput>
    </div>
  );
}

export default FormInput;
