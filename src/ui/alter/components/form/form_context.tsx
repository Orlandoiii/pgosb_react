import {
  Control,
  DeepPartial,
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { createContext, useContext, useState } from "react";
import { getFieldError } from "./form_helpers";

interface FormContextProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  setError: UseFormSetError<T>;
  resetCount: number;
  defaultValues: Readonly<DeepPartial<T>> | undefined;
  isSubmitted: boolean;
  errors: FieldErrors<T>;
  getValues: UseFormGetValues<T>;
}

export const FormContext = createContext<FormContextProps<any> | undefined>(undefined);

export const useFormContext = <T extends FieldValues>() => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  } else return context as FormContextProps<T>;
};

export const useFormFieldContext = <T extends FieldValues, TFieldName extends FieldPath<T> = FieldPath<T>>(
  fieldName: TFieldName
) => {
  const context = useContext(FormContext);

  if (context) {
    const fieldError = getFieldError(context.errors, fieldName)?.message;
    const fieldRegister = context.register(fieldName);
    const isSubmitted = context.isSubmitted;
    const control = context.control;
    const resetCount = context.resetCount;
    const setValue = context.setValue;
    const setError = context.setError;
    const getValues = context.getValues;
    
    return { fieldError, fieldRegister, control, isSubmitted, resetCount, setValue, setError, getValues };
  } else throw new Error("useFormFieldContext must be used within a FormProvider");
};

export function useIsEmpty<T extends FieldValues>(name: FieldPath<T>, control: Control<T>) {
  const value = useWatch({ control, name });
  const [isEmpty, setIsEmpty] = useState(value === undefined || value === "");

  const currentIsEmpty = value === undefined || value === "";
  if (currentIsEmpty !== isEmpty) {
    setIsEmpty(currentIsEmpty);
  }
  return isEmpty;
}
