import {
    Control,
    DeepPartial,
    FieldErrors,
    FieldValues,
    UseFormRegister,
    UseFormSetValue,
    DefaultValues,
    useForm
} from 'react-hook-form'
import React, { createContext, useContext, useState, PropsWithChildren } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface FormContextProps<T extends FieldValues> {
    register: UseFormRegister<T>
    control: Control<T>
    setValue: UseFormSetValue<T>
    reset: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    resetCount: number
    defaultValues: Readonly<DeepPartial<T>> | undefined
    isSubmitted: boolean
    errors: FieldErrors<T>
}

export const CustomFormContext = createContext<FormContextProps<any> | undefined>(
    undefined
)


interface CustomFormProps<T extends FieldValues> {
    schema: z.ZodSchema<T>
    initValue?: T | null
    onSubmit: (data: z.infer<z.ZodSchema<T>>) => void
}

function getDefaults<T extends FieldValues>(
    schema: z.ZodType<T, z.ZodTypeDef, T>
): DefaultValues<T> {
    if (schema instanceof z.ZodObject) {
        const entries = Object.entries(schema.shape).map(([key, value]) => {
            if (value instanceof z.ZodDefault) {
                return [key, value._def.defaultValue()]
            } else if (value instanceof z.ZodObject) {
                return [key, getDefaults(value)]
            } else return [key, undefined]
        })

        return Object.fromEntries(entries) as DefaultValues<T>
    }
    return {} as DefaultValues<T>
}

export default function CustomFormProvider<T extends FieldValues>({
    schema,
    initValue = null,
    onSubmit,
    children
}: PropsWithChildren<CustomFormProps<T>>) {
    const [resetCount, setResetCount] = useState(0)

    const methods = useForm<T>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues: (initValue ?? {}) as DefaultValues<T>,
    })

    function formReset() {
        methods.reset(getDefaults(schema))
        setResetCount(resetCount + 1)
    }

    return (
        <CustomFormContext.Provider
            value={{
                register: methods.register,
                control: methods.control,
                setValue: methods.setValue,
                reset: formReset,
                resetCount: resetCount,
                defaultValues: methods.formState.defaultValues,
                isSubmitted: methods.formState.isSubmitted,
                errors: methods.formState.errors,
            }}
        >
            <form
                onSubmit={methods.handleSubmit((data) =>
                    onSubmit(schema.parse(data))
                )}
            >
                {children}
            </form>
        </CustomFormContext.Provider>
    )
}







export function useCustomFormContext() {
    const context = useContext(CustomFormContext)
    return context;
}


