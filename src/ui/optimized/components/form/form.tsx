import {
    DefaultValues,
    FieldValues,
    useForm,
    UseFormSetValue,
} from 'react-hook-form'
import React, {
    LegacyRef,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormContext } from './form_context'

interface FormProps<T extends FieldValues> {
    schema: z.ZodSchema<T>
    initValue?: T | null
    onSubmit: (data: z.infer<z.ZodSchema<T>>) => void
    children: ReactNode
    setFormValue?: (setValue: UseFormSetValue<T>) => void
    className?: string
}

export default function Form<T extends FieldValues>({
    schema,
    initValue = null,
    onSubmit,
    children,
    setFormValue,
    className,
}: FormProps<T>) {
    const [resetCount, setResetCount] = useState(0)
    const formRef = useRef<any>()

    const methods = useForm<T>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues: (initValue ?? {}) as DefaultValues<T>,
    })

    useEffect(() => {
        if (setFormValue) {
            setFormValue(methods.setValue)
        }
    }, [setFormValue])

    function formReset(event: React.FormEvent<HTMLFormElement>) {
        methods.reset(getDefaults(schema))
        setResetCount(resetCount + 1)
        event.preventDefault()
    }

    function manualSubmit() {
        if (formRef)
            formRef.current.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            )
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
                manualSubmit: manualSubmit,
            }}
        >
            <form
                noValidate
                ref={formRef}
                className={`${className}`}
                onSubmit={methods.handleSubmit((data) =>
                    onSubmit(schema.parse(data))
                )}
                onReset={formReset}
            >
                {children}
            </form>
        </FormContext.Provider>
    )
}

export function getDefaults<T extends FieldValues>(
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
