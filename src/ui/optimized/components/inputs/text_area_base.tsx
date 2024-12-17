/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { formatAndValidate, InputType } from "./masks_and_validations/format_and_validation";

interface TextAreaBaseProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  onFocusChanged?: (isFocused: boolean) => void;
  onHoverChanged?: (isHovered: boolean) => void;
  onIsEmptyChanged?: (isEmpty: boolean) => void;
  onValidationError?: (error: string) => void;
}

// eslint-disable-next-line react/display-name
const TextAreaBase = forwardRef<HTMLTextAreaElement, TextAreaBaseProps>(
  (
    {
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
    const selfRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => selfRef.current!);

    useEffect(() => {
      if (selfRef?.current?.value) {
        onIsEmptyChanged && onIsEmptyChanged((selfRef?.current?.value.length ?? 0) < 1);
      }
    }, []);

    function onChangeHandler(event: React.FocusEvent<HTMLTextAreaElement>) {
      const { selectionStart } = event.currentTarget;
      const startLength = event.currentTarget.value.length;

      const result = formatAndValidate(event.currentTarget.value, 'Any');
      if (result.isValid) event.currentTarget.value = result.value;

      if (onChange) onChange(event);
      if (!result.isValid && onValidationError) onValidationError(result.error);

      if (onIsEmptyChanged)
        onIsEmptyChanged(event?.currentTarget?.value == "" || event?.currentTarget?.value == undefined);

      const endLength = event.currentTarget.value.length;
      if (selectionStart) {
        event.currentTarget.selectionStart = selectionStart + endLength - startLength;
        event.currentTarget.selectionEnd = selectionStart + endLength - startLength;
      }
    }

    function onFocusHandler(event: React.FocusEvent<HTMLTextAreaElement>) {
      if (onFocus) onFocus(event);
      if (onFocusChanged) onFocusChanged(true);
    }

    function onBlurHandler(event: React.FocusEvent<HTMLTextAreaElement>) {
      if (onBlur) onBlur(event);
      if (onFocusChanged) onFocusChanged(false);
    }

    function onMouseEnterHandler(event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) {
      if (onMouseEnter) onMouseEnter(event);
      if (onHoverChanged) onHoverChanged(true);
    }

    function onMouseLeaveHandler(event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) {
      if (onMouseLeave) onMouseLeave(event);
      if (onHoverChanged) onHoverChanged(false);
    }

    return (
      <textarea

        tabIndex={!disabled ? undefined : -1}
        {...rest}
        onChange={(e) =>{
          e.target.value = e.target.value.toUpperCase()
          onChangeHandler(e as any)
        }}
        ref={selfRef}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
        className={`${rest.className} ${!disabled ? "" : "opacity-50 pointer-events-none bg-gray-300"} flex h-full w-full items-center rounded-lg px-4 pt-2 outline-none`}
      />
    );
  }
);

export default TextAreaBase;
