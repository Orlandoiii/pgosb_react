import React, { forwardRef, useState } from "react";

import InputController from "./input_controller";
import TextAreaBase from "./text_area_base";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  description?: string;
  error?: string | undefined;
  disable?: boolean;
  isEmpty?: boolean;
  isSubmited?: boolean;
  onValidationError?: (error: string) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ description = "", error = "", disable = false, isSubmited = false, onValidationError, ...rest }, ref) => {
    const [isHover, setIsHover] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    function isEmptyChanged(empty: boolean) {
      if (isEmpty != empty) setIsEmpty(empty);
    }

    return (
      <div className="relative">
        <TextAreaBase
          {...rest}
          ref={ref}
          disabled={disable}
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
    );
  }
);

export default TextArea;
