import React, { useState } from 'react'

import { FieldValues, useForm, UseFormRegister } from 'react-hook-form'
import SelectWithSearch from '../../core/inputs/SelectWithSearch'

interface Select2Porps<T extends FieldValues> {
    options: any[]
    description: string
    isSubmitted: boolean
    onChange: (newValue: string) => void
}

function Select2<T extends FieldValues>({
    options,
    description,
    isSubmitted,
    onChange,
}: Select2Porps<T>) {
    var [value, setValue] = useState()
    var [error, setError] = useState()

    return (
        <SelectWithSearch
            inputName={''}
            type={''}
            onChangeRaw={() => {}}
            label={description}
            useDotLabel={true}
            options={options}
            value={value}
            onChange={(v) => {
                setValue(v)
                onChange(v)
            }}
            openUp={false}
            onError={(err) => {
                setError(err)
            }}
            useStrongErrColor={isSubmitted}
        />

        // <Select
        //     label={description}
        //     useDotLabel={true}
        //     options={options}
        //     value={value}
        //     onChange={(v) => {
        //         setValue(v)

        //         onChange(v)
        //     }}
        //     type={''}
        //     onChangeRaw={() => {}}
        //     openUp={false}
        // />
    )
}

export default Select2
