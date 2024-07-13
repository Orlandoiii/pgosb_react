import React from 'react'

import { FieldValues, UseFormRegister } from 'react-hook-form'
import Input from '../../core/inputs/Input'

interface Input2Porps<T extends FieldValues> {
    register: UseFormRegister<T>
    rules?: any
    description: string
    placeHolder?: string
    errors?: string | any
    key: keyof T
    isSubmitted: boolean
}

function Input2<T extends FieldValues>({
    register,
    rules = null,
    key,
    description,
    placeHolder = '',
    isSubmitted,
    errors = '',
}: Input2Porps<T>) {
    return (
        <Input
            turnOffAutoCompleted={false}
            controlled={false}
            readOnly={false}
            icons={false}
            onMouseDown={() => {}}
            inputRef={null}
            register={register as any}
            validationRules={rules}
            errMessage={errors}
            useStrongErrColor={isSubmitted}
            label={description}
            inputName={key}
            useDotLabel={true}
            value={''}
            type={''}
            onChangeEvent={() => {}}
            onFocus={() => {}}
            placeHolder={placeHolder}
        />
    )
}

export default Input2
