import {
    Control,
    DeepPartial,
    FieldErrors,
    FieldValues,
    FieldError,
    FieldPath,
    UseFormRegister,
    UseFormSetValue,
    DefaultValues,
    useForm,
} from 'react-hook-form'
import React, {
    createContext,
    useContext,
    useState,
    PropsWithChildren,
} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import logger from '../../../logic/Logger/logger'

export function getFieldError<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
>(errors: FieldErrors<T>, fieldpath: TFieldName): FieldError | undefined {
    var keys = (fieldpath as string).split('.')
    var keyscount = keys.length
    var error: FieldError | undefined

    keys.forEach((key, index) => {
        if (errors == undefined) return undefined

        if (index == keyscount - 1)
            error = errors[key] as FieldError | undefined
        else errors = errors[key] as FieldErrors<T>
    })

    return error
}

export function getFieldValue<
    T extends FieldValues,
    TFieldName extends FieldPath<T> = FieldPath<T>,
>(values: Readonly<DeepPartial<T>> | undefined, fieldpath: TFieldName): any {
    var keys = (fieldpath as string).split('.')
    var keyscount = keys.length
    var value: any

    keys.forEach((key, index) => {
        if (values == undefined) return undefined

        if (index == keyscount - 1) value = values[key]
        else values = values[key]
    })

    return value
}

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

export const CustomFormContext = createContext<
    FormContextProps<any> | undefined
>(undefined)

interface CustomFormProps<T extends FieldValues> {
    schema: z.ZodSchema<T>
    initValue?: T | null
    onSubmit: (data: z.infer<z.ZodSchema<T>>) => void
    classStyle?: string | undefined
}

export function getDefaults<T extends FieldValues>(schema: z.ZodType<any>): T {
    if (schema instanceof z.ZodObject) {
        const entries = Object.entries(schema.shape).map(([key, value]) => {
            if (value instanceof z.ZodDefault) {
                return [key, value._def.defaultValue()]
            } else if (value instanceof z.ZodObject) {
                return [key, getDefaults(value)]
            } else return [key, undefined]
        })

        return Object.fromEntries(entries) as T
    }
    return {} as T
}

export default function CustomForm<T extends FieldValues>({
    schema,
    initValue = null,
    onSubmit,
    children,
    classStyle,
}: PropsWithChildren<CustomFormProps<T>>) {
    const [resetCount, setResetCount] = useState(0)

    const methods = useForm<T>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues: (initValue ?? {}) as DefaultValues<T>,
    })

    function formReset() {
        methods.reset(getDefaults<T>(schema))
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
                noValidate
                className={classStyle}
                onSubmit={methods.handleSubmit((data) => {
                    logger.log('On Submit de la forma')
                    onSubmit(schema.parse(data))
                })}
            >
                {children}
            </form>
        </CustomFormContext.Provider>
    )
}

export function useCustomFormContext<T extends FieldValues>() {
    const context = useContext(CustomFormContext)
    return context as FormContextProps<T>
}
