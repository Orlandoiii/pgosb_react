import {
    Control,
    DeepPartial,
    FieldErrors,
    FieldValues,
    UseFormRegister,
    UseFormSetValue,
} from 'react-hook-form'
import { createContext, useContext } from 'react'
import React from 'react'

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

export const FormContext = createContext<FormContextProps<any> | undefined>(
    undefined
)

export const useFormContext = <T extends FieldValues>() => {
    const context = useContext(FormContext)

    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider')
    } else return context as FormContextProps<T>
}
