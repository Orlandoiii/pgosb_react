import React, { forwardRef, useState } from "react";

import { InputType } from "./masks_and_validations/format_and_validation";
import TextInputBase from "./text_input_base";
import InputController from "./input_controller";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  description?: string;
  error?: string | undefined;
  disable?: boolean;
  isEmpty?: boolean;
  isSubmited?: boolean;
  minLength?: number;
  maxLength?: number;
  onValidationError?: (error: string) => void;
}

// eslint-disable-next-line react/display-name
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { type = "Any", description = "", error = "", disable = false, isSubmited = false, onValidationError, minLength = 0 , maxLength = 200, ...rest },
    ref
  ) => {
    const [isHover, setIsHover] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    function isEmptyChanged(empty: boolean) {
      if (isEmpty != empty) setIsEmpty(empty);
    }

    return (
      <div className={`${description ? 'pt-7 pb-3 translate-y-0.5' : ''} h-full w-full`}>
        <div className="relative h-12 w-full">
          <TextInputBase
            className="h-full w-full"
            type={type}
            {...rest}
            ref={ref}
            disabled={disable}
            onFocusChanged={(isFocused) => setIsFocus(isFocused)}
            onHoverChanged={(isHovered) => setIsHover(isHovered)}
            onIsEmptyChanged={isEmptyChanged}
            onValidationError={onValidationError}
            minLength={minLength}
            maxLength={maxLength}
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
    );
  }
);

export default TextInput;
