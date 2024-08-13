import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { z } from "zod";

import { FormContext } from "./form_context";

interface FormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  initValue?: T | null;
  onSubmit: (data: z.infer<z.ZodSchema<T>>) => void;
  children: ReactNode;
  className?: string;
}

export default function Form<T extends FieldValues>({
  schema,
  initValue = null,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  const [resetCount, setResetCount] = useState(0);

  const methods = useForm<T>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: (initValue ?? {}) as DefaultValues<T>,
  });

  function formReset(event: React.FormEvent<HTMLFormElement>) {
    methods.reset(getDefaults(schema));
    setResetCount(resetCount + 1);
    event.preventDefault();
  }

  return (
    <FormContext.Provider
      value={{
        register: methods.register,
        control: methods.control,
        setValue: methods.setValue,
        setError: methods.setError,
        resetCount: resetCount,
        defaultValues: methods.formState.defaultValues,
        isSubmitted: methods.formState.isSubmitted,
        errors: methods.formState.errors,
      }}
    >
      <form
        onSubmit={methods.handleSubmit((data) => onSubmit(schema.parse(data)))}
        onReset={formReset}
        className={`${className}`}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

function getDefaults<T extends FieldValues>(schema: z.ZodType<T, z.ZodTypeDef, T>): DefaultValues<T> {
  if (schema instanceof z.ZodObject) {
    const entries = Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) {
        return [key, value._def.defaultValue()];
      } else if (value instanceof z.ZodObject) {
        return [key, getDefaults(value)];
      } else return [key, undefined];
    });

    return Object.fromEntries(entries) as DefaultValues<T>;
  }
  return {} as DefaultValues<T>;
}
