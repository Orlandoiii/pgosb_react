import React, { forwardRef, useState } from 'react'
import { InputType } from './masks_and_validations/format_and_validation'
import TextInputBase from './text_input_base'
import InputController from './input_controller'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: InputType
    description?: string
    error?: string | undefined
    disable?: boolean
    isEmpty?: boolean
    isSubmited?: boolean
    onValidationError?: (error: string) => void
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            type = 'Any',
            description = '',
            error = '',
            disable = false,
            isSubmited = false,
            onValidationError,
            ...rest
        },
        ref
    ) => {
        const [isHover, setIsHover] = useState(false)
        const [isFocus, setIsFocus] = useState(false)
        const [isEmpty, setIsEmpty] = useState(true)

        function isEmptyChanged(empty: boolean) {
            if (isEmpty != empty) setIsEmpty(empty)
        }

        return (
            <div
                className={`${description ? 'pt-7 pb-3 translate-y-0.5' : ''} w-full`}
            >
                <div className="relative">
                    <TextInputBase
                        tabIndex={disable ? -1 : undefined}
                        type={type}
                        {...rest}
                        ref={ref}
                        disabled={disable}
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() == 'enter') {
                                e.preventDefault()
                                e.stopPropagation()
                            }
                        }}
                        onFocusChanged={(isFocused) => setIsFocus(isFocused)}
                        onHoverChanged={(isHovered) => setIsHover(isHovered)}
                        onIsEmptyChanged={isEmptyChanged}
                        onValidationError={onValidationError}
                    />
                    <InputController
                        description={description}
                        error={error}
                        disable={disable}
                        isEmpty={isEmpty}
                        isHover={isHover}
                        isFocus={isFocus}
                        isSubmited={isSubmited}
                    />
                </div>
            </div>
        )
    }
)

export default TextInput
