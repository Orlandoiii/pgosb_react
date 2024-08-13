import { DeepPartial, FieldError, FieldErrors, FieldPath, FieldValues } from "react-hook-form";

export function getFieldError<T extends FieldValues, TFieldName extends FieldPath<T> = FieldPath<T>>(
  errors: FieldErrors<T>,
  fieldpath: TFieldName
): FieldError | undefined {
  var keys = (fieldpath as string).split(".");
  var keyscount = keys.length;
  var error: FieldError | undefined;

  keys.forEach((key, index) => {
    if (errors == undefined) return undefined;

    if (index == keyscount - 1) error = errors[key] as FieldError | undefined;
    else errors = errors[key] as FieldErrors<T>;
  });

  return error;
}

export function getFieldValue<T extends FieldValues, TFieldName extends FieldPath<T> = FieldPath<T>>(
  values: Readonly<DeepPartial<T>> | undefined,
  fieldpath: TFieldName
): any {
  var keys = (fieldpath as string).split(".");
  var keyscount = keys.length;
  var value: any;

  keys.forEach((key, index) => {
    if (values == undefined) return undefined;

    if (index == keyscount - 1) value = values[key];
    else values = values[key];
  });

  return value;
}
