import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react'

import {
    formatAndValidate,
    InputType,
} from './masks_and_validations/format_and_validation'

interface TextInputBaseProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    type: InputType
    onFocusChanged?: (isFocused: boolean) => void
    onHoverChanged?: (isHovered: boolean) => void
    onIsEmptyChanged?: (isEmpty: boolean) => void
    onValidationError?: (error: string) => void
}

const TextInputBase = forwardRef<HTMLInputElement, TextInputBaseProps>(
    (
        {
            type,
            onFocusChanged,
            onHoverChanged,
            onIsEmptyChanged,
            onValidationError,
            onFocus,
            onBlur,
            onMouseEnter,
            onMouseLeave,
            onChange,
            disabled,
            ...rest
        },
        ref
    ) => {
        const selfRef = useRef<HTMLInputElement>(null)
        useImperativeHandle(ref, () => selfRef.current!)

        useEffect(() => {
            if (selfRef?.current?.value) {
                const result = formatAndValidate(
                    selfRef.current.value ?? '',
                    type
                )
                onIsEmptyChanged &&
                    onIsEmptyChanged((selfRef?.current?.value.length ?? 0) < 1)
                if (result.isValid) selfRef.current.value = result.value
            }
        }, [])

        function onChangeHandler(event: React.FocusEvent<HTMLInputElement>) {
            const { selectionStart } = event.currentTarget
            const startLength = event.currentTarget.value.length
            console.log('Changed')

            const result = formatAndValidate(event.currentTarget.value, type)
            if (result.isValid) event.currentTarget.value = result.value
            console.log('Formatted', result)

            if (onChange) onChange(event)
            if (!result.isValid && onValidationError)
                onValidationError(result.error)

            if (onIsEmptyChanged)
                onIsEmptyChanged(
                    event?.currentTarget?.value == '' ||
                        event?.currentTarget?.value == undefined
                )

            const endLength = event.currentTarget.value.length
            if (selectionStart) {
                event.currentTarget.selectionStart =
                    selectionStart + endLength - startLength
                event.currentTarget.selectionEnd =
                    selectionStart + endLength - startLength
            }
        }

        function onFocusHandler(event: React.FocusEvent<HTMLInputElement>) {
            if (onFocus) onFocus(event)
            if (onFocusChanged) onFocusChanged(true)
        }

        function onBlurHandler(event: React.FocusEvent<HTMLInputElement>) {
            if (onBlur) onBlur(event)
            if (onFocusChanged) onFocusChanged(false)
        }

        function onMouseEnterHandler(
            event: React.MouseEvent<HTMLInputElement, MouseEvent>
        ) {
            if (onMouseEnter) onMouseEnter(event)
            if (onHoverChanged) onHoverChanged(true)
        }

        function onMouseLeaveHandler(
            event: React.MouseEvent<HTMLInputElement, MouseEvent>
        ) {
            if (onMouseLeave) onMouseLeave(event)
            if (onHoverChanged) onHoverChanged(false)
        }

        function textPositionClass() {
            if (type === 'Amount' || type === 'Decimal' || type === 'Integer')
                return 'justify-end'
            else return 'justify-start'
        }

        return (
            <input
                tabIndex={!disabled ? undefined : -1}
                type="text"
                {...rest}
                ref={selfRef}
                onChange={onChangeHandler}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onMouseEnter={onMouseEnterHandler}
                onMouseLeave={onMouseLeaveHandler}
                className={`${rest.className} ${textPositionClass()} ${!disabled ? '' : 'opacity-50 pointer-events-none bg-gray-300'} bg-transparent flex h-11 w-full items-center rounded-md px-3 outline-none`}
            />
        )
    }
)

export default TextInputBase
